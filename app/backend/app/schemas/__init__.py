"""
Pydantic schemas for API request/response validation.

Import all schemas for easy access:
    from app.schemas import SpeakerCreate, SpeakerResponse, LoginRequest
"""

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

__all__ = [
    "LoginRequest",
    "MessageResponse",
    "PasswordResetConfirm",
    "PasswordResetRequest",
    "RefreshTokenRequest",
    "SpeakerCreate",
    "SpeakerResponse",
    "SpeakerWithTokens",
    "TokenResponse",
]
