"""
Pydantic schemas for authentication endpoints.

These schemas define the request/response format for:
- Registration
- Login
- Token refresh
- Password reset

All schemas include validation rules for fields like email format,
password minimum length, etc.
"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class SpeakerCreate(BaseModel):
    """Schema for speaker registration request."""

    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")
    name: str = Field(..., min_length=1, max_length=255, description="Display name")

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Validate password has minimum strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class SpeakerResponse(BaseModel):
    """Schema for speaker data in responses."""

    id: uuid.UUID
    email: str
    name: str
    plan_type: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class SpeakerWithTokens(BaseModel):
    """Schema for registration/login response with tokens."""

    speaker: SpeakerResponse
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    """Schema for login request."""

    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="Password")


class TokenResponse(BaseModel):
    """Schema for token-only responses (login, refresh)."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Schema for token refresh request."""

    refresh_token: str = Field(..., description="Valid refresh token")


class PasswordResetRequest(BaseModel):
    """Schema for password reset request."""

    email: EmailStr = Field(..., description="Email address")


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""

    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password (min 8 characters)")

    @field_validator("new_password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Validate password has minimum strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class MessageResponse(BaseModel):
    """Schema for simple message responses."""

    message: str
