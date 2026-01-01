from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from models import Lead
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/leads", tags=["leads"])

class LeadSchema(BaseModel):
    id: int
    name: str | None
    contact_info: str
    interest: str | None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/", response_model=list[LeadSchema])
async def get_leads(db: AsyncSession = Depends(get_db)):
    # In production, this should depend on get_current_admin
    result = await db.execute(select(Lead).order_by(desc(Lead.created_at)))
    leads = result.scalars().all()
    return leads

# Optional POST endpoint if we wanted to add leads manually via UI
@router.post("/", response_model=LeadSchema)
async def create_lead(lead: LeadSchema, db: AsyncSession = Depends(get_db)):
    new_lead = Lead(
        name=lead.name,
        contact_info=lead.contact_info,
        interest=lead.interest,
        status="new"
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)
    return new_lead
