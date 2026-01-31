"""
Seed data script for development environment.

Creates sample data for testing:
- 2 speakers with known credentials
- 2 presentations per speaker
- 5 slides per presentation (various types)
- 1 active session with participants and responses

Usage:
    cd app/backend
    python -m scripts.seed

The script is idempotent - it clears existing seed data before inserting.
"""

import asyncio
import uuid
from datetime import datetime, timezone

from passlib.context import CryptContext
from sqlalchemy import delete, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


# Sample data
SPEAKERS = [
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "email": "speaker1@example.com",
        "password": "password123",
        "name": "Alice Speaker",
        "plan_type": "pro",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "email": "speaker2@example.com",
        "password": "password123",
        "name": "Bob Presenter",
        "plan_type": "free",
    },
]

PRESENTATIONS = [
    {
        "id": uuid.UUID("aaaa1111-1111-1111-1111-111111111111"),
        "speaker_id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "title": "Introduction to AI",
        "description": "A beginner-friendly overview of artificial intelligence concepts.",
        "slug": "intro-to-ai",
        "speaker_notes": """
This presentation covers the basics of AI. Key points to remember:
- AI is about creating intelligent machines
- Machine learning is a subset of AI
- Deep learning uses neural networks
- AI is transforming every industry

When asked about specific applications, mention:
- Healthcare: diagnosis, drug discovery
- Finance: fraud detection, trading
- Transportation: autonomous vehicles
- Entertainment: recommendations, content creation
        """,
        "status": "draft",
    },
    {
        "id": uuid.UUID("aaaa2222-2222-2222-2222-222222222222"),
        "speaker_id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "title": "Web Development Best Practices",
        "description": "Modern approaches to building web applications.",
        "slug": "web-dev-best-practices",
        "speaker_notes": "Cover React, TypeScript, and modern tooling.",
        "status": "active",
    },
    {
        "id": uuid.UUID("bbbb1111-1111-1111-1111-111111111111"),
        "speaker_id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "title": "Startup Pitching 101",
        "description": "How to pitch your startup to investors.",
        "slug": "startup-pitching",
        "speaker_notes": "Focus on problem, solution, market size, team.",
        "status": "draft",
    },
    {
        "id": uuid.UUID("bbbb2222-2222-2222-2222-222222222222"),
        "speaker_id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "title": "Remote Work Culture",
        "description": "Building effective remote teams.",
        "slug": "remote-work-culture",
        "speaker_notes": "Communication, trust, and async workflows.",
        "status": "draft",
    },
]


def get_slides_for_presentation(presentation_id: uuid.UUID) -> list:
    """Generate sample slides for a presentation."""
    base_id = str(presentation_id)[:8]
    return [
        {
            "id": uuid.UUID(f"{base_id}-0001-0001-0001-000000000001"),
            "presentation_id": presentation_id,
            "order_index": 0,
            "type": "content",
            "content": {
                "image_url": None,
                "text": "# Welcome\n\nThank you for joining this session!",
                "layout": "text-only",
            },
        },
        {
            "id": uuid.UUID(f"{base_id}-0002-0002-0002-000000000002"),
            "presentation_id": presentation_id,
            "order_index": 1,
            "type": "question_text",
            "content": {
                "question": "What do you hope to learn today?",
                "placeholder": "Type your answer...",
                "max_length": 500,
                "required": False,
            },
        },
        {
            "id": uuid.UUID(f"{base_id}-0003-0003-0003-000000000003"),
            "presentation_id": presentation_id,
            "order_index": 2,
            "type": "content",
            "content": {
                "image_url": None,
                "text": "## Main Topic\n\nHere's what we'll cover today...",
                "layout": "text-only",
            },
        },
        {
            "id": uuid.UUID(f"{base_id}-0004-0004-0004-000000000004"),
            "presentation_id": presentation_id,
            "order_index": 3,
            "type": "question_choice",
            "content": {
                "question": "How familiar are you with this topic?",
                "options": [
                    {"id": str(uuid.uuid4()), "text": "Complete beginner", "order": 0},
                    {"id": str(uuid.uuid4()), "text": "Some experience", "order": 1},
                    {"id": str(uuid.uuid4()), "text": "Intermediate", "order": 2},
                    {"id": str(uuid.uuid4()), "text": "Expert", "order": 3},
                ],
                "allow_multiple": False,
                "show_results": True,
            },
        },
        {
            "id": uuid.UUID(f"{base_id}-0005-0005-0005-000000000005"),
            "presentation_id": presentation_id,
            "order_index": 4,
            "type": "conclusion",
            "content": {
                "title": "Key Takeaways",
                "conclusions": [
                    "First key point from the presentation",
                    "Second important insight",
                    "Action item for the audience",
                ],
                "auto_generate": False,
                "thank_you_message": "Thank you for attending!",
            },
        },
    ]


async def seed_database(database_url: str) -> None:
    """Seed the database with sample data."""
    print("Starting database seed...")

    # Create engine and session
    engine = create_async_engine(database_url, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with async_session() as session:
        # Clear existing data (in reverse order of dependencies)
        print("Clearing existing data...")
        await session.execute(text("DELETE FROM responses"))
        await session.execute(text("DELETE FROM participants"))
        await session.execute(text("DELETE FROM sessions"))
        await session.execute(text("DELETE FROM slides"))
        await session.execute(text("DELETE FROM presentations"))
        await session.execute(text("DELETE FROM speakers"))
        await session.commit()

        # Insert speakers
        print("Creating speakers...")
        for speaker in SPEAKERS:
            await session.execute(
                text("""
                    INSERT INTO speakers (id, email, password_hash, name, plan_type, is_active, created_at, updated_at)
                    VALUES (:id, :email, :password_hash, :name, :plan_type, true, now(), now())
                """),
                {
                    "id": speaker["id"],
                    "email": speaker["email"],
                    "password_hash": hash_password(speaker["password"]),
                    "name": speaker["name"],
                    "plan_type": speaker["plan_type"],
                },
            )
        await session.commit()
        print(f"  Created {len(SPEAKERS)} speakers")

        # Insert presentations
        print("Creating presentations...")
        for pres in PRESENTATIONS:
            await session.execute(
                text("""
                    INSERT INTO presentations (id, speaker_id, title, description, slug, speaker_notes, status, created_at, updated_at)
                    VALUES (:id, :speaker_id, :title, :description, :slug, :speaker_notes, :status, now(), now())
                """),
                pres,
            )
        await session.commit()
        print(f"  Created {len(PRESENTATIONS)} presentations")

        # Insert slides
        print("Creating slides...")
        slide_count = 0
        for pres in PRESENTATIONS:
            slides = get_slides_for_presentation(pres["id"])
            for slide in slides:
                await session.execute(
                    text("""
                        INSERT INTO slides (id, presentation_id, order_index, type, content, created_at, updated_at)
                        VALUES (:id, :presentation_id, :order_index, :type, :content::jsonb, now(), now())
                    """),
                    {
                        "id": slide["id"],
                        "presentation_id": slide["presentation_id"],
                        "order_index": slide["order_index"],
                        "type": slide["type"],
                        "content": str(slide["content"]).replace("'", '"'),
                    },
                )
                slide_count += 1
        await session.commit()
        print(f"  Created {slide_count} slides")

        # Create a sample session with participants
        print("Creating sample session...")
        session_id = uuid.UUID("cccc1111-1111-1111-1111-111111111111")
        first_slide_id = uuid.UUID("aaaa1111-0001-0001-0001-000000000001")

        await session.execute(
            text("""
                INSERT INTO sessions (id, presentation_id, join_code, current_slide_id, status, started_at, created_at)
                VALUES (:id, :presentation_id, :join_code, :current_slide_id, :status, now(), now())
            """),
            {
                "id": session_id,
                "presentation_id": PRESENTATIONS[0]["id"],
                "join_code": "ABC123",
                "current_slide_id": first_slide_id,
                "status": "active",
            },
        )
        await session.commit()

        # Create participants
        print("Creating sample participants...")
        participants = [
            {"id": uuid.uuid4(), "name": "John Doe", "is_anonymous": False},
            {"id": uuid.uuid4(), "name": None, "is_anonymous": True},
            {"id": uuid.uuid4(), "name": "Jane Smith", "is_anonymous": False},
        ]
        for p in participants:
            await session.execute(
                text("""
                    INSERT INTO participants (id, session_id, display_name, is_anonymous, joined_at)
                    VALUES (:id, :session_id, :display_name, :is_anonymous, now())
                """),
                {
                    "id": p["id"],
                    "session_id": session_id,
                    "display_name": p["name"],
                    "is_anonymous": p["is_anonymous"],
                },
            )
        await session.commit()
        print(f"  Created {len(participants)} participants")

    await engine.dispose()

    print("\nSeed completed successfully!")
    print("\nTest credentials:")
    print("  Email: speaker1@example.com")
    print("  Password: password123")
    print("\n  Email: speaker2@example.com")
    print("  Password: password123")
    print("\nSample session join code: ABC123")


async def main() -> None:
    """Main entry point."""
    import os
    from dotenv import load_dotenv

    # Load environment variables
    load_dotenv()

    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://oratify:oratify@localhost:5432/oratify",
    )

    await seed_database(database_url)


if __name__ == "__main__":
    asyncio.run(main())
