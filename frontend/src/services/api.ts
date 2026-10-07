import {
  Mission,
  Observation,
  Journal,
  Adventure,
  AIStatus,
  UserPreferences,
  AdventureReflections
} from '../types';
import { queueCloudSync, getPendingCloudSyncs, removePendingCloudSync } from './db';

const API_BASE = '/api';

export async function checkBackendHealth(): Promise<{ online: boolean; data?: any }> {
  try {
    const res = await fetch('/health', { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
  } catch (err) {
    // Backend offline or unreachable
  }
  return { online: false };
}

export async function fetchAIStatus(): Promise<AIStatus> {
  try {
    const res = await fetch(`${API_BASE}/ai/status`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Offline / Standby status
  }

  return {
    engine: 'Gemma (Open-Weight)',
    runtime: 'Offline Edge Engine',
    modelName: 'gemma2:2b (local standby)',
    status: 'offline_fallback',
    latencyMs: 1.0,
    mode: 'OFFLINE RULE ENGINE',
    totalInferences: 0,
    successCount: 0,
    failureCount: 0,
    fallbackAvailable: true,
    providerName: 'Offline Standby',
    ollamaBaseUrl: 'http://localhost:11434',
  };
}

export async function generateMissionAPI(prefs: UserPreferences): Promise<Mission> {
  try {
    const res = await fetch(`${API_BASE}/mission/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prefs),
      signal: AbortSignal.timeout(35000), // Allow time for local model inference
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API mission generation error or offline, activating client fallback:', err);
  }

  // Client-Side Offline Fallback Generator
  return generateClientOfflineMission(prefs);
}

export async function regenerateMissionAPI(prefs: UserPreferences): Promise<Mission> {
  return generateMissionAPI(prefs);
}

export async function analyzeObservationAPI(params: {
  imageBase64?: string;
  note?: string;
  subjectHint?: string;
  location?: string;
  useDemo?: boolean;
}): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/observation/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(25000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API observation analysis offline:', err);
  }

  // Client-Side Nature Detective Fallback
  return {
    identification: "Native Sub-tropical Foliage Specimen",
    confidence: "Medium",
    whatNoticed: [
      "Alternate leaf arrangement with defined venation",
      "Cuticle adaptation for ambient light harvesting",
      "Natural chlorophyll pigmentation gradient"
    ],
    howToVerify: [
      "Check petiole attachment and underside vein ridge",
      "Look for surrounding parent tree or shrub bark patterns",
      "Inspect seasonal flower or bud clusters nearby"
    ],
    safetyDisclaimer: "Educational identification only. Never ingest, touch, or handle unfamiliar wild flora without expert botanical guidance.",
    educationalContext: "Foliage in urban and natural margins plays a crucial role in microclimate cooling and particulate capture.",
    providerUsed: "client_offline_engine",
    latencyMs: 2.0
  };
}

export async function generateJournalAPI(params: {
  adventureTitle: string;
  durationMinutes: number;
  missionsCompleted: number;
  totalMissions: number;
  screenLightMinutes: number;
  activity: string;
  location?: string;
  observations: Observation[];
  reflections: AdventureReflections;
  useDemo?: boolean;
}): Promise<Journal> {
  try {
    const res = await fetch(`${API_BASE}/journal/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(35000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API journal generation offline:', err);
  }

  // Client-side Journal Generation
  const duration = params.durationMinutes;
  const screenLight = params.screenLightMinutes;
  const obsCount = params.observations.length;
  const photosCount = params.observations.filter(o => o.photoBase64).length;
  const surprised = params.reflections.surprised || "How much life exists when you stop rushing.";
  const missed = params.reflections.missed || "The subtle sounds of rustling wind and birds.";
  const felt = params.reflections.felt || "Grounded, quiet, and refreshed.";
  const nextTime = params.reflections.nextTime || "Explore a new quiet pathway at dawn.";

  // Score calculation
  const durPts = Math.min(40, duration);
  const misPts = Math.min(25, params.missionsCompleted * 5);
  const obsPts = Math.min(20, obsCount * 5);
  const reflPts = 10;
  const scrBonus = screenLight <= 5 ? 5 : 0;
  const score = Math.min(100, durPts + misPts + obsPts + reflPts + scrBonus);

  return {
    id: 'journal-' + Date.now(),
    title: params.adventureTitle,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    durationMinutes: duration,
    missionsCompleted: params.missionsCompleted,
    totalMissions: params.totalMissions,
    observationsCount: obsCount,
    photosCount: photosCount,
    screenLightMinutes: screenLight,
    outsideScore: score,
    narrativeStory: `Stepping away from glowing screens into the open air, this ${duration}-minute journey transformed an ordinary walk into quiet discovery. For ${duration - screenLight} screen-free minutes, the senses recalibrated to the physical texture of the outdoors.\n\n` +
      `Stopping to observe and listen revealed details usually lost in the rush. ${surprised} ${felt.charAt(0).toUpperCase() + felt.slice(1)}, this adventure proved that nature doesn't require hours of travel—it only asks for intentional attention.`,
    discoveries: [
      `🌿 Noticed intricate natural patterns across ${obsCount} observations`,
      `🐦 Soundscape pause revealed layered outdoor acoustics`,
      `📸 Captured mindful details under ambient sunlight`
    ],
    favoriteMoment: `The pause of stillness: ${missed}`,
    whatINoticed: surprised,
    nextTime: nextTime,
    shareCardText: `Spent ${duration} mindful minutes outside with TrailMind AI, leaving the screen behind.`,
    createdAt: new Date().toISOString(),
    providerUsed: 'client_offline_engine'
  };
}

export async function saveAdventureToCloud(adventure: Adventure): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/adventures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adventure }),
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) return true;
  } catch (err) {
    // Queue below so an intermittent connection never loses the adventure.
  }

  await queueCloudSync(adventure).catch(() => undefined);
  return false;
}

export async function syncPendingCloudData(): Promise<number> {
  const pending = await getPendingCloudSyncs();
  let synced = 0;

  for (const item of pending) {
    if (item.kind !== 'adventure') continue;
    try {
      const res = await fetch(`${API_BASE}/adventures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventure: item.payload }),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        await removePendingCloudSync(item.id);
        synced += 1;
      }
    } catch {
      break;
    }
  }

  return synced;
}

export async function fetchCloudAdventures(): Promise<Adventure[]> {
  try {
    const res = await fetch(`${API_BASE}/adventures`, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Cloud offline
  }
  return [];
}

export async function queryAIMemory(query: string, adventures: Adventure[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/ai/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, adventures }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Offline client synthesis
  }

  return {
    query,
    summary: `Based on your ${adventures.length} saved adventures, you've accumulated rich memories of outdoor flora, soundscapes, and seasonal transitions.`,
    relevantAdventuresCount: adventures.length,
    insights: [
      "You consistently notice sensory soundscapes and fine leaf textures during walks.",
      "Your outdoor engagement is high, keeping screen-light times under 5 minutes.",
      "Recent entries emphasize a sense of grounded calm away from digital notifications."
    ],
    providerUsed: "client_offline_memory",
    latencyMs: 1.0
  };
}

// Client offline procedural mission generator
function generateClientOfflineMission(prefs: UserPreferences): Mission {
  const isDemo = prefs.useDemo || prefs.location.toLowerCase().includes('jaipur');
  const duration = prefs.availableTimeMinutes || 30;

  if (isDemo) {
    return {
      id: 'mission-jaipur-demo',
      title: "Jaipur Urban Nature Detective: The Ancient Canopy",
      durationMinutes: 30,
      difficulty: "Easy",
      summary: "Step into Jaipur's urban greenery. Tune your senses to indigenous Neem leaves, urban birdcalls, and sun patterns on sandstone.",
      preparation: [
        "Carry a refillable water bottle",
        "Wear lightweight comfortable walking shoes",
        "Keep your phone silenced and in your pocket until audio alerts"
      ],
      safetyNotes: [
        "Stay on designated garden and heritage paths",
        "Do not touch wild stray animals or disturb nesting birds",
        "Mind the afternoon sun; seek shade when pausing"
      ],
      checkpoints: [
        {
          id: 'chk-1',
          title: "The Leaf Architecture Hunt",
          instruction: "Find two contrasting leaves: one serrated (like Neem) and one broad. Notice the vein symmetry and texture without picking them.",
          durationMinutes: 6,
          requiresPhoto: true,
          requiresNote: true,
          tips: "Look closely at the underside where veins protrude.",
          completed: false
        },
        {
          id: 'chk-2',
          title: "Stop for 60 Seconds: Sound Mapping",
          instruction: "Screen down. Close your eyes for 60 seconds. Distinguish between mechanical city hum and natural sound (birds, rustling wind).",
          durationMinutes: 5,
          requiresPhoto: false,
          requiresNote: true,
          tips: "Notice which sound is furthest away.",
          completed: false
        },
        {
          id: 'chk-3',
          title: "Seasonal Evidence Check",
          instruction: "Look along the tree trunks and soil. Find one unmistakable sign of the current season (dry pods, fresh green shoots, or sun cracks).",
          durationMinutes: 6,
          requiresPhoto: false,
          requiresNote: false,
          tips: "Check the transition between path and earth.",
          completed: false
        },
        {
          id: 'chk-4',
          title: "Micro-Landscape Portrait",
          instruction: "Capture a close-up photo of natural weathering: lichen on stone or bark furrowing. Focus purely on natural geometry.",
          durationMinutes: 7,
          requiresPhoto: true,
          requiresNote: true,
          tips: "Get within 12 inches for maximum texture detail.",
          completed: false
        },
        {
          id: 'chk-5',
          title: "Stillness Observation",
          instruction: "Find a quiet bench or shaded rock. Sit motionless for two minutes. Notice what movement returns once you stop moving.",
          durationMinutes: 6,
          requiresPhoto: false,
          requiresNote: false,
          tips: "Insects and birds return when human movement ceases.",
          completed: false
        }
      ],
      bonusChallenge: "Notice three different shades of green within one square meter.",
      completionMessage: "Take a deep breath. Notice the calm in your chest before stepping back to the digital screen.",
      createdAt: new Date().toISOString(),
      providerUsed: "offline_client_engine",
      latencyMs: 1.0
    };
  }

  return {
    id: 'mission-' + Date.now(),
    title: `The ${prefs.interests[0] || 'Sensory'} Micro-Trail`,
    durationMinutes: duration,
    difficulty: prefs.difficulty || 'Easy',
    summary: `A mindful ${duration}-minute ${prefs.activity.toLowerCase()} to immerse your senses in nature with near-zero screen time.`,
    preparation: [
      "Comfortable walking shoes",
      "Silenced phone placed in pocket",
      "Hydration water bottle"
    ],
    safetyNotes: [
      "Stay on established walkways and trails",
      "Watch your footing on uneven terrain",
      "Never approach or disturb wild animals"
    ],
    checkpoints: [
      {
        id: 'chk-1',
        title: "Sensory Soundscape Pause",
        instruction: "Stop completely. Put your phone in your pocket for 60 seconds. Count how many distinct layers of natural sound you can hear.",
        durationMinutes: 5,
        requiresPhoto: false,
        requiresNote: true,
        tips: "Close your eyes to sharpen your hearing.",
        completed: false
      },
      {
        id: 'chk-2',
        title: "Tactile Texture Check",
        instruction: "Gently touch three different natural textures (e.g. tree bark, smooth stone, fallen leaf). Notice the contrast in temperature.",
        durationMinutes: 6,
        requiresPhoto: false,
        requiresNote: false,
        tips: "Compare shaded vs sunlit surfaces.",
        completed: false
      },
      {
        id: 'chk-3',
        title: "Hidden Detail Capture",
        instruction: "Photograph an unexpected natural detail that most people walk right past without noticing (vein pattern, bark knot, insect track).",
        durationMinutes: 7,
        requiresPhoto: true,
        requiresNote: true,
        tips: "Frame close with natural soft light.",
        completed: false
      },
      {
        id: 'chk-4',
        title: "Horizon Stillness",
        instruction: "Find a comfortable vantage point. Inhale deeply three times. Notice how your breathing rhythm aligns with the open space.",
        durationMinutes: 6,
        requiresPhoto: false,
        requiresNote: false,
        tips: "Notice the scent of soil or air.",
        completed: false
      }
    ],
    bonusChallenge: "Spot a natural symmetry that resembles human geometric design.",
    completionMessage: "Congratulations on choosing real-world presence today.",
    createdAt: new Date().toISOString(),
    providerUsed: "offline_client_engine",
    latencyMs: 1.0
  };
}
