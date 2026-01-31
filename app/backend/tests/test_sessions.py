"""
Sessions API Tests

Tests session management endpoints:
- Create session
- Get session by ID, join code, and slug
- Start/end/pause/resume session
- Change current slide
- Get session statistics
"""

import pytest
from uuid import uuid4


class TestCreateSession:
    """Tests for POST /api/sessions."""

    @pytest.mark.asyncio
    async def test_create_session(self, client, auth_headers, test_presentation):
        """Create session succeeds."""
        response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )

        assert response.status_code == 201
        data = response.json()
        assert data["presentation_id"] == str(test_presentation.id)
        assert len(data["join_code"]) == 6
        assert data["status"] == "pending"
        assert data["started_at"] is None
        assert data["ended_at"] is None

    @pytest.mark.asyncio
    async def test_create_session_with_slides(
        self, client, auth_headers, test_presentation, test_slides
    ):
        """Create session sets first slide as current."""
        response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )

        assert response.status_code == 201
        data = response.json()
        # First slide should be set as current
        assert data["current_slide_id"] == str(test_slides[0].id)

    @pytest.mark.asyncio
    async def test_create_session_unauthorized(self, client, test_presentation):
        """Create session without auth returns 401."""
        response = await client.post(
            "/api/sessions",
            json={"presentation_id": str(test_presentation.id)},
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_create_session_not_owner(
        self, client, test_presentation, another_speaker_token
    ):
        """Create session for another user's presentation returns 404."""
        response = await client.post(
            "/api/sessions",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
            json={"presentation_id": str(test_presentation.id)},
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_create_session_invalid_presentation(self, client, auth_headers):
        """Create session for non-existent presentation returns 404."""
        response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(uuid4())},
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_join_code_uniqueness(
        self, client, auth_headers, test_presentation
    ):
        """Multiple sessions have unique join codes."""
        codes = set()

        for _ in range(5):
            response = await client.post(
                "/api/sessions",
                headers=auth_headers,
                json={"presentation_id": str(test_presentation.id)},
            )
            assert response.status_code == 201
            data = response.json()
            codes.add(data["join_code"])

        # All codes should be unique
        assert len(codes) == 5


class TestListSessions:
    """Tests for GET /api/sessions."""

    @pytest.mark.asyncio
    async def test_list_sessions_empty(self, client, auth_headers):
        """List sessions returns empty list for new user."""
        response = await client.get("/api/sessions", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    @pytest.mark.asyncio
    async def test_list_sessions_with_data(
        self, client, auth_headers, test_presentation
    ):
        """List sessions returns user's sessions."""
        # Create a session first
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        assert create_response.status_code == 201

        response = await client.get("/api/sessions", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1

    @pytest.mark.asyncio
    async def test_list_sessions_filter_by_presentation(
        self, client, auth_headers, test_presentation
    ):
        """List sessions can filter by presentation ID."""
        # Create session for the presentation
        await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )

        response = await client.get(
            f"/api/sessions?presentation_id={test_presentation.id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1

    @pytest.mark.asyncio
    async def test_list_sessions_unauthorized(self, client):
        """List sessions without auth returns 401."""
        response = await client.get("/api/sessions")

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_list_sessions_isolation(
        self, client, auth_headers, test_presentation, another_speaker_token
    ):
        """Users only see their own sessions."""
        # Create session as first user
        await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )

        # List as second user
        response = await client.get(
            "/api/sessions",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []


class TestGetSession:
    """Tests for GET /api/sessions/{session_id}."""

    @pytest.mark.asyncio
    async def test_get_session(self, client, auth_headers, test_presentation):
        """Get session by ID succeeds."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.get(
            f"/api/sessions/{session_id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == session_id
        assert data["presentation_title"] == test_presentation.title

    @pytest.mark.asyncio
    async def test_get_session_not_found(self, client, auth_headers):
        """Get non-existent session returns 404."""
        response = await client.get(
            f"/api/sessions/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_get_session_wrong_owner(
        self, client, auth_headers, test_presentation, another_speaker_token
    ):
        """Get another user's session returns 404."""
        # Create session as first user
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        # Get as second user
        response = await client.get(
            f"/api/sessions/{session_id}",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404


class TestGetSessionByCode:
    """Tests for GET /api/sessions/code/{join_code}."""

    @pytest.mark.asyncio
    async def test_get_session_by_code(self, client, auth_headers, test_presentation):
        """Get session by join code succeeds (public endpoint)."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        join_code = create_response.json()["join_code"]

        # Get without auth (public endpoint)
        response = await client.get(f"/api/sessions/code/{join_code}")

        assert response.status_code == 200
        data = response.json()
        assert data["join_code"] == join_code
        assert data["presentation_title"] == test_presentation.title

    @pytest.mark.asyncio
    async def test_get_session_by_code_case_insensitive(
        self, client, auth_headers, test_presentation
    ):
        """Get session by join code is case insensitive."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        join_code = create_response.json()["join_code"]

        # Get with lowercase
        response = await client.get(f"/api/sessions/code/{join_code.lower()}")

        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_session_by_code_not_found(self, client):
        """Get session by invalid join code returns 404."""
        response = await client.get("/api/sessions/code/XXXXXX")

        assert response.status_code == 404


class TestGetSessionBySlug:
    """Tests for GET /api/sessions/slug/{slug}."""

    @pytest.mark.asyncio
    async def test_get_session_by_slug(self, client, auth_headers, test_presentation):
        """Get session by presentation slug succeeds."""
        # Create session
        await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )

        # Get presentation to know the slug
        pres_response = await client.get(
            f"/api/presentations/{test_presentation.id}",
            headers=auth_headers,
        )
        slug = pres_response.json()["slug"]

        # Get session by slug (public endpoint)
        response = await client.get(f"/api/sessions/slug/{slug}")

        assert response.status_code == 200
        data = response.json()
        assert data["presentation_title"] == test_presentation.title

    @pytest.mark.asyncio
    async def test_get_session_by_slug_not_found(self, client):
        """Get session by invalid slug returns 404."""
        response = await client.get("/api/sessions/slug/nonexistent-slug")

        assert response.status_code == 404


class TestStartSession:
    """Tests for POST /api/sessions/{session_id}/start."""

    @pytest.mark.asyncio
    async def test_start_session(self, client, auth_headers, test_presentation):
        """Start pending session succeeds."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert data["started_at"] is not None

    @pytest.mark.asyncio
    async def test_start_session_already_active(
        self, client, auth_headers, test_presentation
    ):
        """Start already active session fails."""
        # Create and start session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        # Try to start again
        response = await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_start_session_not_found(self, client, auth_headers):
        """Start non-existent session returns 404."""
        response = await client.post(
            f"/api/sessions/{uuid4()}/start",
            headers=auth_headers,
        )

        assert response.status_code == 404


class TestEndSession:
    """Tests for POST /api/sessions/{session_id}/end."""

    @pytest.mark.asyncio
    async def test_end_session(self, client, auth_headers, test_presentation):
        """End active session succeeds."""
        # Create and start session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        response = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ended"
        assert data["ended_at"] is not None

    @pytest.mark.asyncio
    async def test_end_session_from_paused(
        self, client, auth_headers, test_presentation
    ):
        """End paused session succeeds."""
        # Create, start, and pause session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )
        await client.post(
            f"/api/sessions/{session_id}/pause",
            headers=auth_headers,
        )

        response = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ended"

    @pytest.mark.asyncio
    async def test_end_pending_session_fails(
        self, client, auth_headers, test_presentation
    ):
        """End pending session fails."""
        # Create session (pending)
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.post(
            f"/api/sessions/{session_id}/end",
            headers=auth_headers,
        )

        assert response.status_code == 400


class TestPauseResumeSession:
    """Tests for POST /api/sessions/{session_id}/pause and resume."""

    @pytest.mark.asyncio
    async def test_pause_session(self, client, auth_headers, test_presentation):
        """Pause active session succeeds."""
        # Create and start session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        response = await client.post(
            f"/api/sessions/{session_id}/pause",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "paused"

    @pytest.mark.asyncio
    async def test_resume_session(self, client, auth_headers, test_presentation):
        """Resume paused session succeeds."""
        # Create, start, and pause session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )
        await client.post(
            f"/api/sessions/{session_id}/pause",
            headers=auth_headers,
        )

        response = await client.post(
            f"/api/sessions/{session_id}/resume",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"

    @pytest.mark.asyncio
    async def test_pause_pending_session_fails(
        self, client, auth_headers, test_presentation
    ):
        """Pause pending session fails."""
        # Create session (pending)
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.post(
            f"/api/sessions/{session_id}/pause",
            headers=auth_headers,
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_resume_pending_session_fails(
        self, client, auth_headers, test_presentation
    ):
        """Resume pending session fails (can only resume from paused)."""
        # Create session (pending)
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.post(
            f"/api/sessions/{session_id}/resume",
            headers=auth_headers,
        )

        assert response.status_code == 400


class TestChangeCurrentSlide:
    """Tests for PUT /api/sessions/{session_id}/current-slide."""

    @pytest.mark.asyncio
    async def test_change_current_slide(
        self, client, auth_headers, test_presentation, test_slides
    ):
        """Change current slide succeeds."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        # Change to second slide
        response = await client.put(
            f"/api/sessions/{session_id}/current-slide",
            headers=auth_headers,
            json={"slide_id": str(test_slides[1].id)},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["current_slide_id"] == str(test_slides[1].id)

    @pytest.mark.asyncio
    async def test_change_current_slide_invalid_slide(
        self, client, auth_headers, test_presentation
    ):
        """Change to slide from different presentation fails."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        # Try to change to random slide ID
        response = await client.put(
            f"/api/sessions/{session_id}/current-slide",
            headers=auth_headers,
            json={"slide_id": str(uuid4())},
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_change_current_slide_not_found(self, client, auth_headers):
        """Change current slide for non-existent session returns 404."""
        response = await client.put(
            f"/api/sessions/{uuid4()}/current-slide",
            headers=auth_headers,
            json={"slide_id": str(uuid4())},
        )

        assert response.status_code == 404


class TestGetSessionStatistics:
    """Tests for GET /api/sessions/{session_id}/statistics."""

    @pytest.mark.asyncio
    async def test_get_session_statistics(
        self, client, auth_headers, test_presentation
    ):
        """Get session statistics succeeds."""
        # Create session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        response = await client.get(
            f"/api/sessions/{session_id}/statistics",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["session_id"] == session_id
        assert data["participant_count"] == 0
        assert data["total_responses"] == 0
        assert data["responses_per_slide"] == {}
        assert data["status"] == "pending"

    @pytest.mark.asyncio
    async def test_get_session_statistics_with_duration(
        self, client, auth_headers, test_presentation
    ):
        """Get session statistics includes duration after start."""
        # Create and start session
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        await client.post(
            f"/api/sessions/{session_id}/start",
            headers=auth_headers,
        )

        response = await client.get(
            f"/api/sessions/{session_id}/statistics",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["duration_seconds"] is not None
        assert data["duration_seconds"] >= 0

    @pytest.mark.asyncio
    async def test_get_session_statistics_not_found(self, client, auth_headers):
        """Get statistics for non-existent session returns 404."""
        response = await client.get(
            f"/api/sessions/{uuid4()}/statistics",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_get_session_statistics_wrong_owner(
        self, client, auth_headers, test_presentation, another_speaker_token
    ):
        """Get statistics for another user's session returns 404."""
        # Create session as first user
        create_response = await client.post(
            "/api/sessions",
            headers=auth_headers,
            json={"presentation_id": str(test_presentation.id)},
        )
        session_id = create_response.json()["id"]

        # Get statistics as second user
        response = await client.get(
            f"/api/sessions/{session_id}/statistics",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404
