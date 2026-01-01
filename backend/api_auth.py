from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import timedelta

from database import get_db
from models import AdminUser
from auth_service import verify_password, get_password_hash, create_access_token, get_current_admin
from settings import get_settings

settings = get_settings()

router = APIRouter(prefix="/api/auth", tags=["auth"])
# settings = get_settings()  <-- Remove duplicate

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/login", response_model=Token)
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Find user
    result = await db.execute(select(AdminUser).where(AdminUser.username == form_data.username))
    user = result.scalars().first()
    
    # Verify
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create Token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/setup-admin")
async def setup_initial_admin(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Open endpoint to create the FIRST admin if none exists."""
    result = await db.execute(select(AdminUser))
    existing = result.scalars().first()
    
    if existing:
         raise HTTPException(status_code=400, detail="Admin already exists.")
         
    hashed_password = get_password_hash(request.password)
    new_admin = AdminUser(username=request.username, password_hash=hashed_password)
    db.add(new_admin)
    await db.commit()
    return {"message": "Admin created successfully"}

@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_username: str = Depends(get_current_admin)
):
    """Change admin password (requires current password verification)"""
    
    result = await db.execute(select(AdminUser).where(AdminUser.username == current_username))
    admin = result.scalars().first()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")
    
    # Verify current password
    if not verify_password(request.current_password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )
    
    # Update password
    admin.password_hash = get_password_hash(request.new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"}
