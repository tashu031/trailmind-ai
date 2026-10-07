import pytest
from app.ai.json_utils import extract_and_parse_json
from app.ai.fallback_engine import FallbackRuleEngine
from app.services.journal_service import JournalService

def test_json_extraction_clean():
    raw = '{"title": "Forest Journey", "durationMinutes": 30}'
    parsed = extract_and_parse_json(raw)
    assert parsed is not None
    assert parsed["title"] == "Forest Journey"

def test_json_extraction_markdown_fence():
    raw = """Here is your generated mission:
```json
{
  "title": "Creek Walk",
  "durationMinutes": 45,
  "difficulty": "Easy"
}
```
Enjoy your walk!"""
    parsed = extract_and_parse_json(raw)
    assert parsed is not None
    assert parsed["title"] == "Creek Walk"

def test_json_extraction_trailing_comma():
    raw = '{"title": "Trail", "duration": 15,}'
    parsed = extract_and_parse_json(raw)
    assert parsed is not None
    assert parsed["title"] == "Trail"

@pytest.mark.asyncio
async def test_fallback_engine_mission():
    engine = FallbackRuleEngine()
    req = {
        "availableTimeMinutes": 30,
        "activity": "Nature Walk",
        "difficulty": "Easy",
        "interests": ["Plants", "Sounds"],
        "useDemo": True
    }
    result = await engine.generate_mission(req)
    assert "title" in result
    assert len(result["checkpoints"]) >= 3
    assert result["durationMinutes"] == 30

def test_outside_score_calculation():
    # 45 min outside, 5 missions completed, 4 observations, 2 min screen light, has reflections
    score = JournalService.calculate_outside_score(
        duration_minutes=45,
        missions_completed=5,
        observations_count=4,
        screen_light_minutes=2,
        has_reflections=True
    )
    # 40 (time) + 25 (missions) + 20 (obs) + 10 (refl) + 5 (screen bonus) = 100
    assert score == 100
    assert 0 <= score <= 100
