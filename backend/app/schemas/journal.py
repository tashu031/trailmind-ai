from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone
from app.schemas.observation import Observation

class AdventureReflections(BaseModel):
    surprised: Optional[str] = ""
    missed: Optional[str] = ""
    felt: Optional[str] = ""
    nextTime: Optional[str] = ""

class JournalGenerationRequest(BaseModel):
    adventureTitle: str
    durationMinutes: int
    missionsCompleted: int
    totalMissions: int
    screenLightMinutes: int
    activity: str = "Nature Walk"
    location: Optional[str] = "Outdoor Path"
    observations: List[Observation] = Field(default_factory=list)
    reflections: AdventureReflections = Field(default_factory=AdventureReflections)
    useDemo: Optional[bool] = False

class Journal(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    adventureId: Optional[str] = None
    title: str
    date: str
    durationMinutes: int
    missionsCompleted: int
    totalMissions: int
    observationsCount: int
    photosCount: int
    screenLightMinutes: int
    outsideScore: int
    narrativeStory: str
    discoveries: List[str]
    favoriteMoment: str
    whatINoticed: str
    nextTime: str
    shareCardText: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    providerUsed: str = "local_gemma"
    latencyMs: Optional[float] = 0.0
