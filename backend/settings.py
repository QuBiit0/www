from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App Config
    APP_NAME: str = "Leandro Alvarez Portfolio Agent"
    APP_VERSION: str = "1.0.0"
    
    # LLM Config
    OPENAI_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None
    MODEL_PROVIDER: str = "openai" # "openai" or "gemini"
    MODEL_NAME: str = "gpt-4o"
    
    # Database Config
    DATABASE_URL: str | None = None

    # Auth Config
    SECRET_KEY: str = "supersecretkey_change_me_in_prod" # TODO: Change in Production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
