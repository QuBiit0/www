import json
import os
import re
from typing import Dict, Any

def load_portfolio_data() -> Dict[str, Any]:
    """
    Loads the structured portfolio data from the JSON file.
    Returns a dictionary with the data or an empty dict on error.
    """
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "data", "portfolio.json")
        
        if not os.path.exists(file_path):
            print(f"Warning: Portfolio data file not found at {file_path}")
            return {}
            
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading portfolio data: {e}")
        return {}

def save_portfolio_data(data: Dict[str, Any]) -> bool:
    """
    Saves the structured portfolio data to the JSON file.
    Returns True upon success, False otherwise.
    """
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "data", "portfolio.json")
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving portfolio data: {e}")
        return False

def validate_email(email: str) -> bool:
    """Basic email validation regex."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

# Simple in-memory cache for LLM instances to avoid recreating them on every request
_llm_cache = {}

def get_cached_llm(provider: str, model: str, api_key: str, temperature: float = 0.7):
    """
    Returns a cached LLM instance if available, otherwise None.
    Cache key is based on provider, model, api_key (masked), and temperature.
    """
    key = f"{provider}:{model}:{api_key[-5:]}:{temperature}"
    return _llm_cache.get(key)

def set_cached_llm(provider: str, model: str, api_key: str, llm_instance, temperature: float = 0.7):
    """Caches an LLM instance."""
    key = f"{provider}:{model}:{api_key[-5:]}:{temperature}"
    _llm_cache[key] = llm_instance
