from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from database import get_db
from models import SystemSettings
from auth_service import get_current_admin

router = APIRouter(prefix="/api/settings", tags=["settings"])

class SettingsSchema(BaseModel):
    provider: str
    model_name: str
    api_key: str | None = None
    base_url: str | None = None
    temperature: float | None = 0.7

@router.get("/", response_model=SettingsSchema)
async def get_settings(
    db: AsyncSession = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalars().first()
    
    if not settings:
        # Return defaults if no DB entry yet
        return SettingsSchema(
            provider="gemini",
            model_name="gemini-2.5-flash-lite",
            api_key="",
            base_url="",
            temperature=0.7
        )
    return settings

@router.post("/")
async def update_settings(
    new_settings: SettingsSchema,
    db: AsyncSession = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    # Validate provider
    valid_providers = ["gemini", "openai", "groq", "custom"]
    if new_settings.provider not in valid_providers:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid provider. Must be one of: {', '.join(valid_providers)}"
        )
    
    result = await db.execute(select(SystemSettings).limit(1))
    settings = result.scalars().first()
    
    if not settings:
        settings = SystemSettings()
        db.add(settings)
    
    settings.provider = new_settings.provider
    settings.model_name = new_settings.model_name
    if new_settings.api_key:
        settings.api_key = new_settings.api_key
    settings.base_url = new_settings.base_url
    settings.temperature = str(new_settings.temperature)
    
    await db.commit()
    await db.refresh(settings)
    
    # In a real app, you might emit an event here to reload the Agent
    return {"status": "updated", "config": new_settings}
