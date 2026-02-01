"""
WebSocket Message Schemas

Pydantic models for WebSocket message validation.
All messages have a 'type' field to identify the message kind.

Message Types (Server -> Client):
- session_state: Full session state on connect
- slide_changed: Current slide changed
- participant_joined: New participant joined
- participant_left: Participant disconnected
- participant_count: Updated participant count
- session_started: Session status changed to active
- session_paused: Session status changed to paused
- session_resumed: Session status changed to active (from paused)
- session_ended: Session status changed to ended
- response_received: New response submitted (to speaker)
- vote_update: Aggregated vote counts for multiple choice
- question_asked: Audience member asked a question (to speaker)
- ai_response: AI response to a question
- error: Error message

Message Types (Client -> Server):
- join: Join session as audience
- join_speaker: Join session as speaker
- submit_response: Submit response to current slide
- ask_question: Ask a question about the presentation
- ping: Keep-alive ping
"""

from datetime import datetime
from enum import Enum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field


class WSMessageType(str, Enum):
    """WebSocket message types."""

    # Server -> Client
    SESSION_STATE = "session_state"
    SLIDE_CHANGED = "slide_changed"
    PARTICIPANT_JOINED = "participant_joined"
    PARTICIPANT_LEFT = "participant_left"
    PARTICIPANT_COUNT = "participant_count"
    SESSION_STARTED = "session_started"
    SESSION_PAUSED = "session_paused"
    SESSION_RESUMED = "session_resumed"
    SESSION_ENDED = "session_ended"
    RESPONSE_RECEIVED = "response_received"
    VOTE_UPDATE = "vote_update"
    QUESTION_ASKED = "question_asked"
    AI_RESPONSE = "ai_response"
    ERROR = "error"
    PONG = "pong"

    # Client -> Server
    JOIN = "join"
    JOIN_SPEAKER = "join_speaker"
    SUBMIT_RESPONSE = "submit_response"
    ASK_QUESTION = "ask_question"
    PING = "ping"


# =============================================================================
# Base Message
# =============================================================================


class WSMessage(BaseModel):
    """Base WebSocket message."""

    type: WSMessageType


# =============================================================================
# Server -> Client Messages
# =============================================================================


class SlideInfo(BaseModel):
    """Slide information for WebSocket messages."""

    id: str
    order_index: int
    type: str
    content: dict[str, Any]


class SessionStateMessage(WSMessage):
    """Full session state sent on connect."""

    type: WSMessageType = WSMessageType.SESSION_STATE
    session_id: str
    join_code: str
    status: str
    presentation_title: str
    current_slide: SlideInfo | None = None
    total_slides: int
    participant_count: int


class SlideChangedMessage(WSMessage):
    """Sent when speaker changes current slide."""

    type: WSMessageType = WSMessageType.SLIDE_CHANGED
    slide: SlideInfo
    slide_index: int  # 0-based index


class ParticipantJoinedMessage(WSMessage):
    """Sent when a new participant joins."""

    type: WSMessageType = WSMessageType.PARTICIPANT_JOINED
    participant_id: str
    display_name: str | None = None
    is_anonymous: bool = True
    participant_count: int


class ParticipantLeftMessage(WSMessage):
    """Sent when a participant disconnects."""

    type: WSMessageType = WSMessageType.PARTICIPANT_LEFT
    participant_id: str
    participant_count: int


class ParticipantCountMessage(WSMessage):
    """Sent to update participant count."""

    type: WSMessageType = WSMessageType.PARTICIPANT_COUNT
    participant_count: int


class SessionStartedMessage(WSMessage):
    """Sent when session starts."""

    type: WSMessageType = WSMessageType.SESSION_STARTED
    started_at: str
    current_slide: SlideInfo | None = None


class SessionPausedMessage(WSMessage):
    """Sent when session is paused."""

    type: WSMessageType = WSMessageType.SESSION_PAUSED


class SessionResumedMessage(WSMessage):
    """Sent when session is resumed."""

    type: WSMessageType = WSMessageType.SESSION_RESUMED


class SessionEndedMessage(WSMessage):
    """Sent when session ends."""

    type: WSMessageType = WSMessageType.SESSION_ENDED
    ended_at: str


class ResponseReceivedMessage(WSMessage):
    """Sent to speaker when response is submitted."""

    type: WSMessageType = WSMessageType.RESPONSE_RECEIVED
    response_id: str
    slide_id: str
    participant_id: str | None = None
    display_name: str | None = None
    content: dict[str, Any]
    created_at: str


class VoteUpdateMessage(WSMessage):
    """Sent when vote counts update for a multiple choice question."""

    type: WSMessageType = WSMessageType.VOTE_UPDATE
    slide_id: str
    votes: dict[str, int]  # option_id -> count
    total_votes: int


class QuestionAskedMessage(WSMessage):
    """Sent to speaker when audience member asks a question."""

    type: WSMessageType = WSMessageType.QUESTION_ASKED
    question_id: str
    slide_id: str
    participant_id: str | None = None
    display_name: str | None = None
    question_text: str
    created_at: str


class AIResponseMessage(WSMessage):
    """Sent when AI responds to a question."""

    type: WSMessageType = WSMessageType.AI_RESPONSE
    question_id: str
    slide_id: str
    question_text: str
    response_text: str
    is_streaming: bool = False
    is_complete: bool = True


class ErrorMessage(WSMessage):
    """Error message."""

    type: WSMessageType = WSMessageType.ERROR
    code: str
    message: str


class PongMessage(WSMessage):
    """Pong response to ping."""

    type: WSMessageType = WSMessageType.PONG
    timestamp: str


# =============================================================================
# Client -> Server Messages
# =============================================================================


class JoinMessage(WSMessage):
    """Audience member joining session."""

    type: WSMessageType = WSMessageType.JOIN
    display_name: str | None = None


class JoinSpeakerMessage(WSMessage):
    """Speaker joining session."""

    type: WSMessageType = WSMessageType.JOIN_SPEAKER
    token: str  # JWT token for authentication


class SubmitResponseMessage(WSMessage):
    """Submit response to current slide."""

    type: WSMessageType = WSMessageType.SUBMIT_RESPONSE
    slide_id: str
    content: dict[str, Any]


class AskQuestionMessage(WSMessage):
    """Ask a question about the presentation content."""

    type: WSMessageType = WSMessageType.ASK_QUESTION
    slide_id: str
    question_text: str


class PingMessage(WSMessage):
    """Keep-alive ping."""

    type: WSMessageType = WSMessageType.PING


# =============================================================================
# Helper Functions
# =============================================================================


def create_error_message(code: str, message: str) -> dict:
    """Create an error message dict."""
    return ErrorMessage(code=code, message=message).model_dump()


def create_slide_info(slide) -> SlideInfo:
    """Create SlideInfo from Slide model."""
    return SlideInfo(
        id=str(slide.id),
        order_index=slide.order_index,
        type=slide.type,
        content=slide.content or {},
    )


def create_session_state_message(
    session,
    participant_count: int,
) -> dict:
    """Create session state message from Session model."""
    current_slide = None
    if session.current_slide:
        current_slide = create_slide_info(session.current_slide)

    total_slides = (
        len(session.presentation.slides) if session.presentation.slides else 0
    )

    return SessionStateMessage(
        session_id=str(session.id),
        join_code=session.join_code,
        status=session.status,
        presentation_title=session.presentation.title,
        current_slide=current_slide,
        total_slides=total_slides,
        participant_count=participant_count,
    ).model_dump()
