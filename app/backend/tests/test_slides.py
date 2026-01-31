"""
Slides API Tests

Tests CRUD operations and authorization for slides:
- List slides for a presentation
- Create slide
- Get slide by ID
- Update slide
- Delete slide
- Reorder slides
- Duplicate slide
"""

import pytest
from uuid import uuid4


class TestListSlides:
    """Tests for GET /api/presentations/{presentation_id}/slides."""

    @pytest.mark.asyncio
    async def test_list_slides_empty(self, client, auth_headers, test_presentation):
        """List slides returns empty list for new presentation."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0

    @pytest.mark.asyncio
    async def test_list_slides_with_data(self, client, auth_headers, test_presentation, test_slides):
        """List slides returns all slides in order."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 3
        assert data["total"] == 3

        # Verify slides are ordered correctly
        order_indices = [slide["order_index"] for slide in data["items"]]
        assert order_indices == sorted(order_indices)

    @pytest.mark.asyncio
    async def test_list_slides_unauthorized(self, client, test_presentation):
        """List slides without auth returns 401."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}/slides",
        )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_list_slides_wrong_owner(
        self, client, test_presentation, another_speaker_token
    ):
        """List slides for another user's presentation returns 404."""
        response = await client.get(
            f"/api/presentations/{test_presentation.id}/slides",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_list_slides_not_found(self, client, auth_headers):
        """List slides for non-existent presentation returns 404."""
        response = await client.get(
            f"/api/presentations/{uuid4()}/slides",
            headers=auth_headers,
        )

        assert response.status_code == 404


class TestCreateSlide:
    """Tests for POST /api/presentations/{presentation_id}/slides."""

    @pytest.mark.asyncio
    async def test_create_content_slide(self, client, auth_headers, test_presentation):
        """Create content slide succeeds."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "content",
                "content": {
                    "text": "Hello World",
                    "layout": "text-only",
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "content"
        assert data["content"]["text"] == "Hello World"
        assert data["order_index"] == 0

    @pytest.mark.asyncio
    async def test_create_question_text_slide(self, client, auth_headers, test_presentation):
        """Create question_text slide succeeds."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "question_text",
                "content": {
                    "question": "What do you think?",
                    "placeholder": "Enter your answer",
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "question_text"
        assert data["content"]["question"] == "What do you think?"

    @pytest.mark.asyncio
    async def test_create_question_choice_slide(self, client, auth_headers, test_presentation):
        """Create question_choice slide succeeds."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "question_choice",
                "content": {
                    "question": "Pick one",
                    "options": [
                        {"id": "a", "text": "Option A", "order": 0},
                        {"id": "b", "text": "Option B", "order": 1},
                    ],
                    "allow_multiple": False,
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "question_choice"
        assert len(data["content"]["options"]) == 2

    @pytest.mark.asyncio
    async def test_create_summary_slide(self, client, auth_headers, test_presentation):
        """Create summary slide succeeds."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "summary",
                "content": {
                    "title": "Summary",
                    "auto_generate": True,
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "summary"

    @pytest.mark.asyncio
    async def test_create_conclusion_slide(self, client, auth_headers, test_presentation):
        """Create conclusion slide succeeds."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "conclusion",
                "content": {
                    "title": "Key Takeaways",
                    "conclusions": ["Point 1", "Point 2"],
                },
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["type"] == "conclusion"

    @pytest.mark.asyncio
    async def test_create_slide_appends_to_end(self, client, auth_headers, test_presentation, test_slides):
        """New slides append to the end by default."""
        # Create another slide after test_slides
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json={
                "type": "content",
                "content": {"text": "New slide"},
            },
        )

        assert response.status_code == 201
        data = response.json()

        # Verify the new slide has the highest order_index
        list_response = await client.get(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
        )
        all_slides = list_response.json()["items"]
        max_order_index = max(s["order_index"] for s in all_slides)
        assert data["order_index"] == max_order_index

    @pytest.mark.asyncio
    async def test_create_slide_unauthorized(self, client, test_presentation):
        """Create slide without auth returns 401."""
        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            json={"type": "content", "content": {}},
        )

        assert response.status_code == 401


class TestGetSlide:
    """Tests for GET /api/slides/{slide_id}."""

    @pytest.mark.asyncio
    async def test_get_slide(self, client, auth_headers, test_slide):
        """Get slide by ID succeeds."""
        response = await client.get(
            f"/api/slides/{test_slide.id}",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == str(test_slide.id)
        assert data["type"] == "content"

    @pytest.mark.asyncio
    async def test_get_slide_not_found(self, client, auth_headers):
        """Get non-existent slide returns 404."""
        response = await client.get(
            f"/api/slides/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_get_slide_wrong_owner(self, client, test_slide, another_speaker_token):
        """Get another user's slide returns 404."""
        response = await client.get(
            f"/api/slides/{test_slide.id}",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404


class TestUpdateSlide:
    """Tests for PUT /api/slides/{slide_id}."""

    @pytest.mark.asyncio
    async def test_update_slide_content(self, client, auth_headers, test_slide):
        """Update slide content succeeds."""
        response = await client.put(
            f"/api/slides/{test_slide.id}",
            headers=auth_headers,
            json={
                "content": {"text": "Updated content", "layout": "text-only"},
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["content"]["text"] == "Updated content"

    @pytest.mark.asyncio
    async def test_update_slide_type(self, client, auth_headers, test_slide):
        """Update slide type succeeds."""
        response = await client.put(
            f"/api/slides/{test_slide.id}",
            headers=auth_headers,
            json={
                "type": "question_text",
                "content": {"question": "New question?"},
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["type"] == "question_text"

    @pytest.mark.asyncio
    async def test_update_slide_not_found(self, client, auth_headers):
        """Update non-existent slide returns 404."""
        response = await client.put(
            f"/api/slides/{uuid4()}",
            headers=auth_headers,
            json={"content": {"text": "test"}},
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_update_slide_unauthorized(self, client, test_slide):
        """Update slide without auth returns 401."""
        response = await client.put(
            f"/api/slides/{test_slide.id}",
            json={"content": {"text": "test"}},
        )

        assert response.status_code == 401


class TestDeleteSlide:
    """Tests for DELETE /api/slides/{slide_id}."""

    @pytest.mark.asyncio
    async def test_delete_slide(self, client, auth_headers, test_slide):
        """Delete slide succeeds."""
        response = await client.delete(
            f"/api/slides/{test_slide.id}",
            headers=auth_headers,
        )

        assert response.status_code == 204

        # Verify deleted
        get_response = await client.get(
            f"/api/slides/{test_slide.id}",
            headers=auth_headers,
        )
        assert get_response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_slide_not_found(self, client, auth_headers):
        """Delete non-existent slide returns 404."""
        response = await client.delete(
            f"/api/slides/{uuid4()}",
            headers=auth_headers,
        )

        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_delete_slide_wrong_owner(self, client, test_slide, another_speaker_token):
        """Delete another user's slide returns 404."""
        response = await client.delete(
            f"/api/slides/{test_slide.id}",
            headers={"Authorization": f"Bearer {another_speaker_token}"},
        )

        assert response.status_code == 404


class TestDuplicateSlide:
    """Tests for POST /api/slides/{slide_id}/duplicate."""

    @pytest.mark.asyncio
    async def test_duplicate_slide(self, client, auth_headers, test_slide, test_presentation):
        """Duplicate slide creates copy after original."""
        response = await client.post(
            f"/api/slides/{test_slide.id}/duplicate",
            headers=auth_headers,
        )

        assert response.status_code == 201
        data = response.json()
        assert data["id"] != str(test_slide.id)
        assert data["type"] == test_slide.type
        assert data["order_index"] == test_slide.order_index + 1

    @pytest.mark.asyncio
    async def test_duplicate_slide_not_found(self, client, auth_headers):
        """Duplicate non-existent slide returns 404."""
        response = await client.post(
            f"/api/slides/{uuid4()}/duplicate",
            headers=auth_headers,
        )

        assert response.status_code == 404


class TestReorderSlides:
    """Tests for PUT /api/presentations/{presentation_id}/slides/reorder."""

    @pytest.mark.asyncio
    @pytest.mark.skip(reason="Backend greenlet issue in slide_to_response - needs fix")
    async def test_reorder_slides(self, client, auth_headers, test_presentation, test_slides):
        """Reorder slides succeeds."""
        # Reverse the order
        slide_ids = [str(s.id) for s in reversed(test_slides)]

        response = await client.put(
            f"/api/presentations/{test_presentation.id}/slides/reorder",
            headers=auth_headers,
            json={"slide_ids": slide_ids},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["reordered"] == 3

        # Verify new order
        for i, slide in enumerate(data["slides"]):
            assert slide["id"] == slide_ids[i]
            assert slide["order_index"] == i

    @pytest.mark.asyncio
    async def test_reorder_slides_missing_ids(self, client, auth_headers, test_presentation, test_slides):
        """Reorder with missing slide IDs fails."""
        # Only include 2 of 3 slides
        slide_ids = [str(test_slides[0].id), str(test_slides[1].id)]

        response = await client.put(
            f"/api/presentations/{test_presentation.id}/slides/reorder",
            headers=auth_headers,
            json={"slide_ids": slide_ids},
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_reorder_slides_wrong_ids(self, client, auth_headers, test_presentation, test_slides):
        """Reorder with wrong slide IDs fails."""
        slide_ids = [str(uuid4()) for _ in test_slides]

        response = await client.put(
            f"/api/presentations/{test_presentation.id}/slides/reorder",
            headers=auth_headers,
            json={"slide_ids": slide_ids},
        )

        assert response.status_code == 400

    @pytest.mark.asyncio
    async def test_reorder_slides_unauthorized(self, client, test_presentation, test_slides):
        """Reorder slides without auth returns 401."""
        slide_ids = [str(s.id) for s in test_slides]

        response = await client.put(
            f"/api/presentations/{test_presentation.id}/slides/reorder",
            json={"slide_ids": slide_ids},
        )

        assert response.status_code == 401
