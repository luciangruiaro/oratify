"""
Presentation API Endpoints

CRUD operations for presentations:
- List presentations (with pagination, search, filter)
- Create presentation
- Get presentation by ID or slug
- Update presentation
- Delete presentation
- Duplicate presentation
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_speaker, get_db
from app.models import Speaker, PresentationStatus
from app.schemas.presentation import (
    PresentationCreate,
    PresentationDuplicateRequest,
    PresentationListResponse,
    PresentationResponse,
    PresentationUpdate,
)
from app.services import presentation as presentation_service

router = APIRouter(prefix="/api/presentations", tags=["presentations"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentSpeaker = Annotated[Speaker, Depends(get_current_speaker)]


def presentation_to_response(presentation) -> PresentationResponse:
    """Convert Presentation model to response schema."""
    return PresentationResponse(
        id=presentation.id,
        speaker_id=presentation.speaker_id,
        title=presentation.title,
        description=presentation.description,
        speaker_notes=presentation.speaker_notes,
        slug=presentation.slug,
        status=PresentationStatus(presentation.status),
        slide_count=presentation_service.get_slide_count(presentation),
        created_at=presentation.created_at,
        updated_at=presentation.updated_at,
    )


@router.get("", response_model=PresentationListResponse)
async def list_presentations(
    db: DbSession,
    speaker: CurrentSpeaker,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: str | None = Query(None, description="Search in title and description"),
    status: PresentationStatus | None = Query(None, description="Filter by status"),
):
    """
    List all presentations for the authenticated speaker.

    Supports pagination, search, and status filtering.
    """
    presentations, total = await presentation_service.list_presentations(
        db=db,
        speaker_id=speaker.id,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
    )

    total_pages = (total + page_size - 1) // page_size

    return PresentationListResponse(
        items=[presentation_to_response(p) for p in presentations],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("", response_model=PresentationResponse, status_code=status.HTTP_201_CREATED)
async def create_presentation(
    db: DbSession,
    speaker: CurrentSpeaker,
    data: PresentationCreate,
):
    """Create a new presentation."""
    presentation = await presentation_service.create_presentation(
        db=db,
        speaker_id=speaker.id,
        title=data.title,
        description=data.description,
        speaker_notes=data.speaker_notes,
    )

    return presentation_to_response(presentation)


@router.get("/slug/{slug}", response_model=PresentationResponse)
async def get_presentation_by_slug(
    db: DbSession,
    slug: str,
):
    """
    Get a presentation by its slug.

    This endpoint is public for join purposes.
    """
    presentation = await presentation_service.get_presentation_by_slug(db, slug)

    if not presentation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Presentation not found",
        )

    return presentation_to_response(presentation)


@router.get("/{presentation_id}", response_model=PresentationResponse)
async def get_presentation(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
):
    """Get a presentation by ID. Must be owned by the authenticated speaker."""
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

    return presentation_to_response(presentation)


@router.put("/{presentation_id}", response_model=PresentationResponse)
async def update_presentation(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
    data: PresentationUpdate,
):
    """Update a presentation. Must be owned by the authenticated speaker."""
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

    try:
        presentation = await presentation_service.update_presentation(
            db=db,
            presentation=presentation,
            title=data.title,
            description=data.description,
            speaker_notes=data.speaker_notes,
            status=data.status,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return presentation_to_response(presentation)


@router.delete("/{presentation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_presentation(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
):
    """Delete a presentation. Must be owned by the authenticated speaker."""
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

    await presentation_service.delete_presentation(db, presentation)


@router.post("/{presentation_id}/duplicate", response_model=PresentationResponse, status_code=status.HTTP_201_CREATED)
async def duplicate_presentation(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID,
    data: PresentationDuplicateRequest | None = None,
):
    """
    Duplicate a presentation including all slides.

    Creates a new presentation with a new slug and status set to draft.
    """
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

    new_title = data.new_title if data else None
    new_presentation = await presentation_service.duplicate_presentation(
        db=db,
        presentation=presentation,
        new_title=new_title,
    )

    return presentation_to_response(new_presentation)
