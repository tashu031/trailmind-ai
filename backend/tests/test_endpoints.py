import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_generate_mission_api():
    payload = {
        "availableTimeMinutes": 30,
        "activity": "Nature Walk",
        "difficulty": "Easy",
        "interests": ["Plants", "Photography"],
        "location": "Jaipur City Forest",
        "useDemo": True
    }
    response = client.post("/api/mission/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "title" in data
    assert "checkpoints" in data
    assert len(data["checkpoints"]) > 0

def test_analyze_observation_api():
    payload = {
        "note": "Noticed asymmetric serrated leaf pattern on a tall tree",
        "subjectHint": "Leaf",
        "location": "Central Garden",
        "useDemo": True
    }
    response = client.post("/api/observation/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "identification" in data
    assert "safetyDisclaimer" in data
    assert len(data["whatNoticed"]) > 0

def test_generate_journal_api():
    payload = {
        "adventureTitle": "Morning Flora Expedition",
        "durationMinutes": 45,
        "missionsCompleted": 5,
        "totalMissions": 5,
        "screenLightMinutes": 3,
        "activity": "Nature Walk",
        "location": "Botanical Park",
        "observations": [
            {
                "title": "Neem Leaf Symmetry",
                "note": "Sharp serrated edge with strong central vein",
                "mood": "✨"
            }
        ],
        "reflections": {
            "surprised": "How many bird sounds were audible once I stood still.",
            "missed": "The texture of rough tree bark in the shade.",
            "felt": "Very peaceful and detached from notifications.",
            "nextTime": "Bring a magnifying glass."
        },
        "useDemo": True
    }
    response = client.post("/api/journal/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "narrativeStory" in data
    assert "outsideScore" in data
    assert data["outsideScore"] > 0
    assert len(data["discoveries"]) > 0

def test_ai_status_api():
    response = client.get("/api/ai/status")
    assert response.status_code == 200
    data = response.json()
    assert "runtime" in data
    assert "mode" in data
    assert "status" in data
