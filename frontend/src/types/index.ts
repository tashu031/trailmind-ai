export interface Checkpoint {
  id: string;
  title: string;
  instruction: string;
  durationMinutes: number;
  requiresPhoto: boolean;
  requiresNote: boolean;
  tips?: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  durationMinutes: number;
  difficulty: string;
  summary: string;
  preparation: string[];
  safetyNotes: string[];
  checkpoints: Checkpoint[];
  bonusChallenge?: string;
  completionMessage?: string;
  createdAt: string;
  providerUsed?: string;
  latencyMs?: number;
}

export interface EducationalInsights {
  identification: string;
  confidence: string;
  whatNoticed: string[];
  howToVerify: string[];
  safetyDisclaimer: string;
  educationalContext: string;
  providerUsed?: string;
}

export interface Observation {
  id: string;
  adventureId?: string;
  checkpointIndex?: number;
  title: string;
  note?: string;
  photoBase64?: string;
  mood?: string;
  soundDescription?: string;
  timestamp: string;
  locationName?: string;
  coordinates?: { lat: number; lng: number };
  educationalInsights?: EducationalInsights;
}

export interface AdventureReflections {
  surprised?: string;
  missed?: string;
  felt?: string;
  nextTime?: string;
}

export interface Journal {
  id: string;
  adventureId?: string;
  title: string;
  date: string;
  durationMinutes: number;
  missionsCompleted: number;
  totalMissions: number;
  observationsCount: number;
  photosCount: number;
  screenLightMinutes: number;
  outsideScore: number;
  narrativeStory: string;
  discoveries: string[];
  favoriteMoment: string;
  whatINoticed: string;
  nextTime: string;
  shareCardText: string;
  createdAt: string;
  providerUsed?: string;
}

export interface Adventure {
  id: string;
  title: string;
  activity: string;
  difficulty: string;
  location?: string;
  durationMinutes: number;
  screenLightMinutes: number;
  outsideScore: number;
  mission: Mission;
  observations: Observation[];
  reflections?: AdventureReflections;
  journal?: Journal;
  completedAt?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface AIStatus {
  engine: string;
  runtime: string;
  modelName: string;
  status: 'connected' | 'standby' | 'fallback' | 'offline_fallback';
  latencyMs: number;
  mode: 'LOCAL AI' | 'CLOUD' | 'OFFLINE RULE ENGINE';
  totalInferences: number;
  successCount: number;
  failureCount: number;
  fallbackAvailable: boolean;
  providerName: string;
  ollamaBaseUrl: string;
  details?: Record<string, any>;
}

export interface UserPreferences {
  userName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  availableTimeMinutes: number;
  activity: string;
  difficulty: string;
  interests: string[];
  preferences: string[];
  useDemo?: boolean;
}
