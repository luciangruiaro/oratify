"""
Database configuration with async SQLAlchemy support.

This module provides:
- Async database engine with connection pooling
- Async session factory for dependency injection
- get_db dependency for FastAPI endpoints

Usage in endpoints:
    from app.core.database import get_db

    @router.get("/items")
    async def get_items(db: AsyncSession = Depends(get_db)):
        result = await db.execute(select(Item))
        return result.scalars().all()
"""

from collections.abc import AsyncGenerator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool

from app.core.config import get_settings

settings = get_settings()

# Create async engine
# - pool_pre_ping: Verify connections before use
# - echo: Log SQL statements in debug mode
# - NullPool for testing (optional, can use default pool)
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

# Create async session factory
# - expire_on_commit=False: Objects remain accessible after commit
# - autoflush=False: Manual control over when to flush
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an async database session.

    Yields a session and ensures cleanup after request completion.
    Use with FastAPI's Depends():

        async def endpoint(db: AsyncSession = Depends(get_db)):
            ...

    Yields:
        AsyncSession: Database session for the request
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Type alias for dependency injection
DbSession = Annotated[AsyncSession, Depends(get_db)]


async def init_db() -> None:
    """
    Initialize database tables.

    Called on application startup to ensure all tables exist.
    In production, use Alembic migrations instead.
    """
    from app.models.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db() -> None:
    """
    Close database connections.

    Called on application shutdown to cleanup resources.
    """
    await engine.dispose()
