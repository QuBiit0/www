from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from contextlib import asynccontextmanager
from database import init_db
from api_settings import router as settings_router
from database import get_db, AsyncSessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    await init_db()
    
    # Migration: Init Portfolio Data
    async with AsyncSessionLocal() as session:
        from portfolio_service import init_portfolio_data
        await init_portfolio_data(session)
        
    yield
    # Shutdown

app = FastAPI(title="Leandro Alvarez Portfolio API", version="2.0.0", lifespan=lifespan)

app.include_router(settings_router)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "backend-ai"}

from agent import process_message
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from chat_service import save_chat_message, get_chat_history, clear_chat_history
from langchain_core.messages import HumanMessage, AIMessage

# --- Portfolio Data Endpoints ---
from portfolio_service import get_portfolio_data, save_portfolio_data

@app.get("/api/portfolio")
async def get_portfolio(db: AsyncSession = Depends(get_db)):
    data = await get_portfolio_data(db)
    return data

@app.post("/api/portfolio")
async def update_portfolio(data: dict, db: AsyncSession = Depends(get_db)):
    success = await save_portfolio_data(db, data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save portfolio data")
    return {"status": "updated", "message": "Portfolio data saved to Database"}

from models import ChatMessage
from sqlalchemy import func, select

@app.get("/api/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    try:
        total_msgs = await db.scalar(select(func.count(ChatMessage.id)))
        unique_sessions = await db.scalar(select(func.count(func.distinct(ChatMessage.session_id))))
        
        # Check LLM connectivity (basic check)
        from settings import get_settings
        settings = get_settings()
        provider = settings.MODEL_PROVIDER
        
        return {
            "total_messages": total_msgs or 0,
            "active_sessions": unique_sessions or 0,
            "system_status": "Operational",
            "current_provider": provider
        }
    except Exception as e:
         return {
            "total_messages": 0,
            "active_sessions": 0,
            "system_status": "Error",
            "error": str(e)
        }


@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    session_id = request.session_id or "default-session"
    
    try:
        # 1. Save User Message
        await save_chat_message(db, session_id, "user", request.message)
        
        # 2. Get History (for context)
        history_msgs = await get_chat_history(db, session_id)
        
        # Convert to LangChain format
        lc_history = []
        for msg in history_msgs:
            if msg.role == "user":
                lc_history.append(HumanMessage(content=msg.content))
            else:
                lc_history.append(AIMessage(content=msg.content))
        
        # 3. Process with Agent
        response_text = await process_message(request.message, lc_history)
        
        # 4. Save AI Response
        await save_chat_message(db, session_id, "assistant", response_text)

        return {
            "reply": response_text,
            "agent": "LangChain Agent v1 (with Memory)"
        }
    except Exception as e:
        print(f"Error: {e}") # Simple logging
        return {
            "reply": "I'm having trouble connecting to my brain right now. Please try again.",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
