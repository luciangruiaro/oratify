"""
Response model storing audience answers and AI-generated responses.

Responses can be:
- Answers to question slides (text or choice)
- Questions asked by audience members
- AI-generated answers based on speaker notes

Content is stored as JSONB for flexibility.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.session import Session
    from app.models.slide import Slide
    from app.models.participant import Participant


class Response(Base):
    """
    Response model - audience responses and AI answers.

    Attributes:
        id: UUID primary key
        session_id: Foreign key to session
        slide_id: Foreign key to slide this response is for
        participant_id: Foreign key to participant (null for AI responses)
        content: JSONB containing response data
        is_ai_response: Whether this is an AI-generated response
        created_at: When response was submitted

    Content schemas:
        Text answer: {
            "type": "text",
            "text": str
        }

        Choice answer: {
            "type": "choice",
            "selected_ids": [uuid, ...]
        }

        Question from audience: {
            "type": "question",
            "question": str
        }

        AI answer: {
            "type": "ai_answer",
            "question": str,
            "answer": str
        }

    Relationships:
        session: The session this response belongs to
        slide: The slide this response is for
        participant: The participant who submitted (null for AI)
    """

    __tablename__ = "responses"

    # Composite unique constraint to prevent duplicate responses
    __table_args__ = (
        Index(
            "ix_responses_session_slide_participant",
            "session_id",
            "slide_id",
            "participant_id",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    slide_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("slides.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    participant_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("participants.id", ondelete="SET NULL"),
        nullable=True,
    )

    content: Mapped[Dict[str, Any]] = mapped_column(
        JSONB,
        nullable=False,
        default=dict,
    )

    is_ai_response: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )

    # Relationships
    session: Mapped["Session"] = relationship(
        "Session",
        back_populates="responses",
    )

    slide: Mapped["Slide"] = relationship(
        "Slide",
        back_populates="responses",
    )

    participant: Mapped[Optional["Participant"]] = relationship(
        "Participant",
        back_populates="responses",
    )

    def __repr__(self) -> str:
        return f"<Response(id={self.id}, slide={self.slide_id}, ai={self.is_ai_response})>"
