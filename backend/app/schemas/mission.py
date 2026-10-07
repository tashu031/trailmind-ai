from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone

class Checkpoint(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    title: str
    instruction: str
    durationMinutes: int = Field(default=5, ge=1, le=60)
    requiresPhoto: bool = False
    requiresNote: bool = False
    tips: Optional[str] = None
    completed: bool = False

class Mission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    durationMinutes: int
    difficulty: str
    summary: str
    preparation: List[str] = Field(default_factory=list)
    safetyNotes: List[str] = Field(default_factory=list)
    checkpoints: List[Checkpoint]
    bonusChallenge: Optional[str] = None
    completionMessage: Optional[str] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    providerUsed: str = "local_gemma"
    latencyMs: Optional[float] = 0.0

class MissionGenerationRequest(BaseModel):
    availableTimeMinutes: int = Field(default=45, ge=10, le=180)
    activity: str = "Nature Walk"
    difficulty: str = "Easy"
    interests: List[str] = Field(default_factory=lambda: ["Plants", "Photography"])
    preferences: List[str] = Field(default_factory=list)
    location: Optional[str] = "Nearby Park or Trail"
    coordinates: Optional[Dict[str, float]] = None
    userName: Optional[str] = "Explorer"
    useDemo: Optional[bool] = False
