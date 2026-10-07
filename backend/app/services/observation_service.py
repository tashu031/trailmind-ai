from app.schemas.observation import ObservationAnalysisRequest, ObservationAnalysisResponse
from app.ai.factory import ai_manager

class ObservationService:
    @staticmethod
    async def analyze_observation(request: ObservationAnalysisRequest) -> ObservationAnalysisResponse:
        try:
            import sentry_sdk
            span_ctx = sentry_sdk.start_span(op="ai.inference", name="analyzeObservation")
        except Exception:
            span_ctx = None

        if span_ctx:
            with span_ctx:
                analysis_dict = await ai_manager.analyze_observation(request.model_dump())
        else:
            analysis_dict = await ai_manager.analyze_observation(request.model_dump())

        return ObservationAnalysisResponse(**analysis_dict)

observation_service = ObservationService()
