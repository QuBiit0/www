import pytest
from backend.utils import load_portfolio_data, validate_email, get_cached_llm, set_cached_llm
import os

# Set working directory to backend for file loading tests if needed, 
# though utils uses __file__ relative path which is robust.

def test_validate_email_valid():
    assert validate_email("test@example.com") == True
    assert validate_email("user.name@domain.co.uk") == True

def test_validate_email_invalid():
    assert validate_email("invalid-email") == False
    assert validate_email("test@domain") == False
    assert validate_email("@domain.com") == False

def test_load_portfolio_data():
    data = load_portfolio_data()
    assert isinstance(data, dict)
    # Check for required keys based on our schema
    assert "personal_info" in data
    assert "skills" in data
    assert "experience" in data
    
    # Check content integrity
    assert data["personal_info"]["name"] == "Leandro Martín Alvarez"
    assert len(data["skills"]) > 0

def test_llm_cache():
    # Mock LLM object
    mock_llm = {"id": "test-model"}
    
    # Set cache
    set_cached_llm("openai", "gpt-4", "sk-123456", mock_llm)
    
    # Get cache
    cached = get_cached_llm("openai", "gpt-4", "sk-123456")
    assert cached == mock_llm
    
    # Miss cache (different key params)
    assert get_cached_llm("openai", "gpt-3.5", "sk-123456") is None
    assert get_cached_llm("openai", "gpt-4", "sk-other") is None
