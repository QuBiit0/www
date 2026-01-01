from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from settings import get_settings

settings = get_settings()

# Create async engine
engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """Initialize database tables and create default admin user"""
    from models import Base, AdminUser, SystemSettings
    from auth_service import get_password_hash
    from sqlalchemy import select
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create default admin user if not exists
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(AdminUser))
        existing_admin = result.scalars().first()
        
        if not existing_admin:
            default_admin = AdminUser(
                username="admin",
                password_hash=get_password_hash("admin123")
            )
            session.add(default_admin)
            await session.commit()
            print("✅ Default admin user created: admin / admin123")
