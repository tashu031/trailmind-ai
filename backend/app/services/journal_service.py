from datetime import datetime, timezone
from app.schemas.journal import Journal, JournalGenerationRequest
from app.ai.factory import ai_manager

class JournalService:
    @staticmethod
    def calculate_outside_score(
        duration_minutes: int,
        missions_completed: int,
        observations_count: int,
        screen_light_minutes: int,
        has_reflections: bool
    ) -> int:
        """
        Calculates mindful outdoor engagement score (0 - 100).
        Non-competitive metric honoring presence, observation, and minimal screen time.
        """
        # Duration outside (capped at 40 points)
        duration_pts = min(40, duration_minutes)

        # Checkpoints completed (5 pts each, max 25 points)
        missions_pts = min(25, missions_completed * 5)

        # Sensory observations recorded (5 pts each, max 20 points)
        obs_pts = min(20, observations_count * 5)

        # Reflections completed (10 points)
        reflections_pts = 10 if has_reflections else 5

        # Screen light bonus: under 5 minutes of screen time gives +5 mindfulness bonus
        screen_bonus = 5 if screen_light_minutes <= 5 else 0

        total = duration_pts + missions_pts + obs_pts + reflections_pts + screen_bonus
        return min(100, max(10, total))

    @staticmethod
    async def generate_journal(request: JournalGenerationRequest) -> Journal:
        try:
            import sentry_sdk
            span_ctx = sentry_sdk.start_span(op="ai.inference", name="generateJournal")
        except Exception:
            span_ctx = None

        if span_ctx:
            with span_ctx:
                journal_dict = await ai_manager.generate_journal(request.model_dump())
        else:
            journal_dict = await ai_manager.generate_journal(request.model_dump())

        has_reflections = bool(
            request.reflections.surprised or 
            request.reflections.missed or 
            request.reflections.felt or 
            request.reflections.nextTime
        )

        outside_score = JournalService.calculate_outside_score(
            duration_minutes=request.durationMinutes,
            missions_completed=request.missionsCompleted,
            observations_count=len(request.observations),
            screen_light_minutes=request.screenLightMinutes,
            has_reflections=has_reflections
        )

        journal_dict["durationMinutes"] = request.durationMinutes
        journal_dict["missionsCompleted"] = request.missionsCompleted
        journal_dict["totalMissions"] = request.totalMissions
        journal_dict["observationsCount"] = len(request.observations)
        journal_dict["photosCount"] = sum(1 for o in request.observations if o.photoBase64)
        journal_dict["screenLightMinutes"] = request.screenLightMinutes
        journal_dict["outsideScore"] = outside_score
        journal_dict["date"] = datetime.now(timezone.utc).strftime("%B %d, %Y")

        return Journal(**journal_dict)

journal_service = JournalService()
