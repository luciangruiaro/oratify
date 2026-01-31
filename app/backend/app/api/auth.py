"""
Authentication API endpoints.

Endpoints:
- POST /register: Create new speaker account
- POST /login: Authenticate and get tokens
- POST /refresh: Get new access token using refresh token
- GET /me: Get current speaker profile
- POST /password-reset: Request password reset
- POST /password-reset/confirm: Complete password reset

All endpoints except register, login, and password-reset require authentication.
"""

import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import ActiveSpeaker, DbSession
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token_type,
)
from app.models import Speaker
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshTokenRequest,
    SpeakerCreate,
    SpeakerResponse,
    SpeakerWithTokens,
    TokenResponse,
)

router = APIRouter()

# In-memory password reset token storage (use Redis in production)
# Format: {token: {"speaker_id": uuid, "expires": datetime}}
_password_reset_tokens: dict[str, dict] = {}


@router.post(
    "/register",
    response_model=SpeakerWithTokens,
    status_code=status.HTTP_201_CREATED,
    summary="Register new speaker",
    description="Create a new speaker account and return authentication tokens.",
)
async def register(
    data: SpeakerCreate,
    db: DbSession,
) -> SpeakerWithTokens:
    """
    Register a new speaker account.

    - Validates email is not already registered
    - Hashes password securely
    - Creates speaker record
    - Returns speaker data with access and refresh tokens
    """
    # Check if email already exists
    result = await db.execute(
        select(Speaker).where(Speaker.email == data.email.lower())
    )
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new speaker
    speaker = Speaker(
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        name=data.name,
        plan_type="free",
        is_active=True,
    )

    db.add(speaker)
    await db.commit()
    await db.refresh(speaker)

    # Generate tokens
    access_token = create_access_token({"sub": str(speaker.id)})
    refresh_token = create_refresh_token({"sub": str(speaker.id)})

    return SpeakerWithTokens(
        speaker=SpeakerResponse.model_validate(speaker),
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login",
    description="Authenticate with email and password to get access tokens.",
)
async def login(
    data: LoginRequest,
    db: DbSession,
) -> TokenResponse:
    """
    Authenticate speaker and return tokens.

    - Validates email exists
    - Validates password matches
    - Validates account is active
    - Returns access and refresh tokens
    """
    # Find speaker by email
    result = await db.execute(
        select(Speaker).where(Speaker.email == data.email.lower())
    )
    speaker = result.scalar_one_or_none()

    # Use same error for invalid email or password (security)
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not speaker:
        raise invalid_credentials

    if not verify_password(data.password, speaker.password_hash):
        raise invalid_credentials

    if not speaker.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )

    # Generate tokens
    access_token = create_access_token({"sub": str(speaker.id)})
    refresh_token = create_refresh_token({"sub": str(speaker.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh token",
    description="Get new access token using a valid refresh token.",
)
async def refresh_token(
    data: RefreshTokenRequest,
    db: DbSession,
) -> TokenResponse:
    """
    Get new tokens using refresh token.

    - Validates refresh token
    - Validates speaker still exists and is active
    - Returns new access and refresh tokens
    """
    # Verify refresh token
    payload = verify_token_type(data.refresh_token, "refresh")

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    speaker_id_str = payload.get("sub")
    if not speaker_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    try:
        speaker_id = uuid.UUID(speaker_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Verify speaker exists and is active
    result = await db.execute(
        select(Speaker).where(Speaker.id == speaker_id)
    )
    speaker = result.scalar_one_or_none()

    if not speaker or not speaker.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    # Generate new tokens
    access_token = create_access_token({"sub": str(speaker.id)})
    new_refresh_token = create_refresh_token({"sub": str(speaker.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.get(
    "/me",
    response_model=SpeakerResponse,
    summary="Get current speaker",
    description="Get the currently authenticated speaker's profile.",
)
async def get_me(
    speaker: ActiveSpeaker,
) -> SpeakerResponse:
    """
    Get current speaker profile.

    Returns the authenticated speaker's data.
    Requires valid access token.
    """
    return SpeakerResponse.model_validate(speaker)


@router.post(
    "/password-reset",
    response_model=MessageResponse,
    summary="Request password reset",
    description="Request a password reset email. Always returns success for security.",
)
async def request_password_reset(
    data: PasswordResetRequest,
    db: DbSession,
) -> MessageResponse:
    """
    Request password reset.

    - Always returns success message (security: don't reveal if email exists)
    - If email exists, generates reset token (logged in dev, emailed in production)
    - Token expires after 1 hour
    """
    # Find speaker by email
    result = await db.execute(
        select(Speaker).where(Speaker.email == data.email.lower())
    )
    speaker = result.scalar_one_or_none()

    if speaker and speaker.is_active:
        # Generate reset token
        token = secrets.token_urlsafe(32)
        expires = datetime.now(timezone.utc) + timedelta(hours=1)

        # Store token (in production, use Redis or database)
        _password_reset_tokens[token] = {
            "speaker_id": speaker.id,
            "expires": expires,
        }

        # In development, log the reset link
        # In production, send email
        print(f"\n{'='*50}")
        print(f"Password reset requested for: {speaker.email}")
        print(f"Reset token: {token}")
        print(f"Reset link: http://localhost:3000/reset-password/confirm?token={token}")
        print(f"Expires: {expires.isoformat()}")
        print(f"{'='*50}\n")

    # Always return success for security
    return MessageResponse(
        message="If an account exists with this email, you will receive reset instructions."
    )


@router.post(
    "/password-reset/confirm",
    response_model=MessageResponse,
    summary="Confirm password reset",
    description="Complete password reset using the token from email.",
)
async def confirm_password_reset(
    data: PasswordResetConfirm,
    db: DbSession,
) -> MessageResponse:
    """
    Complete password reset.

    - Validates reset token
    - Updates password
    - Invalidates token
    """
    # Find token
    token_data = _password_reset_tokens.get(data.token)

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token",
        )

    # Check expiration
    if datetime.now(timezone.utc) > token_data["expires"]:
        del _password_reset_tokens[data.token]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired",
        )

    # Find speaker
    result = await db.execute(
        select(Speaker).where(Speaker.id == token_data["speaker_id"])
    )
    speaker = result.scalar_one_or_none()

    if not speaker:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token",
        )

    # Update password
    speaker.password_hash = hash_password(data.new_password)
    await db.commit()

    # Invalidate token
    del _password_reset_tokens[data.token]

    return MessageResponse(message="Password reset successful")
