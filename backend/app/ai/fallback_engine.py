import time
import uuid
from typing import Dict, Any, List
from app.ai.base import AIProvider

class FallbackRuleEngine(AIProvider):
    """
    High-fidelity offline generative engine and Hacktoberfest Demo Engine.
    Used when local Ollama is not yet installed or when running in offline demo mode.
    Guarantees the application never crashes, adheres to Touch Grass philosophy,
    and returns rich structured JSON.
    """
    def __init__(self):
        super().__init__(name="FallbackRuleEngine")

    async def check_health(self) -> Dict[str, Any]:
        return {
            "connected": True,
            "status": "fallback_active",
            "latency_ms": 1.2,
            "installed_models": ["demo-procedural-gemma", "jaipur-nature-detective"],
            "target_model": "gemma2:2b (emulated/fallback)",
            "model_ready": True,
            "runtime": "Offline Rule Engine (Demo Mode Active)"
        }

    async def generate_mission(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        time_mins = int(request_data.get("availableTimeMinutes", 30))
        activity = request_data.get("activity", "Nature Walk")
        difficulty = request_data.get("difficulty", "Easy")
        interests = request_data.get("interests", ["Plants", "Photography"])
        location = request_data.get("location", "Urban Park / Outdoor Path")
        is_demo = request_data.get("useDemo", False) or "Jaipur" in str(location)

        if is_demo or "Jaipur" in str(location):
            # Hacktoberfest Canonical Demo Mission
            res = {
                "id": str(uuid.uuid4()),
                "title": "Jaipur Urban Nature Detective: The Ancient Canopy",
                "durationMinutes": 30,
                "difficulty": "Easy",
                "summary": "Step into Jaipur's urban greenery. Tune your senses to indigenous Neem leaves, urban birdcalls, and sun patterns on sandstone.",
                "preparation": [
                    "Carry a refillable water bottle",
                    "Wear lightweight comfortable walking shoes",
                    "Keep your phone silenced and in your pocket until audio alerts"
                ],
                "safetyNotes": [
                    "Stay on designated garden and heritage paths",
                    "Do not touch wild stray animals or disturb nesting birds",
                    "Mind the afternoon sun; seek shade when pausing"
                ],
                "checkpoints": [
                    {
                        "id": "chk-1",
                        "title": "The Leaf Architecture Hunt",
                        "instruction": "Find two contrasting leaves: one serrated (like Neem) and one broad. Notice the vein symmetry and texture without picking them.",
                        "durationMinutes": 6,
                        "requiresPhoto": True,
                        "requiresNote": True,
                        "tips": "Look closely at the underside where veins protrude.",
                        "completed": False
                    },
                    {
                        "id": "chk-2",
                        "title": "Stop for 60 Seconds: Sound Mapping",
                        "instruction": "Screen down. Close your eyes for 60 seconds. Distinguish between mechanical city hum and natural sound (birds, rustling wind).",
                        "durationMinutes": 5,
                        "requiresPhoto": False,
                        "requiresNote": True,
                        "tips": "Notice which sound is furthest away.",
                        "completed": False
                    },
                    {
                        "id": "chk-3",
                        "title": "Seasonal Evidence Check",
                        "instruction": "Look along the tree trunks and soil. Find one unmistakable sign of the current season (dry pods, fresh green shoots, or sun cracks).",
                        "durationMinutes": 6,
                        "requiresPhoto": False,
                        "requiresNote": False,
                        "tips": "Check the transition between path and earth.",
                        "completed": False
                    },
                    {
                        "id": "chk-4",
                        "title": "Micro-Landscape Portrait",
                        "instruction": "Capture a close-up photo of natural weathering: lichen on stone or bark furrowing. Focus purely on natural geometry.",
                        "durationMinutes": 7,
                        "requiresPhoto": True,
                        "requiresNote": True,
                        "tips": "Get within 12 inches for maximum texture detail.",
                        "completed": False
                    },
                    {
                        "id": "chk-5",
                        "title": "Stillness Observation",
                        "instruction": "Find a quiet bench or shaded rock. Sit motionless for two minutes. Notice what movement returns once you stop moving.",
                        "durationMinutes": 6,
                        "requiresPhoto": False,
                        "requiresNote": False,
                        "tips": "Insects and birds return when human movement ceases.",
                        "completed": False
                    }
                ],
                "bonusChallenge": "Notice three different shades of green within one square meter.",
                "completionMessage": "Take a deep breath. Notice the calm in your chest before stepping back to the digital screen."
            }
        else:
            # Procedural Generation tailored to user inputs
            checkpoints = self._procedural_checkpoints(time_mins, interests, activity)
            res = {
                "id": str(uuid.uuid4()),
                "title": f"The {interests[0] if interests else 'Sensory'} Micro-Trail",
                "durationMinutes": time_mins,
                "difficulty": difficulty,
                "summary": f"A mindful {time_mins}-minute {activity.lower()} designed to immerse you in your surroundings with minimal screen distraction.",
                "preparation": [
                    "Silenced mobile phone in pocket",
                    "Hydration bottle",
                    "Curious, observant mindset"
                ],
                "safetyNotes": [
                    "Stay on public paths and marked trails",
                    "Watch your footing on unpaved surfaces",
                    "Respect local wildlife and plants"
                ],
                "checkpoints": checkpoints,
                "bonusChallenge": "Spot something in nature that matches the color of your shoes or shirt.",
                "completionMessage": "You've successfully gifted yourself mindful time outside."
            }

        latency = (time.perf_counter() - start) * 1000.0
        self.record_success(latency)
        res["providerUsed"] = "offline_rule_engine"
        res["latencyMs"] = round(latency, 2)
        return res

    def _procedural_checkpoints(self, time_mins: int, interests: List[str], activity: str) -> List[Dict[str, Any]]:
        pool = [
            {
                "title": "Soundscape Calibration",
                "instruction": "Halt your footsteps. Put the phone in your pocket for 60 seconds. Identify three distinct layers of sound.",
                "durationMinutes": 5,
                "requiresPhoto": False,
                "requiresNote": True,
                "tips": "Breathe slowly to quieten your own breathing."
            },
            {
                "title": "Texture Discovery",
                "instruction": "Touch three distinct natural surfaces (tree bark, smooth stone, fallen leaf). Notice temperature and roughness differences.",
                "durationMinutes": 6,
                "requiresPhoto": False,
                "requiresNote": False,
                "tips": "Compare north-facing tree bark with south-facing bark."
            },
            {
                "title": "Macro Photography Clue",
                "instruction": "Photograph an intricate natural pattern that most passersby would overlook (vein branching, soil swirl, dew droplet).",
                "durationMinutes": 7,
                "requiresPhoto": True,
                "requiresNote": True,
                "tips": "Frame the shot with natural diffused sunlight."
            },
            {
                "title": "Light & Shadow Observation",
                "instruction": "Look upward through the canopy or surrounding architecture. Watch how sunlight filters through foliage for 90 seconds.",
                "durationMinutes": 6,
                "requiresPhoto": False,
                "requiresNote": False,
                "tips": "Notice if shadows sway with the breeze."
            },
            {
                "title": "Sensory Horizon Pause",
                "instruction": "Stand still at a high or open vantage point. Take three deep outdoor breaths. Smell the soil and ambient air.",
                "durationMinutes": 6,
                "requiresPhoto": False,
                "requiresNote": True,
                "tips": "Notice the scent of petrichor, ozone, or dry pine."
            }
        ]

        count = 3 if time_mins <= 20 else (4 if time_mins <= 45 else 5)
        selected = pool[:count]
        # Re-index
        for i, chk in enumerate(selected, 1):
            chk["id"] = f"chk-{i}"
            chk["completed"] = False
        return selected

    async def analyze_observation(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        note = (request_data.get("note") or "").lower()
        hint = (request_data.get("subjectHint") or "").lower()

        if "leaf" in note or "tree" in note or "neem" in note or "plant" in note or "green" in note:
            res = {
                "identification": "Azadirachta indica (Neem / Margosa Specimen)",
                "confidence": "Medium-High",
                "whatNoticed": [
                    "Pinnate leaf structure with curved, serrated leaflets",
                    "Strong asymmetric base characteristic of sub-tropical foliage",
                    "Resilient glossy cuticle surface adapted to drought"
                ],
                "howToVerify": [
                    "Crush a fallen leaf tip gently to detect characteristic bitter aroma",
                    "Examine bark furrowing: mature specimens display deep longitudinal fissures",
                    "Observe axillary panicles during seasonal flowering periods"
                ],
                "safetyDisclaimer": "Educational identification only. Never ingest, touch, or handle unfamiliar wild flora without expert botanical verification.",
                "educationalContext": "Neem is celebrated in traditional ecology for its natural pest-repellent compounds (azadirachtin) and exceptional shade canopy cooling."
            }
        elif "bird" in note or "feather" in note or "wing" in note or "sing" in note:
            res = {
                "identification": "Urban Passerine / Native Songbird",
                "confidence": "Medium",
                "whatNoticed": [
                    "Compact body contour adapted for agile branch navigation",
                    "Short, conical bill morphology suited for seed and insect foraging",
                    "Rapid vocal chirping pulses indicating territorial acoustic mapping"
                ],
                "howToVerify": [
                    "Observe breast plumage pigmentation and eye-stripe markings",
                    "Note flight pattern: undulating dips vs. direct gliding",
                    "Listen for alarm call tempo compared to contact calls"
                ],
                "safetyDisclaimer": "Educational identification only. Keep a respectful distance of at least 15 feet to avoid causing nesting stress.",
                "educationalContext": "Urban songbirds modulate their song pitch higher to pierce through low-frequency anthropogenic city noise."
            }
        else:
            res = {
                "identification": "Natural Geological & Botanical Formation",
                "confidence": "Medium",
                "whatNoticed": [
                    "Mineral weathering patterns alongside micro-lichen colonies",
                    "Organic sediment accumulation in surface crevices",
                    "Micro-ecosystem supporting localized moisture retention"
                ],
                "howToVerify": [
                    "Check friability and grain size under indirect sunlight",
                    "Inspect surrounding vegetative canopy for moisture runoff patterns",
                    "Compare color tone between shadowed and exposed facets"
                ],
                "safetyDisclaimer": "Educational identification only. Leave natural elements undisturbed to preserve microhabitats.",
                "educationalContext": "Even the smallest boulder or log fosters micro-climates that support hundreds of microbial and invertebrate species."
            }

        latency = (time.perf_counter() - start) * 1000.0
        self.record_success(latency)
        res["providerUsed"] = "offline_rule_engine"
        res["latencyMs"] = round(latency, 2)
        return res

    async def generate_journal(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        start = time.perf_counter()
        title = request_data.get("adventureTitle", "The Outdoor Discovery")
        duration = request_data.get("durationMinutes", 30)
        screen_light = request_data.get("screenLightMinutes", 2)
        observations = request_data.get("observations", [])
        reflections = request_data.get("reflections", {})

        surprised = reflections.get("surprised") or "How quiet the world becomes when you stop to listen."
        missed = reflections.get("missed") or "The subtle variety of green tones hiding in plain sight."
        felt = reflections.get("felt") or "Refreshed, calm, and grounded."
        next_time = reflections.get("nextTime") or "Explore the water edge at dawn."

        obs_count = len(observations)
        photos_count = sum(1 for o in observations if o.get("photoBase64"))

        narrative = (
            f"Stepping away from glowing glass screens, this {duration}-minute journey began with an intentional breath outside. "
            f"Over the course of the expedition, the world expanded into rich textures and acoustic layers that ordinary rushing ignores. "
            f"With only {screen_light} minutes of active screen-light, attention shifted where it belongs: to the pulse of the living earth.\n\n"
            f"Through {obs_count} recorded discoveries, what stood out most was how nature rewards slow contemplation. "
            f"{surprised} {felt.capitalize()}, this walk proved that adventure is not a distant summit, but an attentive way of seeing."
        )

        discoveries = [
            f"🌿 Detailed structure of {observations[0].get('title') if obs_count > 0 else 'canopy leaf architecture'}",
            f"🐦 Layered outdoor soundscape with birdsong and wind rustle",
            f"📸 Natural weathering patterns captured under ambient sunlight"
        ]

        res = {
            "title": title,
            "narrativeStory": narrative,
            "discoveries": discoveries,
            "favoriteMoment": f"Pausing in stillness: {missed}",
            "whatINoticed": surprised,
            "nextTime": next_time,
            "shareCardText": f"Spent {duration} mindful minutes outside, reclaiming attention from the screen."
        }

        latency = (time.perf_counter() - start) * 1000.0
        self.record_success(latency)
        res["providerUsed"] = "offline_rule_engine"
        res["latencyMs"] = round(latency, 2)
        return res

    async def query_memory(self, query: str, adventures: list) -> Dict[str, Any]:
        start = time.perf_counter()
        count = len(adventures)
        res = {
            "query": query,
            "summary": f"Across your {count} recorded adventures, you have consistently observed diverse plant species, morning birdsong, and subtle weathering patterns.",
            "relevantAdventuresCount": count,
            "insights": [
                "You frequently notice soundscapes and calm textures during morning walks.",
                "Your screen-light time averages under 4 minutes per outing.",
                "Previous walks in parks noted leaf symmetry and bird vocalizations."
            ]
        }
        latency = (time.perf_counter() - start) * 1000.0
        self.record_success(latency)
        res["providerUsed"] = "offline_rule_engine"
        res["latencyMs"] = round(latency, 2)
        return res
