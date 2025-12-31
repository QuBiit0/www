from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import ChatMessage

async def save_chat_message(db: AsyncSession, session_id: str, role: str, content: str):
    msg = ChatMessage(session_id=session_id, role=role, content=content)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

async def get_chat_history(db: AsyncSession, session_id: str, limit: int = 20):
    """
    Retrieves the last `limit` messages for a session.
    Orders by creation time DESC to get the latest, then reverses for chronological context.
    """
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc()) # Newest first
        .limit(limit)
    )
    messages = result.scalars().all()
    return list(reversed(messages)) # Return oldest -> newest

async def clear_chat_history(db: AsyncSession, session_id: str):
    """
    Clears all messages for a specific session.
    """
    from sqlalchemy import delete
    await db.execute(
        delete(ChatMessage).where(ChatMessage.session_id == session_id)
    )
    await db.commit()

