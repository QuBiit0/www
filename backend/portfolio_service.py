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
        return json.loads(record.content)
    return {}

async def save_portfolio_data(db: AsyncSession, data: dict) -> bool:
    """Saves new portfolio data version to DB."""
    try:
        content_str = json.dumps(data, ensure_ascii=False)
        new_record = PortfolioData(content=content_str, is_active=True)
        db.add(new_record)
        await db.commit()
        await db.refresh(new_record)
        return True
    except Exception as e:
        print(f"Error saving to DB: {e}")
        return False

async def init_portfolio_data(db: AsyncSession):
    """
    Initializes DB with data from portfolio.json if DB is empty.
    This acts as a seamless migration.
    """
    existing = await get_portfolio_data(db)
    if existing:
        return
    
    # Load from file (legacy path)
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, "data", "portfolio.json")
        
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                await save_portfolio_data(db, data)
                print("Initialized PortfolioData in DB from file.")
    except Exception as e:
        print(f"Migration error: {e}")
