from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone

class Observation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    adventureId: Optional[str] = None
    checkpointIndex: Optional[int] = None
    title: str = "Nature Discovery"
    note: Optional[str] = ""
    photoBase64: Optional[str] = None
    mood: Optional[str] = "✨"  # 🙂, 😌, 🤔, ✨
    soundDescription: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    locationName: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None
    educationalInsights: Optional[Dict[str, Any]] = None

class ObservationAnalysisRequest(BaseModel):
    imageBase64: Optional[str] = None
    note: Optional[str] = None
    subjectHint: Optional[str] = None
    location: Optional[str] = None
    useDemo: Optional[bool] = False

class ObservationAnalysisResponse(BaseModel):
    identification: str
    confidence: str  # "High" | "Medium" | "Tentative"
    whatNoticed: List[str]
    howToVerify: List[str]
    safetyDisclaimer: str = "Educational identification only. Never touch, ingest, or approach unknown wild plants or wildlife."
    educationalContext: str
    providerUsed: str = "local_gemma"
    latencyMs: Optional[float] = 0.0
