import asyncio
from database import AsyncSessionLocal
from models import SystemSettings
from sqlalchemy import select

async def fix_settings():
    async with AsyncSessionLocal() as sess:
        result = await sess.execute(select(SystemSettings))
        settings = result.scalars().first()
        
        if settings:
            print(f"Current Provider: {settings.provider}")
            print(f"Current Model: {settings.model_name}")
            
            # Fix model name
            settings.model_name = "gemini-2.0-flash-exp"
            
            await sess.commit()
            print(f"✅ Updated model to: {settings.model_name}")
        else:
            print("No settings found - creating default")
            new_settings = SystemSettings(
                provider="gemini",
                model_name="gemini-2.0-flash-exp",
                api_key=None,
                temperature="0.7"
            )
            sess.add(new_settings)
            await sess.commit()
            print("✅ Created default settings with gemini-2.0-flash-exp")

asyncio.run(fix_settings())
