import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Adventure, Mission, Observation, UserPreferences } from '../types';

interface TrailMindDB extends DBSchema {
  adventures: {
    key: string;
    value: Adventure;
    indexes: { 'by-date': string };
  };
  activeMission: {
    key: string;
    value: {
      mission: Mission;
      startedAt: number;
      currentCheckpointIndex: number;
      screenLightSeconds: number;
      observations: Observation[];
      preferences?: UserPreferences;
    };
  };
  observations: {
    key: string;
    value: Observation;
    indexes: { 'by-adventure': string };
  };
  settings: {
    key: string;
    value: any;
  };
  syncQueue: {
    key: string;
    value: {
      id: string;
      kind: 'adventure';
      payload: Adventure;
      createdAt: string;
    };
  };
}

const DB_NAME = 'trailmind_local_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<TrailMindDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<TrailMindDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TrailMindDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('adventures')) {
          const advStore = db.createObjectStore('adventures', { keyPath: 'id' });
          advStore.createIndex('by-date', 'createdAt');
        }
        if (!db.objectStoreNames.contains('activeMission')) {
          db.createObjectStore('activeMission');
        }
        if (!db.objectStoreNames.contains('observations')) {
          const obsStore = db.createObjectStore('observations', { keyPath: 'id' });
          obsStore.createIndex('by-adventure', 'adventureId');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue');
        }
      },
    });
  }
  return dbPromise;
}

// Adventure Local Operations
export async function saveAdventureLocal(adventure: Adventure): Promise<void> {
  const db = await getDB();
  await db.put('adventures', adventure);
}

export async function getAllAdventuresLocal(): Promise<Adventure[]> {
  const db = await getDB();
  const adventures = await db.getAll('adventures');
  return adventures.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdventureLocal(id: string): Promise<Adventure | undefined> {
  const db = await getDB();
  return db.get('adventures', id);
}

// Active Mission Persistence (for offline resilience & resume)
export async function saveActiveMissionState(state: {
  mission: Mission;
  startedAt: number;
  currentCheckpointIndex: number;
  screenLightSeconds: number;
  observations: Observation[];
  preferences?: UserPreferences;
}): Promise<void> {
  const db = await getDB();
  await db.put('activeMission', state, 'current');
}

export async function getActiveMissionState(): Promise<{
  mission: Mission;
  startedAt: number;
  currentCheckpointIndex: number;
  screenLightSeconds: number;
  observations: Observation[];
  preferences?: UserPreferences;
} | undefined> {
  const db = await getDB();
  return db.get('activeMission', 'current');
}

export async function clearActiveMissionState(): Promise<void> {
  const db = await getDB();
  await db.delete('activeMission', 'current');
}

// Observation Operations
export async function saveObservationLocal(obs: Observation): Promise<void> {
  const db = await getDB();
  await db.put('observations', obs);
}

export async function getObservationsLocal(adventureId: string): Promise<Observation[]> {
  const db = await getDB();
  return db.getAllFromIndex('observations', 'by-adventure', adventureId);
}


// Lightweight offline-to-cloud sync queue. The queue is local and survives
// browser restarts, so a completed adventure is never lost just because the
// backend was temporarily unavailable.
export async function queueCloudSync(payload: Adventure): Promise<void> {
  const db = await getDB();
  const id = `sync-${payload.id}`;
  await db.put('syncQueue', {
    id,
    kind: 'adventure',
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function getPendingCloudSyncs(): Promise<Array<{
  id: string;
  kind: 'adventure';
  payload: Adventure;
  createdAt: string;
}>> {
  const db = await getDB();
  return db.getAll('syncQueue');
}

export async function removePendingCloudSync(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('syncQueue', id);
}
