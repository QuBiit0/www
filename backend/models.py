from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float
from sqlalchemy.sql import func
from database import Base
from datetime import datetime, timezone, timedelta

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    # LLM Configuration
    provider = Column(String, default="gemini") # "gemini" or "openai"
    model_name = Column(String, default="gemini-2.5-flash-lite")
    api_key = Column(String, nullable=True) # Encrypted ideally, plain for MVP
    base_url = Column(String, nullable=True)
    temperature = Column(String, default="0.7")
    
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String) # "user" or "assistant"
    content = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PortfolioData(Base):
    __tablename__ = "portfolio_data"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text) # Stores JSON string of the portfolio data
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    contact_info = Column(String) # Email or Phone
    interest = Column(String, nullable=True) # Context of what they liked
    status = Column(String, default="new") # new, contacted, closed
    created_at = Column(DateTime, default=datetime.utcnow)
