from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime, timezone
from app.schemas.mission import Mission
from app.schemas.observation import Observation
from app.schemas.journal import Journal, AdventureReflections

class Adventure(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    activity: str
    difficulty: str
    location: Optional[str] = "Outdoors"
    durationMinutes: int
    screenLightMinutes: int
    outsideScore: int
    mission: Mission
    observations: List[Observation] = Field(default_factory=list)
    reflections: Optional[AdventureReflections] = None
    journal: Optional[Journal] = None
    completedAt: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    isDemo: bool = False

class AdventureCreateRequest(BaseModel):
    adventure: Adventure
