"""
Presentation Service

Business logic for presentation CRUD operations including:
- Slug generation and uniqueness validation
- Status state machine transitions
- Presentation duplication
- Pagination and filtering
"""

import re
import secrets
import string
from uuid import UUID

from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Presentation, PresentationStatus, Slide


def generate_slug(title: str) -> str:
    """
    Generate a URL-friendly slug from a title.

    - Converts to lowercase
    - Replaces spaces and special chars with hyphens
    - Adds random suffix for uniqueness
    """
    # Convert to lowercase and replace spaces
    slug = title.lower().strip()
    # Remove special characters, keep only alphanumeric and spaces
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    # Replace spaces and multiple hyphens with single hyphen
    slug = re.sub(r"[\s-]+", "-", slug)
    # Remove leading/trailing hyphens
    slug = slug.strip("-")
    # Limit length
    slug = slug[:50]
    # Add random suffix for uniqueness
    suffix = "".join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
    return f"{slug}-{suffix}" if slug else suffix


async def check_slug_exists(db: AsyncSession, slug: str, exclude_id: UUID | None = None) -> bool:
    """Check if a slug already exists in the database."""
    query = select(Presentation.id).where(Presentation.slug == slug)
    if exclude_id:
        query = query.where(Presentation.id != exclude_id)
    result = await db.execute(query)
    return result.scalar_one_or_none() is not None


async def generate_unique_slug(db: AsyncSession, title: str) -> str:
    """Generate a unique slug, retrying if collision occurs."""
    for _ in range(10):  # Max 10 attempts
        slug = generate_slug(title)
        if not await check_slug_exists(db, slug):
            return slug
    # Fallback: use only random characters
    return "".join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(12))


async def create_presentation(
    db: AsyncSession,
    speaker_id: UUID,
    title: str,
    description: str | None = None,
    speaker_notes: str | None = None,
) -> Presentation:
    """Create a new presentation for a speaker."""
    slug = await generate_unique_slug(db, title)

    presentation = Presentation(
        speaker_id=speaker_id,
        title=title,
        description=description,
        speaker_notes=speaker_notes,
        slug=slug,
        status=PresentationStatus.DRAFT.value,
    )

    db.add(presentation)
    await db.commit()
    await db.refresh(presentation)
    return presentation


async def get_presentation_by_id(
    db: AsyncSession,
    presentation_id: UUID,
    speaker_id: UUID | None = None,
) -> Presentation | None:
    """
    Get a presentation by ID, optionally filtering by speaker.

    Returns None if not found or not owned by speaker.
    """
    query = select(Presentation).where(Presentation.id == presentation_id)
    if speaker_id:
        query = query.where(Presentation.speaker_id == speaker_id)
    query = query.options(selectinload(Presentation.slides))

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_presentation_by_slug(db: AsyncSession, slug: str) -> Presentation | None:
    """Get a presentation by its slug."""
    query = select(Presentation).where(Presentation.slug == slug)
    query = query.options(selectinload(Presentation.slides))
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def list_presentations(
    db: AsyncSession,
    speaker_id: UUID,
    page: int = 1,
    page_size: int = 20,
    search: str | None = None,
    status: PresentationStatus | None = None,
) -> tuple[list[Presentation], int]:
    """
    List presentations for a speaker with pagination and filtering.

    Returns tuple of (presentations, total_count).
    """
    # Base query
    query = select(Presentation).where(Presentation.speaker_id == speaker_id)
    count_query = select(func.count(Presentation.id)).where(Presentation.speaker_id == speaker_id)

    # Apply search filter
    if search:
        search_filter = or_(
            Presentation.title.ilike(f"%{search}%"),
            Presentation.description.ilike(f"%{search}%"),
        )
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    # Apply status filter
    if status:
        query = query.where(Presentation.status == status.value)
        count_query = count_query.where(Presentation.status == status.value)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(Presentation.updated_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    query = query.options(selectinload(Presentation.slides))

    result = await db.execute(query)
    presentations = list(result.scalars().all())

    return presentations, total


async def update_presentation(
    db: AsyncSession,
    presentation: Presentation,
    title: str | None = None,
    description: str | None = None,
    speaker_notes: str | None = None,
    status: PresentationStatus | None = None,
) -> Presentation:
    """Update a presentation's fields."""
    if title is not None:
        presentation.title = title
    if description is not None:
        presentation.description = description
    if speaker_notes is not None:
        presentation.speaker_notes = speaker_notes
    if status is not None:
        # Validate status transition
        validate_status_transition(presentation.status, status.value)
        presentation.status = status.value

    await db.commit()
    await db.refresh(presentation)
    return presentation


def validate_status_transition(current: str, new: str) -> None:
    """
    Validate that a status transition is allowed.

    Allowed transitions:
    - draft -> active, archived
    - active -> draft, archived
    - archived -> draft
    """
    allowed_transitions = {
        PresentationStatus.DRAFT.value: [
            PresentationStatus.ACTIVE.value,
            PresentationStatus.ARCHIVED.value,
        ],
        PresentationStatus.ACTIVE.value: [
            PresentationStatus.DRAFT.value,
            PresentationStatus.ARCHIVED.value,
        ],
        PresentationStatus.ARCHIVED.value: [
            PresentationStatus.DRAFT.value,
        ],
    }

    if current == new:
        return  # No transition needed

    if new not in allowed_transitions.get(current, []):
        raise ValueError(f"Invalid status transition from {current} to {new}")


async def delete_presentation(db: AsyncSession, presentation: Presentation) -> None:
    """Delete a presentation and all its slides/sessions (cascade)."""
    await db.delete(presentation)
    await db.commit()


async def duplicate_presentation(
    db: AsyncSession,
    presentation: Presentation,
    new_title: str | None = None,
) -> Presentation:
    """
    Duplicate a presentation including all its slides.

    Creates new presentation with:
    - New ID and slug
    - Optional new title (defaults to "Copy of <original>")
    - All slides copied with new IDs
    - Status set to draft
    """
    title = new_title or f"Copy of {presentation.title}"
    slug = await generate_unique_slug(db, title)

    # Create new presentation
    new_presentation = Presentation(
        speaker_id=presentation.speaker_id,
        title=title,
        description=presentation.description,
        speaker_notes=presentation.speaker_notes,
        slug=slug,
        status=PresentationStatus.DRAFT.value,
    )

    db.add(new_presentation)
    await db.flush()  # Get ID for new presentation

    # Copy slides
    for slide in presentation.slides:
        new_slide = Slide(
            presentation_id=new_presentation.id,
            order_index=slide.order_index,
            type=slide.type,
            content=slide.content,  # JSONB is copied by value
        )
        db.add(new_slide)

    await db.commit()
    await db.refresh(new_presentation)
    return new_presentation


def get_slide_count(presentation: Presentation) -> int:
    """Get the number of slides in a presentation."""
    return len(presentation.slides) if presentation.slides else 0
