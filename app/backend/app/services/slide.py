"""
Slide Service

Business logic for slide CRUD operations including:
- Create, read, update, delete slides
- Slide ordering and reordering
- Content validation per slide type
"""

from typing import Any
from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Slide, Presentation
from app.schemas.slide import (
    SlideType,
    validate_slide_content,
    get_default_content,
)


async def get_next_order_index(db: AsyncSession, presentation_id: UUID) -> int:
    """Get the next available order index for a presentation."""
    query = select(func.max(Slide.order_index)).where(
        Slide.presentation_id == presentation_id
    )
    result = await db.execute(query)
    max_index = result.scalar_one_or_none()
    return (max_index or -1) + 1


async def create_slide(
    db: AsyncSession,
    presentation_id: UUID,
    slide_type: SlideType,
    content: dict[str, Any] | None = None,
    order_index: int | None = None,
) -> Slide:
    """
    Create a new slide for a presentation.

    Args:
        db: Database session
        presentation_id: ID of the parent presentation
        slide_type: Type of slide to create
        content: Slide content (uses default if not provided)
        order_index: Position in presentation (appends to end if not provided)

    Returns:
        Created Slide object
    """
    # Get or generate order index
    if order_index is None:
        order_index = await get_next_order_index(db, presentation_id)

    # Get or validate content
    if content is None:
        content = get_default_content(slide_type)
    else:
        content = validate_slide_content(slide_type, content)

    slide = Slide(
        presentation_id=presentation_id,
        type=slide_type.value,
        content=content,
        order_index=order_index,
    )

    db.add(slide)
    await db.commit()
    await db.refresh(slide)
    return slide


async def get_slide_by_id(
    db: AsyncSession,
    slide_id: UUID,
    speaker_id: UUID | None = None,
) -> Slide | None:
    """
    Get a slide by ID, optionally verifying speaker ownership.

    Args:
        db: Database session
        slide_id: ID of the slide
        speaker_id: If provided, verify the slide belongs to this speaker

    Returns:
        Slide object or None if not found/unauthorized
    """
    query = select(Slide).where(Slide.id == slide_id)

    if speaker_id:
        query = query.join(Presentation).where(Presentation.speaker_id == speaker_id)

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def list_slides(
    db: AsyncSession,
    presentation_id: UUID,
) -> list[Slide]:
    """
    List all slides for a presentation in order.

    Args:
        db: Database session
        presentation_id: ID of the presentation

    Returns:
        List of Slide objects ordered by order_index
    """
    query = (
        select(Slide)
        .where(Slide.presentation_id == presentation_id)
        .order_by(Slide.order_index)
    )

    result = await db.execute(query)
    return list(result.scalars().all())


async def update_slide(
    db: AsyncSession,
    slide: Slide,
    slide_type: SlideType | None = None,
    content: dict[str, Any] | None = None,
    order_index: int | None = None,
) -> Slide:
    """
    Update a slide's properties.

    Args:
        db: Database session
        slide: Slide object to update
        slide_type: New slide type (if changing)
        content: New content (validated against type)
        order_index: New order index

    Returns:
        Updated Slide object
    """
    if slide_type is not None:
        slide.type = slide_type.value
        # If changing type, need to revalidate/reset content
        if content is None:
            content = get_default_content(slide_type)

    if content is not None:
        current_type = SlideType(slide.type)
        slide.content = validate_slide_content(current_type, content)

    if order_index is not None:
        slide.order_index = order_index

    await db.commit()
    await db.refresh(slide)
    return slide


async def delete_slide(db: AsyncSession, slide: Slide) -> None:
    """
    Delete a slide and reorder remaining slides.

    Args:
        db: Database session
        slide: Slide object to delete
    """
    presentation_id = slide.presentation_id
    deleted_order = slide.order_index

    await db.delete(slide)

    # Reorder remaining slides to fill the gap
    await db.execute(
        update(Slide)
        .where(Slide.presentation_id == presentation_id)
        .where(Slide.order_index > deleted_order)
        .values(order_index=Slide.order_index - 1)
    )

    await db.commit()


async def reorder_slides(
    db: AsyncSession,
    presentation_id: UUID,
    slide_ids: list[UUID],
) -> list[Slide]:
    """
    Reorder slides in a presentation.

    Args:
        db: Database session
        presentation_id: ID of the presentation
        slide_ids: Ordered list of slide IDs representing new order

    Returns:
        List of reordered Slide objects

    Raises:
        ValueError: If slide_ids don't match presentation's slides
    """
    # Get current slides
    current_slides = await list_slides(db, presentation_id)
    current_ids = {slide.id for slide in current_slides}
    requested_ids = set(slide_ids)

    # Validate all slides exist and belong to this presentation
    if current_ids != requested_ids:
        missing = current_ids - requested_ids
        extra = requested_ids - current_ids
        errors = []
        if missing:
            errors.append(f"Missing slides: {missing}")
        if extra:
            errors.append(f"Unknown slides: {extra}")
        raise ValueError("; ".join(errors))

    # Update order indices
    slide_map = {slide.id: slide for slide in current_slides}
    for new_index, slide_id in enumerate(slide_ids):
        slide_map[slide_id].order_index = new_index

    await db.commit()

    # Return slides in new order
    return [slide_map[sid] for sid in slide_ids]


async def duplicate_slide(
    db: AsyncSession,
    slide: Slide,
    order_index: int | None = None,
) -> Slide:
    """
    Duplicate a slide.

    Args:
        db: Database session
        slide: Slide to duplicate
        order_index: Position for new slide (after original if not provided)

    Returns:
        New duplicated Slide object
    """
    if order_index is None:
        order_index = slide.order_index + 1
        # Shift subsequent slides
        await db.execute(
            update(Slide)
            .where(Slide.presentation_id == slide.presentation_id)
            .where(Slide.order_index >= order_index)
            .values(order_index=Slide.order_index + 1)
        )

    new_slide = Slide(
        presentation_id=slide.presentation_id,
        type=slide.type,
        content=slide.content.copy() if slide.content else {},
        order_index=order_index,
    )

    db.add(new_slide)
    await db.commit()
    await db.refresh(new_slide)
    return new_slide


async def insert_slide_at(
    db: AsyncSession,
    presentation_id: UUID,
    slide_type: SlideType,
    position: int,
    content: dict[str, Any] | None = None,
) -> Slide:
    """
    Insert a new slide at a specific position.

    Args:
        db: Database session
        presentation_id: ID of the presentation
        slide_type: Type of slide to create
        position: Index where to insert (0-based)
        content: Slide content

    Returns:
        Created Slide object
    """
    # Shift existing slides at and after position
    await db.execute(
        update(Slide)
        .where(Slide.presentation_id == presentation_id)
        .where(Slide.order_index >= position)
        .values(order_index=Slide.order_index + 1)
    )

    return await create_slide(
        db=db,
        presentation_id=presentation_id,
        slide_type=slide_type,
        content=content,
        order_index=position,
    )
