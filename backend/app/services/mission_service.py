from app.schemas.mission import Mission, MissionGenerationRequest
from app.ai.factory import ai_manager
import uuid

class MissionService:
    @staticmethod
    async def generate_mission(request: MissionGenerationRequest) -> Mission:
        try:
            import sentry_sdk
            span_ctx = sentry_sdk.start_span(op="ai.inference", name="generateMission")
        except Exception:
            span_ctx = None

        if span_ctx:
            with span_ctx:
                mission_dict = await ai_manager.generate_mission(request.model_dump())
        else:
            mission_dict = await ai_manager.generate_mission(request.model_dump())

        # Ensure ID and checkpoints format
        if "id" not in mission_dict or not mission_dict["id"]:
            mission_dict["id"] = str(uuid.uuid4())

        return Mission(**mission_dict)

mission_service = MissionService()
