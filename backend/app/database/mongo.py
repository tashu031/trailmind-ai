from typing import List, Dict, Any, Optional
from datetime import datetime
from app.config import settings

class DatabaseManager:
    """
    Hybrid Database Manager.
    Uses MongoDB Atlas when MONGODB_URI is provided.
    Falls back gracefully to in-memory store if MongoDB is offline or unconfigured.
    Local-first IndexedDB is simultaneously used on the client.
    """
    def __init__(self):
        self._client = None
        self._db = None
        self._connected = False
        self._in_memory_adventures: List[Dict[str, Any]] = []
        self._in_memory_observations: List[Dict[str, Any]] = []

    async def connect(self):
        if not settings.MONGODB_URI:
            return

        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            self._client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
            # Ping database to confirm
            await self._client.admin.command('ping')
            self._db = self._client[settings.MONGODB_DB_NAME]
            self._connected = True
            print(f"[Database] Successfully connected to MongoDB Atlas: {settings.MONGODB_DB_NAME}")
        except Exception as e:
            self._connected = False
            print(f"[Database] MongoDB Atlas unavailable ({e}). Using in-memory store.")

    def is_connected(self) -> bool:
        return self._connected

    async def save_adventure(self, adventure: Dict[str, Any]) -> str:
        if self._connected and self._db is not None:
            try:
                col = self._db["adventures"]
                await col.update_one({"id": adventure["id"]}, {"$set": adventure}, upsert=True)
                return adventure["id"]
            except Exception as e:
                print(f"[Database] Error writing to Mongo: {e}")

        # In-memory fallback
        existing_idx = next((i for i, a in enumerate(self._in_memory_adventures) if a["id"] == adventure["id"]), -1)
        if existing_idx >= 0:
            self._in_memory_adventures[existing_idx] = adventure
        else:
            self._in_memory_adventures.insert(0, adventure)
        return adventure["id"]

    async def get_adventures(self, limit: int = 50) -> List[Dict[str, Any]]:
        if self._connected and self._db is not None:
            try:
                col = self._db["adventures"]
                cursor = col.find({}, {"_id": 0}).sort("createdAt", -1).limit(limit)
                return await cursor.to_list(length=limit)
            except Exception as e:
                print(f"[Database] Error fetching from Mongo: {e}")

        return self._in_memory_adventures[:limit]

    async def get_adventure_by_id(self, adventure_id: str) -> Optional[Dict[str, Any]]:
        if self._connected and self._db is not None:
            try:
                col = self._db["adventures"]
                doc = await col.find_one({"id": adventure_id}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                print(f"[Database] Error fetching adventure: {e}")

        for adv in self._in_memory_adventures:
            if adv.get("id") == adventure_id:
                return adv
        return None

    async def save_observation(self, observation: Dict[str, Any]) -> str:
        if self._connected and self._db is not None:
            try:
                col = self._db["observations"]
                await col.insert_one(observation)
                return observation["id"]
            except Exception as e:
                print(f"[Database] Error saving observation to Mongo: {e}")

        self._in_memory_observations.insert(0, observation)
        return observation["id"]

db_manager = DatabaseManager()
