"""
WebSocket Event Broadcasting Service

Provides functions to broadcast WebSocket events from REST API endpoints.
Used when session state changes (start, end, pause, slide change) to notify
all connected clients.

Usage:
    from app.services.websocket_events import broadcast_slide_change

    await broadcast_slide_change(session, new_slide)
"""

import logging
from typing import Any

from app.core.websocket import connection_manager
from app.models import Session, Slide
from app.schemas.websocket import (
    create_slide_info,
    AIResponseMessage,
    ParticipantCountMessage,
    QuestionAskedMessage,
    SessionEndedMessage,
    SessionPausedMessage,
    SessionResumedMessage,
    SessionStartedMessage,
    SlideChangedMessage,
    VoteUpdateMessage,
)

logger = logging.getLogger(__name__)


async def broadcast_slide_change(session: Session, slide: Slide):
    """
    Broadcast slide change to all connected clients.

    Called when speaker changes the current slide.
    """
    join_code = session.join_code

    slide_info = create_slide_info(slide)
    message = SlideChangedMessage(
        slide=slide_info,
        slide_index=slide.order_index,
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast slide_changed to session {join_code}")


async def broadcast_session_started(session: Session):
    """
    Broadcast session started to all connected clients.

    Called when speaker starts the session.
    """
    join_code = session.join_code

    current_slide = None
    if session.current_slide:
        current_slide = create_slide_info(session.current_slide)

    message = SessionStartedMessage(
        started_at=session.started_at.isoformat() if session.started_at else "",
        current_slide=current_slide,
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast session_started to session {join_code}")


async def broadcast_session_paused(session: Session):
    """
    Broadcast session paused to all connected clients.

    Called when speaker pauses the session.
    """
    join_code = session.join_code
    message = SessionPausedMessage().model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast session_paused to session {join_code}")


async def broadcast_session_resumed(session: Session):
    """
    Broadcast session resumed to all connected clients.

    Called when speaker resumes a paused session.
    """
    join_code = session.join_code
    message = SessionResumedMessage().model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast session_resumed to session {join_code}")


async def broadcast_session_ended(session: Session):
    """
    Broadcast session ended to all connected clients.

    Called when speaker ends the session.
    Also closes all WebSocket connections for this session.
    """
    join_code = session.join_code

    message = SessionEndedMessage(
        ended_at=session.ended_at.isoformat() if session.ended_at else "",
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast session_ended to session {join_code}")

    # Close all connections
    connection_manager.close_session(join_code)


async def broadcast_participant_count(session: Session, count: int):
    """
    Broadcast updated participant count to all connected clients.

    Called when participant count changes.
    """
    join_code = session.join_code

    message = ParticipantCountMessage(
        participant_count=count,
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)


async def broadcast_vote_update(
    session: Session,
    slide_id: str,
    votes: dict[str, int],
    total_votes: int,
):
    """
    Broadcast aggregated vote counts for a multiple choice question.

    Called when a new vote is submitted for a multiple choice slide.
    Sends updated vote counts to all connected clients.

    Args:
        session: The session
        slide_id: The slide ID
        votes: Dictionary mapping option_id to vote count
        total_votes: Total number of votes
    """
    join_code = session.join_code

    message = VoteUpdateMessage(
        slide_id=slide_id,
        votes=votes,
        total_votes=total_votes,
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(f"Broadcast vote_update to session {join_code}: {total_votes} votes")


async def broadcast_question_asked(
    session: Session,
    question_id: str,
    slide_id: str,
    question_text: str,
    participant_id: str | None = None,
    display_name: str | None = None,
    created_at: str = "",
):
    """
    Broadcast question asked event to the speaker.

    Called when an audience member asks a question.
    Only sent to the speaker connection.

    Args:
        session: The session
        question_id: Unique ID for the question
        slide_id: The slide the question is about
        question_text: The question text
        participant_id: Optional participant ID
        display_name: Optional display name
        created_at: ISO timestamp when question was created
    """
    join_code = session.join_code

    message = QuestionAskedMessage(
        question_id=question_id,
        slide_id=slide_id,
        participant_id=participant_id,
        display_name=display_name,
        question_text=question_text,
        created_at=created_at,
    ).model_dump()

    await connection_manager.broadcast_to_speaker(join_code, message)
    logger.info(f"Broadcast question_asked to speaker in session {join_code}")


async def broadcast_ai_response(
    session: Session,
    question_id: str,
    slide_id: str,
    question_text: str,
    response_text: str,
    is_streaming: bool = False,
    is_complete: bool = True,
):
    """
    Broadcast AI response to all connected clients.

    Called when AI responds to a question.
    For streaming responses, this can be called multiple times with partial content.

    Args:
        session: The session
        question_id: The question ID being answered
        slide_id: The slide the question is about
        question_text: The original question
        response_text: The AI response (or partial response if streaming)
        is_streaming: True if this is a streaming response
        is_complete: True if the response is complete
    """
    join_code = session.join_code

    message = AIResponseMessage(
        question_id=question_id,
        slide_id=slide_id,
        question_text=question_text,
        response_text=response_text,
        is_streaming=is_streaming,
        is_complete=is_complete,
    ).model_dump()

    await connection_manager.broadcast_to_session(join_code, message)
    logger.info(
        f"Broadcast ai_response to session {join_code} "
        f"(streaming={is_streaming}, complete={is_complete})"
    )
