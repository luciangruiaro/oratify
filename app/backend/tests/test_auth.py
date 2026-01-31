"""
Authentication API Tests

Tests for:
- User registration
- User login
- Token refresh
- Get current user
"""

import pytest
from uuid import uuid4


def get_unique_email(prefix: str = "test") -> str:
    """Generate a unique email for test isolation."""
    return f"{prefix}_{uuid4().hex[:8]}@example.com"


class TestRegister:
    """Tests for POST /api/auth/register."""

    @pytest.mark.asyncio
    async def test_register_success(self, client):
        """Register new user succeeds."""
        email = get_unique_email("newuser")
        response = await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "securepassword123",
                "name": "New User",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert "speaker" in data
        assert data["speaker"]["email"] == email.lower()
        assert data["speaker"]["name"] == "New User"
        assert "password" not in data["speaker"]
        assert "access_token" in data
        assert "refresh_token" in data

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, client):
        """Register with existing email fails."""
        email = get_unique_email("duplicate")

        # First registration
        response1 = await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "password123456",
                "name": "First User",
            },
        )
        assert response1.status_code == 201

        # Duplicate registration
        response2 = await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "anotherpassword",
                "name": "Duplicate User",
            },
        )

        assert response2.status_code == 400

    @pytest.mark.asyncio
    async def test_register_invalid_email(self, client):
        """Register with invalid email fails."""
        response = await client.post(
            "/api/auth/register",
            json={
                "email": "not-an-email",
                "password": "securepassword123",
                "name": "Test User",
            },
        )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_register_short_password(self, client):
        """Register with short password fails."""
        response = await client.post(
            "/api/auth/register",
            json={
                "email": get_unique_email("shortpwd"),
                "password": "123",
                "name": "Test User",
            },
        )

        assert response.status_code == 422


class TestLogin:
    """Tests for POST /api/auth/login."""

    @pytest.mark.asyncio
    async def test_login_success(self, client):
        """Login with correct credentials succeeds."""
        email = get_unique_email("logintest")

        # First register
        await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "testpassword123",
                "name": "Login Test",
            },
        )

        # Then login
        response = await client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "testpassword123",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    @pytest.mark.asyncio
    async def test_login_wrong_password(self, client):
        """Login with wrong password fails."""
        email = get_unique_email("wrongpwd")

        # First register
        await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "correctpassword",
                "name": "Wrong Pwd Test",
            },
        )

        # Try login with wrong password
        response = await client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "wrongpassword",
            },
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_nonexistent_user(self, client):
        """Login with non-existent user fails."""
        response = await client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "anypassword",
            },
        )

        assert response.status_code == 401


class TestGetMe:
    """Tests for GET /api/auth/me."""

    @pytest.mark.asyncio
    async def test_get_me_authenticated(self, client):
        """Get current user with valid token succeeds."""
        email = get_unique_email("getme")

        # Register and login
        await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "testpassword123",
                "name": "Get Me Test",
            },
        )

        login_response = await client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "testpassword123",
            },
        )
        token = login_response.json()["access_token"]

        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == email.lower()
        assert data["name"] == "Get Me Test"

    @pytest.mark.asyncio
    async def test_get_me_unauthenticated(self, client):
        """Get current user without token fails."""
        response = await client.get("/api/auth/me")

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_get_me_invalid_token(self, client):
        """Get current user with invalid token fails."""
        response = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid-token"},
        )

        assert response.status_code == 401


class TestTokenRefresh:
    """Tests for POST /api/auth/refresh."""

    @pytest.mark.asyncio
    async def test_refresh_token(self, client):
        """Refresh token returns new access token."""
        email = get_unique_email("refresh")

        # Register and login
        await client.post(
            "/api/auth/register",
            json={
                "email": email,
                "password": "testpassword123",
                "name": "Refresh Test",
            },
        )

        login_response = await client.post(
            "/api/auth/login",
            json={
                "email": email,
                "password": "testpassword123",
            },
        )
        refresh_token = login_response.json()["refresh_token"]

        # Use refresh token
        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": refresh_token},
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data

    @pytest.mark.asyncio
    async def test_refresh_invalid_token(self, client):
        """Refresh with invalid token fails."""
        response = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": "invalid-refresh-token"},
        )

        assert response.status_code == 401
