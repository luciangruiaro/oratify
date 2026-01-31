"""
Security utilities for authentication and authorization.

This module provides:
- Password hashing and verification using bcrypt
- JWT token generation and validation
- Token types: access (short-lived) and refresh (long-lived)

Usage:
    from app.core.security import hash_password, verify_password
    from app.core.security import create_access_token, create_refresh_token

    hashed = hash_password("mypassword")
    is_valid = verify_password("mypassword", hashed)

    access_token = create_access_token({"sub": str(user_id)})
    refresh_token = create_refresh_token({"sub": str(user_id)})
"""

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

settings = get_settings()


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.

    Automatically generates a salt and includes it in the hash.
    The same password hashed twice will produce different hashes.

    Args:
        password: Plain text password to hash

    Returns:
        str: Bcrypt hash of the password
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a bcrypt hash.

    Args:
        plain_password: Plain text password to verify
        hashed_password: Bcrypt hash to verify against

    Returns:
        bool: True if password matches, False otherwise
    """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT access token.

    Access tokens are short-lived (default 30 minutes) and used for API authentication.
    Include user ID in the "sub" (subject) claim.

    Args:
        data: Claims to include in the token (must include "sub" for user ID)
        expires_delta: Optional custom expiration time

    Returns:
        str: Encoded JWT token

    Example:
        token = create_access_token({"sub": str(user.id)})
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.jwt_access_token_expire_minutes
        )

    to_encode.update({
        "exp": expire,
        "type": "access",
        "iat": datetime.now(timezone.utc),
    })

    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT refresh token.

    Refresh tokens are long-lived (default 7 days) and used to obtain new access tokens.
    Should be stored securely and transmitted over HTTPS only.

    Args:
        data: Claims to include in the token (must include "sub" for user ID)
        expires_delta: Optional custom expiration time

    Returns:
        str: Encoded JWT refresh token

    Example:
        token = create_refresh_token({"sub": str(user.id)})
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.jwt_refresh_token_expire_days
        )

    to_encode.update({
        "exp": expire,
        "type": "refresh",
        "iat": datetime.now(timezone.utc),
    })

    return jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str) -> dict[str, Any] | None:
    """
    Decode and validate a JWT token.

    Verifies the token signature and expiration.

    Args:
        token: JWT token to decode

    Returns:
        dict: Token payload if valid, None if invalid or expired

    Example:
        payload = decode_token(token)
        if payload:
            user_id = payload.get("sub")
            token_type = payload.get("type")  # "access" or "refresh"
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError:
        return None


def verify_token_type(token: str, expected_type: str) -> dict[str, Any] | None:
    """
    Decode a token and verify it's the expected type.

    Args:
        token: JWT token to decode
        expected_type: Expected token type ("access" or "refresh")

    Returns:
        dict: Token payload if valid and correct type, None otherwise
    """
    payload = decode_token(token)
    if payload and payload.get("type") == expected_type:
        return payload
    return None
