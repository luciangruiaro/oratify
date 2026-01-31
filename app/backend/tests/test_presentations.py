"""
Presentations API Tests

Tests CRUD operations for presentations:
- List presentations
- Create presentation
- Get presentation by ID
- Update presentation
- Delete presentation
"""

import pytest
from uuid import uuid4


class TestListPresentations:
    """Tests for GET /api/presentations."""

    @pytest.mark.asyncio
    async def test_list_presentations_empty(self, client, auth_headers):
        """List presentations returns empty list for new user."""
        response = await client.get("/api/presentations", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    @pytest.mark.asyncio
    async def test_list_presentations_with_data(
        self, client, auth_headers, test_presentation
    ):
        """List presentations returns user's presentations."""
        response = await client.get("/api/presentations", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1
        assert test_presentation.title in data["items"][0]["title"]

    @pytest.mark.asyncio
    async def test_list_presentations_unauthorized(self, client):
        """List presentations without auth returns 401."""
        response = await client.get("/api/presentations")

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_list_presentations_isolation(
        self, client, test_presentation, another_speaker_token
    ):
        """Users only see their own presentations."""
        response = await client.get(
            "/api/presentations",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []


class TestCreatePresentation:
    """Tests for POST /api/presentations."""

    @pytest.mark.asyncio
    async def test_create_presentation(self, client, auth_headers):
        """Create presentation succeeds."""
        response = await client.post(
            "/api/presentations",
            headers=auth_headers,
            json={
                "title": "New Presentation",
                "description": "A new presentation",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "New Presentation"
        assert data["description"] == "A new presentation"
        assert data["status"] == "draft"

    @pytest.mark.asyncio
    async def test_create_presentation_minimal(self, client, auth_headers):
        """Create presentation with only title succeeds."""
        response = await client.post(
            "/api/presentations",
            headers=auth_headers,
            json={"title": "Minimal Presentation"},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Minimal Presentation"

    @pytest.mark.asyncio
    async def test_create_presentation_unauthorized(self, client):
        """Create presentation without auth returns 401."""
        response = await client.post(
            "/api/presentations",
            json={"title": "Unauthorized"},
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_create_presentation_empty_title(self, client, auth_headers):
        """Create presentation with empty title fails."""
        response = await client.post(
            "/api/presentations",
            headers=auth_headers,
            json={"title": ""},
        )

        assert response.status_code == 422


class TestGetPresentation:
    """Tests for GET /api/presentations/{presentation_id}."""

    @pytest.mark.asyncio
    async def test_get_presentation(self, client, auth_headers, test_presentation):
        """Get presentation by ID succeeds."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_presentation.id)
        assert "Test Presentation" in data["title"]

    @pytest.mark.asyncio
    async def test_get_presentation_not_found(self, client, auth_headers):
        """Get non-existent presentation returns 404."""
        response = await client.get(
            f"/api/presentations/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_get_presentation_wrong_owner(
        self, client, test_presentation, another_speaker_token
    ):
        """Get another user's presentation returns 404."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404


class TestUpdatePresentation:
    """Tests for PUT /api/presentations/{presentation_id}."""

    @pytest.mark.asyncio
    async def test_update_presentation(self, client, auth_headers, test_presentation):
        """Update presentation succeeds."""
        response = await client.put(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
            json={
                "title": "Updated Title",
                "description": "Updated description",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["description"] == "Updated description"

    @pytest.mark.asyncio
    async def test_update_presentation_partial(
        self, client, auth_headers, test_presentation
    ):
        """Partial update only changes specified fields."""
        response = await client.put(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
            json={"title": "Only Title Updated"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Only Title Updated"
        assert data["description"] == test_presentation.description

    @pytest.mark.asyncio
    async def test_update_presentation_status(
        self, client, auth_headers, test_presentation
    ):
        """Update presentation status succeeds."""
        response = await client.put(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
            json={"status": "active"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"

    @pytest.mark.asyncio
    async def test_update_presentation_not_found(self, client, auth_headers):
        """Update non-existent presentation returns 404."""
        response = await client.put(
            f"/api/presentations/{uuid4()}",
            headers=auth_headers,
            json={"title": "Not Found"},
        )

        assert response.status_code == 404


class TestDeletePresentation:
    """Tests for DELETE /api/presentations/{presentation_id}."""

    @pytest.mark.asyncio
    async def test_delete_presentation(self, client, auth_headers, test_presentation):
        """Delete presentation succeeds."""
        response = await client.delete(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
        )

        assert response.status_code == 204

        # Verify deleted
        get_response = await client.get(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
        )
        assert get_response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_presentation_not_found(self, client, auth_headers):
        """Delete non-existent presentation returns 404."""
        response = await client.delete(
            f"/api/presentations/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_presentation_wrong_owner(
        self, client, test_presentation, another_speaker_token
    ):
        """Delete another user's presentation returns 404."""
        response = await client.delete(
            f"/api/presentations/{test_presentation.id}",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404
