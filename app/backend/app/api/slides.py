"""
Slide API Endpoints

CRUD operations for slides within presentations:
- List slides for a presentation
- Create slide
- Get slide by ID
- Update slide
- Delete slide
- Reorder slides
- Duplicate slide
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_speaker, get_db
from app.models import Speaker
from app.schemas.slide import (
    SlideCreate,
    SlideUpdate,
    SlideResponse,
    SlideListResponse,
    SlideReorderRequest,
    SlideReorderResponse,
    SlideType,
)
from app.services import slide as slide_service
from app.services import presentation as presentation_service

router = APIRouter(prefix="/api", tags=["slides"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentSpeaker = Annotated[Speaker, Depends(get_current_speaker)]


def slide_to_response(slide) -> SlideResponse:
    """Convert Slide model to response schema."""
    return SlideResponse(
        id=slide.id,
        presentation_id=slide.presentation_id,
        order_index=slide.order_index,
        type=SlideType(slide.type),
        content=slide.content or {},
        created_at=slide.created_at,
        updated_at=slide.updated_at,
    )


async def verify_presentation_ownership(
    db: DbSession,
    presentation_id: UUID,
    speaker: CurrentSpeaker,
):
    """Helper to verify presentation exists and belongs to speaker."""
    presentation = await presentation_service.get_presentation_by_id(
        db=db,
        presentation_id=presentation_id,
        speaker_id=speaker.id,
    )
    if not presentation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Presentation not found",
        )
    return presentation


@router.get("/presentations/{presentation_id}/slides", response_model=SlideListResponse)
async def list_slides(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
):
    """
    List all slides for a presentation in order.
    """
    await verify_presentation_ownership(db, presentation_id, speaker)

    slides = await slide_service.list_slides(db, presentation_id)

    return SlideListResponse(
        items=[slide_to_response(s) for s in slides],
        total=len(slides),
    )


@router.post(
    "/presentations/{presentation_id}/slides",
    response_model=SlideResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
    data: SlideCreate,
):
    """
    Create a new slide for a presentation.

    If order_index is not provided, the slide is appended to the end.
    """
    await verify_presentation_ownership(db, presentation_id, speaker)

    try:
        slide = await slide_service.create_slide(
            db=db,
            presentation_id=presentation_id,
            slide_type=data.slide_type,
            content=data.content if data.content else None,
            order_index=data.order_index,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return slide_to_response(slide)


@router.post(
    "/presentations/{presentation_id}/slides/insert/{position}",
    response_model=SlideResponse,
    status_code=status.HTTP_201_CREATED,
)
async def insert_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
    position: int,
    data: SlideCreate,
):
    """
    Insert a new slide at a specific position.

    Existing slides at and after the position are shifted.
    """
    await verify_presentation_ownership(db, presentation_id, speaker)

    try:
        slide = await slide_service.insert_slide_at(
            db=db,
            presentation_id=presentation_id,
            slide_type=data.slide_type,
            position=position,
            content=data.content if data.content else None,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return slide_to_response(slide)


@router.get("/slides/{slide_id}", response_model=SlideResponse)
async def get_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    slide_id: UUID,
):
    """
    Get a slide by ID.
    """
    slide = await slide_service.get_slide_by_id(
        db=db,
        slide_id=slide_id,
        speaker_id=speaker.id,
    )

    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found",
        )

    return slide_to_response(slide)


@router.put("/slides/{slide_id}", response_model=SlideResponse)
async def update_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    slide_id: UUID,
    data: SlideUpdate,
):
    """
    Update a slide's type, content, or position.
    """
    slide = await slide_service.get_slide_by_id(
        db=db,
        slide_id=slide_id,
        speaker_id=speaker.id,
    )

    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found",
        )

    try:
        slide = await slide_service.update_slide(
            db=db,
            slide=slide,
            slide_type=data.slide_type,
            content=data.content,
            order_index=data.order_index,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return slide_to_response(slide)


@router.delete("/slides/{slide_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    slide_id: UUID,
):
    """
    Delete a slide. Remaining slides are automatically reordered.
    """
    slide = await slide_service.get_slide_by_id(
        db=db,
        slide_id=slide_id,
        speaker_id=speaker.id,
    )

    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found",
        )

    await slide_service.delete_slide(db, slide)


@router.post("/slides/{slide_id}/duplicate", response_model=SlideResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    slide_id: UUID,
):
    """
    Duplicate a slide. The new slide is inserted after the original.
    """
    slide = await slide_service.get_slide_by_id(
        db=db,
        slide_id=slide_id,
        speaker_id=speaker.id,
    )

    if not slide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slide not found",
        )

    new_slide = await slide_service.duplicate_slide(db, slide)
    return slide_to_response(new_slide)


@router.put("/presentations/{presentation_id}/slides/reorder", response_model=SlideReorderResponse)
async def reorder_slides(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
    data: SlideReorderRequest,
):
    """
    Reorder all slides in a presentation.

    The slide_ids list must contain all slide IDs in the presentation
    in the desired new order.
    """
    await verify_presentation_ownership(db, presentation_id, speaker)

    try:
        slides = await slide_service.reorder_slides(
            db=db,
            presentation_id=presentation_id,
            slide_ids=data.slide_ids,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return SlideReorderResponse(
        reordered=len(slides),
        slides=[slide_to_response(s) for s in slides],
    )
