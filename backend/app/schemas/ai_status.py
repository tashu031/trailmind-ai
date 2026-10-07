from typing import Optional, Dict, Any
from pydantic import BaseModel

class AIStatusResponse(BaseModel):
    engine: str = "Gemma (Open-Weight)"
    runtime: str = "Ollama / Local"
    modelName: str
    status: str  # "connected" | "standby" | "fallback"
    latencyMs: float
    mode: str  # "LOCAL AI" | "CLOUD" | "OFFLINE RULE ENGINE"
    totalInferences: int
    successCount: int
    failureCount: int
    fallbackAvailable: bool = True
    providerName: str
    ollamaBaseUrl: str
    details: Optional[Dict[str, Any]] = None

class MemoryQueryRequest(BaseModel):
    query: str
    adventures: Optional[list] = None  # Client can provide local adventures if offline from DB

class MemoryQueryResponse(BaseModel):
    query: str
    summary: str
    relevantAdventuresCount: int
    insights: list[str]
    providerUsed: str
    latencyMs: float
