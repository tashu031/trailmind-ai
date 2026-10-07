import time
from typing import Dict, Any, Optional
from app.config import settings
from app.ai.base import AIProvider
from app.ai.local_gemma import LocalGemmaProvider
from app.ai.cloud_provider import OptionalCloudProvider
from app.ai.fallback_engine import FallbackRuleEngine

class AIProviderFactory:
    """
    Orchestrates AI providers with seamless fallbacks.
    Prioritizes local Gemma via Ollama to uphold user privacy and zero cloud dependence.
    Falls back gracefully to procedural generation or demo engine when Ollama is offline.
    """
    def __init__(self):
        self.local_provider = LocalGemmaProvider()
        self.cloud_provider = OptionalCloudProvider()
        self.fallback_provider = FallbackRuleEngine()
        self._last_health_check_time = 0
        self._cached_health_status = None

    async def get_active_provider(self, force_demo: bool = False) -> AIProvider:
        if force_demo:
            return self.fallback_provider

        # Check local Ollama health first
        local_health = await self.local_provider.check_health()
        if local_health.get("connected") and local_health.get("model_ready"):
            return self.local_provider

        # If cloud provider explicitly configured
        if settings.CLOUD_AI_PROVIDER != "none" and settings.CLOUD_AI_API_KEY:
            cloud_health = await self.cloud_provider.check_health()
            if cloud_health.get("connected"):
                return self.cloud_provider

        # Default to Fallback Rule Engine
        return self.fallback_provider

    async def get_system_status(self) -> Dict[str, Any]:
        local_health = await self.local_provider.check_health()
        cloud_health = await self.cloud_provider.check_health()

        active_name = "Local Gemma (Ollama)"
        mode = "LOCAL AI"
        status_label = "connected" if local_health.get("connected") else "offline_fallback"
        active_model = settings.GEMMA_MODEL

        if local_health.get("connected") and local_health.get("model_ready"):
            mode = "LOCAL AI"
            active_model = settings.GEMMA_MODEL
            status_label = "connected"
        elif cloud_health.get("connected"):
            active_name = f"Cloud ({settings.CLOUD_AI_PROVIDER})"
            mode = "CLOUD"
            active_model = settings.CLOUD_AI_MODEL or "gemma-2-9b"
            status_label = "connected"
        else:
            active_name = "Offline Rule Engine (Demo Mode)"
            mode = "OFFLINE RULE ENGINE"
            status_label = "standby"

        total_inf = (self.local_provider.total_inferences + 
                     self.cloud_provider.total_inferences + 
                     self.fallback_provider.total_inferences)
        success_inf = (self.local_provider.success_count + 
                       self.cloud_provider.success_count + 
                       self.fallback_provider.success_count)
        fail_inf = (self.local_provider.failure_count + 
                    self.cloud_provider.failure_count + 
                    self.fallback_provider.failure_count)

        last_latency = (self.local_provider.last_latency_ms or 
                        self.cloud_provider.last_latency_ms or 
                        self.fallback_provider.last_latency_ms or 0.0)

        return {
            "engine": "Gemma Open-Weight AI",
            "runtime": active_name,
            "modelName": active_model,
            "status": status_label,
            "latencyMs": round(last_latency, 2),
            "mode": mode,
            "totalInferences": total_inf,
            "successCount": success_inf,
            "failureCount": fail_inf,
            "fallbackAvailable": True,
            "providerName": active_name,
            "ollamaBaseUrl": settings.OLLAMA_BASE_URL,
            "details": {
                "localOllama": local_health,
                "cloudProvider": cloud_health,
                "fallbackReady": True
            }
        }

    async def generate_mission(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        force_demo = request_data.get("useDemo", False)
        provider = await self.get_active_provider(force_demo=force_demo)
        try:
            return await provider.generate_mission(request_data)
        except Exception:
            # Automatic graceful fallback to rule engine
            return await self.fallback_provider.generate_mission(request_data)

    async def analyze_observation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        force_demo = request_data.get("useDemo", False)
        provider = await self.get_active_provider(force_demo=force_demo)
        try:
            return await provider.analyze_observation(request_data)
        except Exception:
            return await self.fallback_provider.analyze_observation(request_data)

    async def generate_journal(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        force_demo = request_data.get("useDemo", False)
        provider = await self.get_active_provider(force_demo=force_demo)
        try:
            return await provider.generate_journal(request_data)
        except Exception:
            return await self.fallback_provider.generate_journal(request_data)

    async def query_memory(self, query: str, adventures: list) -> Dict[str, Any]:
        provider = await self.get_active_provider()
        try:
            return await provider.query_memory(query, adventures)
        except Exception:
            return await self.fallback_provider.query_memory(query, adventures)

ai_manager = AIProviderFactory()
