from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import PortfolioData
import json
import os

async def get_portfolio_data(db: AsyncSession) -> dict:
    """Retrieves the active portfolio data from DB."""
    result = await db.execute(
        select(PortfolioData).where(PortfolioData.is_active == True).order_by(PortfolioData.id.desc()).limit(1)
    )
    record = result.scalars().first()
    
    if record and record.content:
        data = json.loads(record.content)
        print(f"DEBUG: Loaded Portfolio Data Type: {type(data)}")
        # Migration: Ensure Bilingual Structure
        if "es" not in data and "en" not in data:
            # Assume current data is Spanish, copy to both to start
            print("Migrating flat portfolio data to bilingual structure...")
            new_structure = {
                "es": data,
                "en": data # Duplicate as placeholder
            }
            # Optional: Update DB immediately with new structure
            return new_structure
        return data
    return {"es": {}, "en": {}}

async def save_portfolio_data(db: AsyncSession, data: dict) -> bool:
    """Saves new portfolio data version to DB."""
    try:
        # CRITICAL FIX: Deactivate ALL old records first
        result = await db.execute(select(PortfolioData).where(PortfolioData.is_active == True))
        old_records = result.scalars().all()
        for record in old_records:
            record.is_active = False
        
        # Now create the new active record
        content_str = json.dumps(data, ensure_ascii=False)
        new_record = PortfolioData(content=content_str, is_active=True)
        db.add(new_record)
        await db.commit()
        await db.refresh(new_record)
        print(f"DEBUG: Portfolio saved successfully, ID: {new_record.id}")
        return True
    except Exception as e:
        await db.rollback()
        print(f"Error saving to DB: {e}")
        import traceback
        traceback.print_exc()
        return False

async def init_portfolio_data(db: AsyncSession):
    """
    Initializes DB with data from portfolio.json if DB is empty.
    This acts as a seamless migration.
    """
    existing = await get_portfolio_data(db)
    
    # Check if data is substantial (not just empty structure)
    # If existing is just {"es": {}, "en": {}}, it's length is small (~22 chars)
    # So we force re-seed if it's too small
    if existing and len(json.dumps(existing)) > 50:
        return
    
    # Load from file (legacy path)
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "data", "portfolio.json")
        
        print(f"DEBUG: Attempting to init portfolio from: {file_path}")
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                print(f"DEBUG: Loaded data from file. Keys: {list(data.keys())}")
                result = await save_portfolio_data(db, data)
                print(f"DEBUG: init_portfolio_data save result: {result}")
                print("Initialized PortfolioData in DB from file.")
        else:
            print(f"CRITICAL ERROR: Portfolio file NOT FOUND at {file_path}")
            # Try fallback to local dir if running differently
            fallback_path = "data/portfolio.json"
            if os.path.exists(fallback_path):
                print(f"DEBUG: Found fallback at {fallback_path}")
                with open(fallback_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    await save_portfolio_data(db, data)
    except Exception as e:
        print(f"Migration error: {e}")
        import traceback
        traceback.print_exc()
