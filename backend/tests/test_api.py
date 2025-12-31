from fastapi.testclient import TestClient
from backend.main import app
import pytest

client = TestClient(app)

def test_health_check_root():
    """Test the root endpoint health check."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "backend-ai"}

def test_get_settings_default():
    """Test fetching settings returns defaults or valid data."""
    response = client.get("/api/settings/")
    # If DB is empty, it returns defaults with status 200
    assert response.status_code == 200
    data = response.json()
    assert "provider" in data
    assert "model_name" in data
    assert "temperature" in data

def test_get_stats():
    """Test stats endpoint."""
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_messages" in data
    assert "active_sessions" in data
    assert "system_status" in data

# Note: Testing /api/chat requires mocking the DB session and LLM, 
# which is more complex for this basic suite. 
# We focus on ensuring the API structure is valid.
