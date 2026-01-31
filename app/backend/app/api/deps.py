"""
FastAPI dependencies for API endpoints.

This module provides reusable dependencies for:
- Authentication: get_current_speaker, get_current_active_speaker
- Database: db session (from core.database)
- Authorization: admin checks

Usage in endpoints:
    from app.api.deps import get_current_speaker, DbSession

    @router.get("/me")
    async def get_me(
        speaker: Speaker = Depends(get_current_speaker),
        db: DbSession = Depends(),
    ):
        return speaker
"""

import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_token_type
from app.models import Speaker

# HTTP Bearer token scheme for Swagger UI integration
security = HTTPBearer(auto_error=False)

# Type alias for database session dependency
DbSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_speaker(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
    db: DbSession,
) -> Speaker:
    """
    Dependency that extracts and validates the current speaker from JWT token.

    Extracts the Bearer token from Authorization header, validates it,
    and returns the corresponding Speaker object.

    Args:
        credentials: Bearer token from Authorization header
        db: Database session

    Returns:
        Speaker: The authenticated speaker

    Raises:
        HTTPException 401: If token is missing, invalid, or speaker not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Verify token and extract payload
    payload = verify_token_type(token, "access")
    if not payload:
        raise credentials_exception

    # Extract user ID from token
    speaker_id_str = payload.get("sub")
    if not speaker_id_str:
        raise credentials_exception

    try:
        speaker_id = uuid.UUID(speaker_id_str)
    except ValueError:
        raise credentials_exception

    # Fetch speaker from database
    result = await db.execute(
        select(Speaker).where(Speaker.id == speaker_id)
    )
    speaker = result.scalar_one_or_none()

    if not speaker:
        raise credentials_exception

    return speaker


async def get_current_active_speaker(
    current_speaker: Annotated[Speaker, Depends(get_current_speaker)],
) -> Speaker:
    """
    Dependency that ensures the current speaker is active.

    Use this instead of get_current_speaker when you need to ensure
    the speaker account is not deactivated.

    Args:
        current_speaker: Speaker from get_current_speaker

    Returns:
        Speaker: The authenticated and active speaker

    Raises:
        HTTPException 401: If speaker account is deactivated
    """
    if not current_speaker.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )
    return current_speaker


# Type aliases for cleaner endpoint signatures
CurrentSpeaker = Annotated[Speaker, Depends(get_current_speaker)]
ActiveSpeaker = Annotated[Speaker, Depends(get_current_active_speaker)]
