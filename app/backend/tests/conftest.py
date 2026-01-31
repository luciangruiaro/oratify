"""
Test Configuration and Fixtures

Provides:
- Test database setup with PostgreSQL (uses container DB)
- Test client with async support
- Authentication fixtures
- Sample data fixtures

Each test gets a fresh database connection to avoid concurrency issues.
"""

import os
from typing import AsyncGenerator
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.main import app
from app.models.base import Base
from app.core.database import get_db


# Use the same PostgreSQL database
TEST_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://oratify:oratify@db:5432/oratify"
)


def get_unique_email(prefix: str = "test") -> str:
    """Generate a unique email for test isolation."""
    return f"{prefix}_{uuid4().hex[:8]}@example.com"


@pytest_asyncio.fixture(scope="function")
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Create test HTTP client with overridden database dependency."""
    # Create a fresh engine for each test
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)

    # Ensure tables exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )

    async def override_get_db():
        async with async_session() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    await engine.dispose()


@pytest_asyncio.fixture
async def test_speaker(client: AsyncClient):
    """Create a test speaker via API and return speaker data with token."""
    email = get_unique_email("testspeaker")

    # Register
    response = await client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "testpassword123",
            "name": "Test Speaker",
        },
    )
    assert response.status_code == 201
    data = response.json()

    from uuid import UUID
    return type('Speaker', (), {
        'id': UUID(data["speaker"]["id"]),
        'email': email,
        'name': "Test Speaker",
        '_token': data["access_token"],
    })()


@pytest_asyncio.fixture
async def test_speaker_token(test_speaker) -> str:
    """Get access token for test speaker."""
    return test_speaker._token


@pytest_asyncio.fixture
async def auth_headers(test_speaker_token: str) -> dict:
    """Get authorization headers for test speaker."""
    return {"Authorization": f"Bearer {test_speaker_token}"}


@pytest_asyncio.fixture
async def another_speaker(client: AsyncClient):
    """Create another test speaker for isolation tests."""
    email = get_unique_email("another")

    response = await client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": "anotherpassword123",
            "name": "Another Speaker",
        },
    )
    assert response.status_code == 201
    data = response.json()

    return type('Speaker', (), {
        'email': email,
        '_token': data["access_token"],
    })()


@pytest_asyncio.fixture
async def another_speaker_token(another_speaker) -> str:
    """Get access token for another speaker."""
    return another_speaker._token


@pytest_asyncio.fixture
async def test_presentation(client: AsyncClient, auth_headers: dict):
    """Create a test presentation via API."""
    response = await client.post(
        "/api/presentations",
        headers=auth_headers,
        json={
            "title": f"Test Presentation {uuid4().hex[:8]}",
            "description": "A test presentation",
        },
    )
    assert response.status_code == 201
    data = response.json()

    from uuid import UUID
    return type('Presentation', (), {
        'id': UUID(data["id"]),
        'title': data["title"],
        'description': data["description"],
        'status': data["status"],
    })()


@pytest_asyncio.fixture
async def test_slide(client: AsyncClient, auth_headers: dict, test_presentation):
    """Create a test slide via API."""
    response = await client.post(
        f"/api/presentations/{test_presentation.id}/slides",
        headers=auth_headers,
        json={
            "type": "content",
            "content": {"text": "Test content", "layout": "text-only"},
        },
    )
    assert response.status_code == 201
    data = response.json()

    from uuid import UUID
    return type('Slide', (), {
        'id': UUID(data["id"]),
        'type': data["type"],
        'content': data["content"],
        'order_index': data["order_index"],
    })()


@pytest_asyncio.fixture
async def test_slides(client: AsyncClient, auth_headers: dict, test_presentation) -> list:
    """Create multiple test slides via API."""
    slides = []

    for i in range(3):
        if i < 2:
            slide_data = {
                "type": "content",
                "content": {"text": f"Slide {i + 1} content", "layout": "text-only"},
            }
        else:
            slide_data = {
                "type": "question_text",
                "content": {"question": f"Question {i + 1}?"},
            }

        response = await client.post(
            f"/api/presentations/{test_presentation.id}/slides",
            headers=auth_headers,
            json=slide_data,
        )
        assert response.status_code == 201
        data = response.json()

        from uuid import UUID
        slide = type('Slide', (), {
            'id': UUID(data["id"]),
            'type': data["type"],
            'content': data["content"],
            'order_index': data["order_index"],
        })()
        slides.append(slide)

    return slides


@pytest_asyncio.fixture
async def test_session(client: AsyncClient, auth_headers: dict, test_presentation):
    """Create a test session via API."""
    response = await client.post(
        "/api/sessions",
        headers=auth_headers,
        json={"presentation_id": str(test_presentation.id)},
    )
    assert response.status_code == 201
    data = response.json()

    from uuid import UUID
    return type('Session', (), {
        'id': UUID(data["id"]),
        'join_code': data["join_code"],
        'status': data["status"],
        'presentation_id': UUID(data["presentation_id"]),
    })()
