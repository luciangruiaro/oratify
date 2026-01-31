"""
Session model representing a live presentation session.

Sessions are created when a speaker starts presenting and allow:
- Audience members to join via code or URL
- Real-time slide navigation
- Response collection

Status flow: pending -> active -> paused -> ended
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.presentation import Presentation
    from app.models.slide import Slide
    from app.models.participant import Participant
    from app.models.response import Response


class Session(Base):
    """
    Session model - a live presentation session that audiences can join.

    Attributes:
        id: UUID primary key
        presentation_id: Foreign key to presentation being presented
        join_code: 6-character alphanumeric code for joining (e.g., "ABC123")
        current_slide_id: Foreign key to currently displayed slide
        status: Session status (pending, active, paused, ended)
        started_at: When session was started (null if pending)
        ended_at: When session was ended (null if active)
        created_at: When session was created

    Relationships:
        presentation: The presentation being presented
        current_slide: Currently active slide (nullable)
        participants: List of audience members who joined
        responses: All responses submitted during this session
    """

    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    presentation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("presentations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    join_code: Mapped[str] = mapped_column(
        String(6),
        unique=True,
        nullable=False,
        index=True,
    )

    current_slide_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("slides.id", ondelete="SET NULL"),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",
    )

    started_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    ended_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )

    # Relationships
    presentation: Mapped["Presentation"] = relationship(
        "Presentation",
        back_populates="sessions",
    )

    current_slide: Mapped[Optional["Slide"]] = relationship(
        "Slide",
        foreign_keys=[current_slide_id],
        lazy="joined",
    )

    participants: Mapped[List["Participant"]] = relationship(
        "Participant",
        back_populates="session",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    responses: Mapped[List["Response"]] = relationship(
        "Response",
        back_populates="session",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Session(id={self.id}, code={self.join_code}, status={self.status})>"
