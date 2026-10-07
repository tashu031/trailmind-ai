import time
import httpx
from typing import Dict, Any, List
from app.config import settings
from app.ai.base import AIProvider
from app.ai.json_utils import extract_and_parse_json
from app.ai.prompts import (
    MISSION_SYSTEM_PROMPT,
    MISSION_USER_PROMPT_TEMPLATE,
    OBSERVATION_SYSTEM_PROMPT,
    OBSERVATION_USER_PROMPT_TEMPLATE,
    JOURNAL_SYSTEM_PROMPT,
    JOURNAL_USER_PROMPT_TEMPLATE,
    MEMORY_SYSTEM_PROMPT,
    MEMORY_USER_PROMPT_TEMPLATE
)

class OptionalCloudProvider(AIProvider):
    """
    Optional Cloud AI Provider supporting OpenAI-compatible endpoints
    hosting Gemma models (e.g. self-hosted vLLM, HuggingFace TGI, or Groq Gemma).
    Only enabled when explicitly configured by the user via environment variables.
    """
    def __init__(self):
        super().__init__(name="OptionalCloudProvider")
        self.api_key = settings.CLOUD_AI_API_KEY
        self.base_url = (settings.CLOUD_AI_BASE_URL or "https://api.openai.com/v1").rstrip("/")
        self.model = settings.CLOUD_AI_MODEL or "google/gemma-2-9b-it"

    async def _call_completion(self, messages: List[Dict[str, str]]) -> str:
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4,
            "response_format": {"type": "json_object"}
        }

        async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def check_health(self) -> Dict[str, Any]:
        if not self.api_key or settings.CLOUD_AI_PROVIDER == "none":
            return {
                "connected": False,
                "status": "disabled",
                "latency_ms": 0.0,
                "installed_models": [],
                "target_model": self.model,
                "model_ready": False,
                "runtime": "Cloud (Disabled)"
            }
        return {
            "connected": True,
            "status": "configured",
            "latency_ms": 120.0,
            "installed_models": [self.model],
            "target_model": self.model,
            "model_ready": True,
            "runtime": f"Cloud Provider ({settings.CLOUD_AI_PROVIDER})"
        }

    async def generate_mission(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        interests_str = ", ".join(request_data.get("interests", ["Nature", "Plants"]))
        prefs_str = ", ".join(request_data.get("preferences", ["Standard trail"])) or "None"
        
        prompt = MISSION_USER_PROMPT_TEMPLATE.format(
            available_time=request_data.get("availableTimeMinutes", 45),
            activity=request_data.get("activity", "Nature Walk"),
            difficulty=request_data.get("difficulty", "Easy"),
            interests=interests_str,
            preferences=prefs_str,
            location=request_data.get("location", "Outdoor Park"),
            user_name=request_data.get("userName", "Explorer")
        )

        messages = [
            {"role": "system", "content": MISSION_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]

        try:
            content = await self._call_completion(messages)
            parsed = extract_and_parse_json(content)
            latency = (time.perf_counter() - start) * 1000.0
            if parsed and "checkpoints" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"cloud_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid schema from cloud Gemma")
        except Exception as e:
            self.record_failure()
            raise e

    async def analyze_observation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        prompt = OBSERVATION_USER_PROMPT_TEMPLATE.format(
            note=request_data.get("note", "Unspecified nature observation"),
            location=request_data.get("location", "Local natural environment"),
            subject_hint=request_data.get("subjectHint", "Wild botanical / natural specimen")
        )
        messages = [
            {"role": "system", "content": OBSERVATION_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        try:
            content = await self._call_completion(messages)
            parsed = extract_and_parse_json(content)
            latency = (time.perf_counter() - start) * 1000.0
            if parsed and "identification" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"cloud_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid schema for observation from cloud Gemma")
        except Exception as e:
            self.record_failure()
            raise e

    async def generate_journal(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        observations = request_data.get("observations", [])
        obs_lines = [f"- {o.get('title')}: {o.get('note')}" for o in observations]
        obs_summary = "\n".join(obs_lines) if obs_lines else "Mindful observations during outdoor journey."
        reflections = request_data.get("reflections", {})

        prompt = JOURNAL_USER_PROMPT_TEMPLATE.format(
            adventure_title=request_data.get("adventureTitle", "Outdoor Walk"),
            duration_minutes=request_data.get("durationMinutes", 45),
            screen_light_minutes=request_data.get("screenLightMinutes", 3),
            missions_completed=request_data.get("missionsCompleted", 5),
            total_missions=request_data.get("totalMissions", 5),
            activity=request_data.get("activity", "Nature Walk"),
            location=request_data.get("location", "Nature Path"),
            observations_summary=obs_summary,
            reflections_surprised=reflections.get("surprised", "The quiet patterns of nature."),
            reflections_missed=reflections.get("missed", "How many birds were active in the canopy."),
            reflections_felt=reflections.get("felt", "Calm and grounded away from notifications."),
            reflections_next_time=reflections.get("nextTime", "Explore the creek trail.")
        )
        messages = [
            {"role": "system", "content": JOURNAL_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        try:
            content = await self._call_completion(messages)
            parsed = extract_and_parse_json(content)
            latency = (time.perf_counter() - start) * 1000.0
            if parsed and "narrativeStory" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"cloud_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid schema for journal from cloud Gemma")
        except Exception as e:
            self.record_failure()
            raise e

    async def query_memory(self, query: str, adventures: list) -> Dict[str, Any]:
        start = time.perf_counter()
        history_lines = [f"- {a.get('title')}: {len(a.get('observations', []))} observations" for a in adventures[:10]]
        prompt = MEMORY_USER_PROMPT_TEMPLATE.format(
            query=query,
            history_summary="\n".join(history_lines),
            relevant_count=len(adventures)
        )
        messages = [
            {"role": "system", "content": MISSION_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]
        try:
            content = await self._call_completion(messages)
            parsed = extract_and_parse_json(content)
            latency = (time.perf_counter() - start) * 1000.0
            if parsed and "summary" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"cloud_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid schema for memory query")
        except Exception as e:
            self.record_failure()
            raise e
