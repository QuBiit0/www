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
    return bool(re.match(pattern, email))

def extract_pdf_context() -> str:
    """
    scans 'frontend/public' for PDF files (CVs) and extracts text content.
    Returns a consolidated string of all PDF text to inject into Agent context.
    """
    try:
        from pypdf import PdfReader
        
        # Locate frontend/public relative to backend/utils.py
        base_dir = os.path.dirname(os.path.abspath(__file__))
        public_dir = os.path.join(base_dir, "..", "frontend", "public")
        
        if not os.path.exists(public_dir):
            print(f"Warning: Public dir not found at {public_dir}")
            return ""

        consolidated_text = ""
        pdf_count = 0
        
        for filename in os.listdir(public_dir):
            if filename.lower().endswith(".pdf"):
                pdf_path = os.path.join(public_dir, filename)
                try:
                    reader = PdfReader(pdf_path)
                    text = f"\n--- CONTENT FROM FILE: {filename} ---\n"
                    for page in reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text += extracted + "\n"
                    consolidated_text += text
                    pdf_count += 1
                except Exception as e:
                    print(f"Error reading PDF {filename}: {e}")

        if pdf_count > 0:
            print(f"DEBUG: Successfully extracted text from {pdf_count} PDF files.")
            return consolidated_text
        else:
            return ""

    except ImportError:
        print("Error: pypdf not installed. Cannot read CVs.")
        return ""
    except Exception as e:
        print(f"Error in extract_pdf_context: {e}")
        return ""

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
