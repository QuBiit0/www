from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

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
    content = Column(String) # Storing JSON as string for max compatibility
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now())
