"""
Session API Endpoints

Session management for live presentations:
- Create session (generates join code)
- Get session by ID, join code, or presentation slug
- Start/end/pause/resume session
- Change current slide
- Get session statistics
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_speaker, get_db
from app.models import Speaker
from app.schemas.session import (
    CurrentSlideUpdate,
    SessionCreate,
    SessionDetailResponse,
    SessionJoinInfo,
    SessionListResponse,
    SessionResponse,
    SessionStatistics,
    SessionStatus,
)
from app.services import session as session_service
from app.services import websocket_events

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

DbSession = Annotated[AsyncSession, Depends(get_db)]
CurrentSpeaker = Annotated[Speaker, Depends(get_current_speaker)]


def session_to_response(session) -> SessionResponse:
    """Convert Session model to response schema."""
    return SessionResponse(
        id=session.id,
        presentation_id=session.presentation_id,
        join_code=session.join_code,
        current_slide_id=session.current_slide_id,
        status=SessionStatus(session.status),
        started_at=session.started_at,
        ended_at=session.ended_at,
        created_at=session.created_at,
        participant_count=session_service.get_participant_count(session),
        response_count=session_service.get_response_count(session),
    )


def session_to_detail_response(session) -> SessionDetailResponse:
    """Convert Session model to detailed response schema."""
    presentation = session.presentation
    return SessionDetailResponse(
        id=session.id,
        presentation_id=session.presentation_id,
        join_code=session.join_code,
        current_slide_id=session.current_slide_id,
        status=SessionStatus(session.status),
        started_at=session.started_at,
        ended_at=session.ended_at,
        created_at=session.created_at,
        participant_count=session_service.get_participant_count(session),
        response_count=session_service.get_response_count(session),
        presentation_title=presentation.title,
        presentation_slug=presentation.slug,
        total_slides=len(presentation.slides) if presentation.slides else 0,
    )


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    data: SessionCreate,
):
    """
    Create a new session for a presentation.

    Generates a unique 6-character join code.
    Sets initial status to "pending".
    """
    try:
        session = await session_service.create_session(
            db=db,
            presentation_id=data.presentation_id,
            speaker_id=speaker.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return session_to_response(session)


@router.get("", response_model=SessionListResponse)
async def list_sessions(
    db: DbSession,
    speaker: CurrentSpeaker,
    presentation_id: UUID | None = Query(None, description="Filter by presentation ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status_filter: SessionStatus | None = Query(None, alias="status", description="Filter by status"),
):
    """
    List all sessions for the authenticated speaker's presentations.

    Supports pagination and filtering by presentation or status.
    """
    sessions, total = await session_service.list_sessions(
        db=db,
        speaker_id=speaker.id,
        presentation_id=presentation_id,
        page=page,
        page_size=page_size,
        status=status_filter,
    )

    total_pages = (total + page_size - 1) // page_size

    return SessionListResponse(
        items=[session_to_response(s) for s in sessions],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/code/{join_code}", response_model=SessionJoinInfo)
async def get_session_by_code(
    db: DbSession,
    join_code: str,
):
    """
    Get session information by join code.

    This endpoint is public - no authentication required.
    Used by audience members to join a session.
    """
    session = await session_service.get_session_by_join_code(db, join_code)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    # Calculate current slide order
    current_slide_order = None
    if session.current_slide and session.presentation.slides:
        for i, slide in enumerate(sorted(session.presentation.slides, key=lambda s: s.order_index)):
            if slide.id == session.current_slide_id:
                current_slide_order = i
                break

    return SessionJoinInfo(
        join_code=session.join_code,
        presentation_title=session.presentation.title,
        status=SessionStatus(session.status),
        current_slide_order=current_slide_order,
    )


@router.get("/slug/{slug}", response_model=SessionJoinInfo)
async def get_session_by_slug(
    db: DbSession,
    slug: str,
):
    """
    Get the most recent active/pending session for a presentation by slug.

    This endpoint is public - no authentication required.
    Used by audience members to join via presentation URL.
    """
    session = await session_service.get_session_by_slug(db, slug)

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active session found for this presentation",
        )

    # Calculate current slide order
    current_slide_order = None
    if session.current_slide and session.presentation.slides:
        for i, slide in enumerate(sorted(session.presentation.slides, key=lambda s: s.order_index)):
            if slide.id == session.current_slide_id:
                current_slide_order = i
                break

    return SessionJoinInfo(
        join_code=session.join_code,
        presentation_title=session.presentation.title,
        status=SessionStatus(session.status),
        current_slide_order=current_slide_order,
    )


@router.get("/{session_id}", response_model=SessionDetailResponse)
async def get_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """Get a session by ID. Must be owned by the authenticated speaker."""
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    return session_to_detail_response(session)


@router.post("/{session_id}/start", response_model=SessionResponse)
async def start_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """
    Start a pending session.

    Sets status to "active" and records the start time.
    Broadcasts session_started event to all connected clients.
    """
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    try:
        session = await session_service.start_session(db, session)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Broadcast to connected clients
    await websocket_events.broadcast_session_started(session)

    return session_to_response(session)


@router.post("/{session_id}/end", response_model=SessionResponse)
async def end_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """
    End an active or paused session.

    Sets status to "ended" and records the end time.
    Broadcasts session_ended event and closes all WebSocket connections.
    """
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    try:
        session = await session_service.end_session(db, session)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Broadcast to connected clients and close connections
    await websocket_events.broadcast_session_ended(session)

    return session_to_response(session)


@router.post("/{session_id}/pause", response_model=SessionResponse)
async def pause_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """
    Pause an active session.

    Broadcasts session_paused event to all connected clients.
    """
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    try:
        session = await session_service.pause_session(db, session)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Broadcast to connected clients
    await websocket_events.broadcast_session_paused(session)

    return session_to_response(session)


@router.post("/{session_id}/resume", response_model=SessionResponse)
async def resume_session(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """
    Resume a paused session.

    Broadcasts session_resumed event to all connected clients.
    """
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    try:
        session = await session_service.resume_session(db, session)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Broadcast to connected clients
    await websocket_events.broadcast_session_resumed(session)

    return session_to_response(session)


@router.put("/{session_id}/current-slide", response_model=SessionResponse)
async def change_current_slide(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
    data: CurrentSlideUpdate,
):
    """
    Change the current slide of a session.

    The slide must belong to the session's presentation.
    Broadcasts slide_changed event to all connected clients.
    """
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    try:
        session = await session_service.change_current_slide(db, session, data.slide_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Broadcast slide change to connected clients
    if session.current_slide:
        await websocket_events.broadcast_slide_change(session, session.current_slide)

    return session_to_response(session)


@router.get("/{session_id}/statistics", response_model=SessionStatistics)
async def get_session_statistics(
    db: DbSession,
    speaker: CurrentSpeaker,
    session_id: UUID,
):
    """Get statistics for a session."""
    session = await session_service.get_session_by_id(
        db=db,
        session_id=session_id,
        speaker_id=speaker.id,
    )

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    stats = await session_service.get_session_statistics(db, session)

    return SessionStatistics(
        session_id=stats["session_id"],
        participant_count=stats["participant_count"],
        total_responses=stats["total_responses"],
        responses_per_slide=stats["responses_per_slide"],
        duration_seconds=stats["duration_seconds"],
        status=SessionStatus(stats["status"]),
    )
