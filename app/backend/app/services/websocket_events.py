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
    ParticipantCountMessage,
    SessionEndedMessage,
    SessionPausedMessage,
    SessionResumedMessage,
    SessionStartedMessage,
    SlideChangedMessage,
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
