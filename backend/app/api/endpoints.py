from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List, Dict, Any, Optional
from app.schemas.mission import Mission, MissionGenerationRequest
from app.schemas.observation import Observation, ObservationAnalysisRequest, ObservationAnalysisResponse
from app.schemas.journal import Journal, JournalGenerationRequest
from app.schemas.adventure import Adventure, AdventureCreateRequest
from app.schemas.ai_status import AIStatusResponse, MemoryQueryRequest, MemoryQueryResponse
from app.services.mission_service import mission_service
from app.services.observation_service import observation_service
from app.services.journal_service import journal_service
from app.services.voice_service import voice_service
from app.ai.factory import ai_manager
from app.database.mongo import db_manager

router = APIRouter()

@router.post("/mission/generate", response_model=Mission)
async def generate_mission(request: MissionGenerationRequest):
    try:
        return await mission_service.generate_mission(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mission generation error: {str(e)}")

@router.post("/mission/regenerate", response_model=Mission)
async def regenerate_mission(request: MissionGenerationRequest):
    try:
        # Regenerate fresh variations
        return await mission_service.generate_mission(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mission regeneration error: {str(e)}")

@router.post("/observation/analyze", response_model=ObservationAnalysisResponse)
async def analyze_observation(request: ObservationAnalysisRequest):
    try:
        return await observation_service.analyze_observation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Observation analysis error: {str(e)}")

@router.post("/journal/generate", response_model=Journal)
async def generate_journal(request: JournalGenerationRequest):
    try:
        return await journal_service.generate_journal(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Journal generation error: {str(e)}")

@router.get("/adventures", response_model=List[Dict[str, Any]])
async def get_adventures(limit: int = 50):
    try:
        return await db_manager.get_adventures(limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch adventures: {str(e)}")

@router.get("/adventures/{adventure_id}")
async def get_adventure_by_id(adventure_id: str):
    adv = await db_manager.get_adventure_by_id(adventure_id)
    if not adv:
        raise HTTPException(status_code=404, detail="Adventure not found")
    return adv

@router.post("/adventures")
async def save_adventure(payload: AdventureCreateRequest):
    try:
        adv_dict = payload.adventure.model_dump()
        saved_id = await db_manager.save_adventure(adv_dict)
        return {"status": "success", "id": saved_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save adventure: {str(e)}")

@router.post("/observations")
async def save_observation(observation: Observation):
    try:
        obs_dict = observation.model_dump()
        obs_id = await db_manager.save_observation(obs_dict)
        return {"status": "success", "id": obs_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save observation: {str(e)}")

@router.get("/ai/status", response_model=AIStatusResponse)
async def get_ai_status():
    try:
        status_data = await ai_manager.get_system_status()
        return AIStatusResponse(**status_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inspecting AI status: {str(e)}")

@router.post("/ai/memory", response_model=MemoryQueryResponse)
async def query_ai_memory(request: MemoryQueryRequest):
    try:
        adventures = request.adventures
        if not adventures:
            adventures = await db_manager.get_adventures(limit=20)
        
        result = await ai_manager.query_memory(request.query, adventures)
        return MemoryQueryResponse(
            query=request.query,
            summary=result.get("summary", "No relevant past observations found."),
            relevantAdventuresCount=result.get("relevantAdventuresCount", len(adventures)),
            insights=result.get("insights", []),
            providerUsed=result.get("providerUsed", "nature_memory"),
            latencyMs=result.get("latencyMs", 1.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying AI memory: {str(e)}")

@router.post("/voice/speak")
async def voice_speak(payload: Dict[str, str]):
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text required")

    audio_bytes = await voice_service.synthesize_speech(text)
    if not audio_bytes:
        raise HTTPException(
            status_code=503,
            detail="ElevenLabs voice is not configured or unavailable. Use Web Speech synthesis fallback."
        )

    return Response(content=audio_bytes, media_type="audio/mpeg")
