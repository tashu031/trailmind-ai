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

class LocalGemmaProvider(AIProvider):
    """
    Open-weight Gemma implementation running locally via Ollama.
    Employs Ollama's native JSON mode and async HTTP client.
    Guarantees zero cloud leakage for private outdoor observations.
    """
    def __init__(self, base_url: str = None, model: str = None):
        super().__init__(name="LocalGemmaProvider")
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.GEMMA_MODEL
        self.vision_model = settings.GEMMA_VISION_MODEL

    async def _call_ollama(self, prompt: str, system: str = "", images: List[str] = None, model: str = None) -> str:
        selected_model = model or self.model
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": selected_model,
            "prompt": prompt,
            "system": system,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.4,
                "top_p": 0.9,
            }
        }
        if images:
            payload["images"] = images

        async with httpx.AsyncClient(timeout=settings.AI_TIMEOUT_SECONDS) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("response", "")

    async def check_health(self) -> Dict[str, Any]:
        url = f"{self.base_url}/api/tags"
        start = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(url)
                latency = (time.perf_counter() - start) * 1000.0
                if resp.status_code == 200:
                    models_data = resp.json()
                    models = [m.get("name", "") for m in models_data.get("models", [])]
                    has_model = any(self.model in m for m in models)
                    return {
                        "connected": True,
                        "status": "connected" if has_model else "model_missing",
                        "latency_ms": round(latency, 2),
                        "installed_models": models,
                        "target_model": self.model,
                        "model_ready": has_model,
                        "runtime": "Ollama (Local)"
                    }
        except Exception as e:
            pass

        return {
            "connected": False,
            "status": "unavailable",
            "latency_ms": 0.0,
            "installed_models": [],
            "target_model": self.model,
            "model_ready": False,
            "runtime": "Ollama (Local)"
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

        try:
            raw_response = await self._call_ollama(prompt=prompt, system=MISSION_SYSTEM_PROMPT)
            parsed = extract_and_parse_json(raw_response)
            latency = (time.perf_counter() - start) * 1000.0

            if parsed and "checkpoints" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"local_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid structured JSON schema returned from Gemma")
        except Exception as e:
            self.record_failure()
            raise e

    async def analyze_observation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        image_b64 = request_data.get("imageBase64")
        note = request_data.get("note", "Unspecified nature observation")
        location = request_data.get("location", "Local natural environment")
        hint = request_data.get("subjectHint", "Wild botanical / natural specimen")

        prompt = OBSERVATION_USER_PROMPT_TEMPLATE.format(
            note=note,
            location=location,
            subject_hint=hint
        )

        images = [image_b64] if image_b64 else None
        target_model = self.vision_model if images else self.model

        try:
            raw_response = await self._call_ollama(
                prompt=prompt,
                system=OBSERVATION_SYSTEM_PROMPT,
                images=images,
                model=target_model
            )
            parsed = extract_and_parse_json(raw_response)
            latency = (time.perf_counter() - start) * 1000.0

            if parsed and "identification" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"local_gemma ({target_model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid structured JSON for observation")
        except Exception as e:
            self.record_failure()
            raise e

    async def generate_journal(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        observations = request_data.get("observations", [])
        obs_lines = []
        for i, o in enumerate(observations, 1):
            title = o.get("title", f"Discovery #{i}")
            note = o.get("note", "")
            mood = o.get("mood", "✨")
            obs_lines.append(f"- [{mood}] {title}: {note}")
        obs_summary = "\n".join(obs_lines) if obs_lines else "Mindful visual and auditory observations during trail walk."

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

        try:
            raw_response = await self._call_ollama(prompt=prompt, system=JOURNAL_SYSTEM_PROMPT)
            parsed = extract_and_parse_json(raw_response)
            latency = (time.perf_counter() - start) * 1000.0

            if parsed and "narrativeStory" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"local_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid structured JSON for journal")
        except Exception as e:
            self.record_failure()
            raise e

    async def query_memory(self, query: str, adventures: list) -> Dict[str, Any]:
        start = time.perf_counter()
        history_lines = []
        for adv in adventures[:10]:
            title = adv.get("title", "Adventure")
            date = adv.get("completedAt") or adv.get("createdAt", "Recent")
            obs_list = adv.get("observations", [])
            obs_notes = "; ".join([f"{o.get('title')}: {o.get('note')}" for o in obs_list[:3]])
            history_lines.append(f"- {date}: {title} (Observations: {obs_notes})")
        history_summary = "\n".join(history_lines) if history_lines else "No past recorded adventures."

        prompt = MEMORY_USER_PROMPT_TEMPLATE.format(
            query=query,
            history_summary=history_summary,
            relevant_count=len(adventures)
        )

        try:
            raw_response = await self._call_ollama(prompt=prompt, system=MEMORY_SYSTEM_PROMPT)
            parsed = extract_and_parse_json(raw_response)
            latency = (time.perf_counter() - start) * 1000.0

            if parsed and "summary" in parsed:
                self.record_success(latency)
                parsed["providerUsed"] = f"local_gemma ({self.model})"
                parsed["latencyMs"] = round(latency, 2)
                return parsed
            raise ValueError("Invalid structured JSON for memory")
        except Exception as e:
            self.record_failure()
            raise e
