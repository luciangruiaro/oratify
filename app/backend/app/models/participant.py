"""
Participant model representing an audience member who joined a session.

Participants can:
- Join anonymously or with a display name
- Submit responses to questions
- Ask questions to the speaker
- Receive AI-powered answers

Connection tracking allows real-time participant counting.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.session import Session
    from app.models.response import Response


class Participant(Base):
    """
    Participant model - an audience member in a session.

    Attributes:
        id: UUID primary key
        session_id: Foreign key to session they joined
        display_name: Optional name shown to others (null = anonymous)
        connection_id: WebSocket connection identifier for real-time tracking
        is_anonymous: Whether participant chose to remain anonymous
        joined_at: When participant joined the session
        left_at: When participant left (null = still connected)

    Relationships:
        session: The session this participant joined
        responses: All responses submitted by this participant
    """

    __tablename__ = "participants"

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

    display_name: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    connection_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    is_anonymous: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )

    left_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships
    session: Mapped["Session"] = relationship(
        "Session",
        back_populates="participants",
    )

    responses: Mapped[List["Response"]] = relationship(
        "Response",
        back_populates="participant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        name = self.display_name or "Anonymous"
        return f"<Participant(id={self.id}, name={name})>"
