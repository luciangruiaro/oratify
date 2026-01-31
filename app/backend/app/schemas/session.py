"""
Session Pydantic Schemas

Request/response schemas for session management operations.
"""

from datetime import datetime
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict


class SessionStatus(str, Enum):
    """Valid session statuses."""

    PENDING = "pending"
    ACTIVE = "active"
    PAUSED = "paused"
    ENDED = "ended"


class SessionCreate(BaseModel):
    """Schema for creating a new session."""

    presentation_id: UUID = Field(..., description="ID of the presentation to create session for")


class SessionUpdate(BaseModel):
    """Schema for updating session. Used internally for status changes."""

    current_slide_id: UUID | None = None


class CurrentSlideUpdate(BaseModel):
    """Schema for changing the current slide."""

    slide_id: UUID = Field(..., description="ID of the slide to navigate to")


class SessionResponse(BaseModel):
    """Schema for session response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    presentation_id: UUID
    join_code: str
    current_slide_id: UUID | None
    status: SessionStatus
    started_at: datetime | None
    ended_at: datetime | None
    created_at: datetime
    participant_count: int = 0
    response_count: int = 0


class SessionDetailResponse(SessionResponse):
    """Schema for detailed session response with presentation info."""

    presentation_title: str
    presentation_slug: str
    total_slides: int = 0


class SessionListResponse(BaseModel):
    """Schema for paginated session list."""

    items: list[SessionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SessionStatistics(BaseModel):
    """Schema for session statistics."""

    session_id: UUID
    participant_count: int
    total_responses: int
    responses_per_slide: dict[str, int]  # slide_id -> count
    duration_seconds: int | None = None  # None if not started or still active
    status: SessionStatus


class SessionJoinInfo(BaseModel):
    """Schema for session join information (public, no auth required)."""

    join_code: str
    presentation_title: str
    status: SessionStatus
    current_slide_order: int | None = None  # 0-indexed order of current slide
