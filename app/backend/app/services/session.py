"""
Session Service

Business logic for session management including:
- Session creation with unique join code generation
- Session status transitions (pending -> active -> paused -> ended)
- Current slide tracking
- Session statistics
"""

import secrets
import string
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Presentation, Session, Slide, Response, Participant
from app.schemas.session import SessionStatus


def generate_join_code() -> str:
    """
    Generate a 6-character alphanumeric join code.

    Uses uppercase letters and digits for readability.
    Excludes ambiguous characters: 0, O, I, 1, L.
    """
    # Alphabet without ambiguous chars
    alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
    return "".join(secrets.choice(alphabet) for _ in range(6))


async def check_join_code_exists(db: AsyncSession, join_code: str) -> bool:
    """Check if a join code already exists and is not ended."""
    query = select(Session.id).where(
        Session.join_code == join_code,
        Session.status != SessionStatus.ENDED.value,
    )
    result = await db.execute(query)
    return result.scalar_one_or_none() is not None


async def generate_unique_join_code(db: AsyncSession) -> str:
    """Generate a unique join code, retrying if collision occurs."""
    for _ in range(10):  # Max 10 attempts
        code = generate_join_code()
        if not await check_join_code_exists(db, code):
            return code
    # Fallback: very unlikely to reach here
    raise ValueError("Failed to generate unique join code after 10 attempts")


async def create_session(
    db: AsyncSession,
    presentation_id: UUID,
    speaker_id: UUID,
) -> Session:
    """
    Create a new session for a presentation.

    Validates that the speaker owns the presentation.
    Generates a unique 6-character join code.
    Sets initial status to "pending".
    """
    # Verify presentation exists and belongs to speaker
    presentation = await db.execute(
        select(Presentation)
        .where(
            Presentation.id == presentation_id,
            Presentation.speaker_id == speaker_id,
        )
        .options(selectinload(Presentation.slides))
    )
    presentation = presentation.scalar_one_or_none()

    if not presentation:
        raise ValueError("Presentation not found or not owned by speaker")

    join_code = await generate_unique_join_code(db)

    # Get first slide if exists
    first_slide_id = None
    if presentation.slides:
        sorted_slides = sorted(presentation.slides, key=lambda s: s.order_index)
        first_slide_id = sorted_slides[0].id if sorted_slides else None

    session = Session(
        presentation_id=presentation_id,
        join_code=join_code,
        current_slide_id=first_slide_id,
        status=SessionStatus.PENDING.value,
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_session_by_id(
    db: AsyncSession,
    session_id: UUID,
    speaker_id: UUID | None = None,
) -> Session | None:
    """
    Get a session by ID, optionally verifying speaker ownership.
    """
    query = select(Session).where(Session.id == session_id)
    query = query.options(
        selectinload(Session.presentation),
        selectinload(Session.participants),
        selectinload(Session.responses),
    )

    result = await db.execute(query)
    session = result.scalar_one_or_none()

    if session and speaker_id:
        # Verify ownership through presentation
        if session.presentation.speaker_id != speaker_id:
            return None

    return session


async def get_session_by_join_code(
    db: AsyncSession,
    join_code: str,
) -> Session | None:
    """Get a session by its join code (case-insensitive)."""
    query = select(Session).where(
        Session.join_code == join_code.upper()
    )
    query = query.options(
        selectinload(Session.presentation).selectinload(Presentation.slides),
        selectinload(Session.current_slide),
    )

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def get_session_by_slug(
    db: AsyncSession,
    slug: str,
) -> Session | None:
    """
    Get the most recent active/pending session for a presentation by slug.
    """
    query = (
        select(Session)
        .join(Presentation)
        .where(
            Presentation.slug == slug,
            Session.status.in_([SessionStatus.PENDING.value, SessionStatus.ACTIVE.value, SessionStatus.PAUSED.value]),
        )
        .order_by(Session.created_at.desc())
        .limit(1)
    )
    query = query.options(
        selectinload(Session.presentation).selectinload(Presentation.slides),
        selectinload(Session.current_slide),
    )

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def list_sessions(
    db: AsyncSession,
    speaker_id: UUID,
    presentation_id: UUID | None = None,
    page: int = 1,
    page_size: int = 20,
    status: SessionStatus | None = None,
) -> tuple[list[Session], int]:
    """
    List sessions for a speaker's presentations with pagination.
    """
    # Base query joining with presentation for speaker filter
    query = (
        select(Session)
        .join(Presentation)
        .where(Presentation.speaker_id == speaker_id)
    )
    count_query = (
        select(func.count(Session.id))
        .join(Presentation)
        .where(Presentation.speaker_id == speaker_id)
    )

    # Filter by presentation
    if presentation_id:
        query = query.where(Session.presentation_id == presentation_id)
        count_query = count_query.where(Session.presentation_id == presentation_id)

    # Filter by status
    if status:
        query = query.where(Session.status == status.value)
        count_query = count_query.where(Session.status == status.value)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination and ordering
    query = query.order_by(Session.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    query = query.options(
        selectinload(Session.presentation),
        selectinload(Session.participants),
    )

    result = await db.execute(query)
    sessions = list(result.scalars().all())

    return sessions, total


def validate_session_status_transition(current: str, new: str) -> None:
    """
    Validate that a session status transition is allowed.

    Allowed transitions:
    - pending -> active
    - active -> paused, ended
    - paused -> active, ended
    - ended -> (terminal, no transitions allowed)
    """
    allowed_transitions = {
        SessionStatus.PENDING.value: [SessionStatus.ACTIVE.value],
        SessionStatus.ACTIVE.value: [SessionStatus.PAUSED.value, SessionStatus.ENDED.value],
        SessionStatus.PAUSED.value: [SessionStatus.ACTIVE.value, SessionStatus.ENDED.value],
        SessionStatus.ENDED.value: [],  # Terminal state
    }

    if new not in allowed_transitions.get(current, []):
        raise ValueError(f"Invalid session status transition from {current} to {new}")


async def start_session(
    db: AsyncSession,
    session: Session,
) -> Session:
    """
    Start a pending session.

    Sets status to active and records started_at timestamp.
    """
    validate_session_status_transition(session.status, SessionStatus.ACTIVE.value)

    session.status = SessionStatus.ACTIVE.value
    session.started_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(session)
    return session


async def end_session(
    db: AsyncSession,
    session: Session,
) -> Session:
    """
    End an active or paused session.

    Sets status to ended and records ended_at timestamp.
    """
    validate_session_status_transition(session.status, SessionStatus.ENDED.value)

    session.status = SessionStatus.ENDED.value
    session.ended_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(session)
    return session


async def pause_session(
    db: AsyncSession,
    session: Session,
) -> Session:
    """Pause an active session."""
    validate_session_status_transition(session.status, SessionStatus.PAUSED.value)

    session.status = SessionStatus.PAUSED.value

    await db.commit()
    await db.refresh(session)
    return session


async def resume_session(
    db: AsyncSession,
    session: Session,
) -> Session:
    """Resume a paused session. Only works from paused status."""
    # Resume can only be called on paused sessions
    if session.status != SessionStatus.PAUSED.value:
        raise ValueError(f"Cannot resume session from {session.status} status. Session must be paused.")

    session.status = SessionStatus.ACTIVE.value

    await db.commit()
    await db.refresh(session)
    return session


async def change_current_slide(
    db: AsyncSession,
    session: Session,
    slide_id: UUID,
) -> Session:
    """
    Change the current slide of a session.

    Validates that the slide belongs to the session's presentation.
    """
    # Verify slide belongs to the presentation
    slide = await db.execute(
        select(Slide).where(
            Slide.id == slide_id,
            Slide.presentation_id == session.presentation_id,
        )
    )
    slide = slide.scalar_one_or_none()

    if not slide:
        raise ValueError("Slide not found or does not belong to this presentation")

    session.current_slide_id = slide_id

    await db.commit()
    await db.refresh(session)
    return session


async def get_session_statistics(
    db: AsyncSession,
    session: Session,
) -> dict:
    """
    Get statistics for a session.

    Returns:
    - participant_count: Number of participants who joined
    - total_responses: Total responses submitted
    - responses_per_slide: Dict mapping slide_id to response count
    - duration_seconds: Session duration (if started)
    """
    # Count participants
    participant_count = await db.execute(
        select(func.count(Participant.id)).where(Participant.session_id == session.id)
    )
    participant_count = participant_count.scalar_one()

    # Count total responses
    total_responses = await db.execute(
        select(func.count(Response.id)).where(Response.session_id == session.id)
    )
    total_responses = total_responses.scalar_one()

    # Responses per slide
    responses_per_slide_result = await db.execute(
        select(Response.slide_id, func.count(Response.id))
        .where(Response.session_id == session.id)
        .group_by(Response.slide_id)
    )
    responses_per_slide = {
        str(slide_id): count
        for slide_id, count in responses_per_slide_result.all()
    }

    # Calculate duration
    duration_seconds = None
    if session.started_at:
        end_time = session.ended_at or datetime.now(timezone.utc)
        duration_seconds = int((end_time - session.started_at).total_seconds())

    return {
        "session_id": session.id,
        "participant_count": participant_count,
        "total_responses": total_responses,
        "responses_per_slide": responses_per_slide,
        "duration_seconds": duration_seconds,
        "status": session.status,
    }


async def cleanup_expired_sessions(
    db: AsyncSession,
    max_age_hours: int = 24,
) -> int:
    """
    End sessions that have been pending or active for too long.

    Returns the number of sessions ended.
    """
    from datetime import timedelta

    cutoff = datetime.now(timezone.utc) - timedelta(hours=max_age_hours)

    # Find expired sessions
    result = await db.execute(
        select(Session).where(
            Session.status.in_([SessionStatus.PENDING.value, SessionStatus.ACTIVE.value, SessionStatus.PAUSED.value]),
            Session.created_at < cutoff,
        )
    )
    sessions = result.scalars().all()

    count = 0
    for session in sessions:
        session.status = SessionStatus.ENDED.value
        session.ended_at = datetime.now(timezone.utc)
        count += 1

    await db.commit()
    return count


def get_participant_count(session: Session) -> int:
    """Get the number of participants in a session."""
    return len(session.participants) if session.participants else 0


def get_response_count(session: Session) -> int:
    """Get the number of responses in a session."""
    return len(session.responses) if session.responses else 0
