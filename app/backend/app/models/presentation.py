"""
Presentation model representing a speaker's presentation/talk.

Presentations contain:
- Metadata (title, description, slug)
- Speaker notes for AI context
- Ordered collection of slides
- Can have multiple live sessions

Status flow: draft -> active -> ended
"""

import uuid
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.speaker import Speaker
    from app.models.slide import Slide
    from app.models.session import Session


class Presentation(TimestampMixin, Base):
    """
    Presentation model - a collection of slides for a talk.

    Attributes:
        id: UUID primary key
        speaker_id: Foreign key to speaker who owns this presentation
        title: Presentation title (max 255 chars)
        description: Optional longer description
        slug: URL-friendly unique identifier for join URLs
        speaker_notes: Long text field for AI context (used by LLM)
        status: Current status (draft, active, ended)
        created_at: Timestamp of creation
        updated_at: Timestamp of last update

    Relationships:
        speaker: The speaker who created this presentation
        slides: Ordered list of slides in this presentation
        sessions: List of live sessions for this presentation
    """

    __tablename__ = "presentations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    speaker_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("speakers.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    speaker_notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="draft",
    )

    # Relationships
    speaker: Mapped["Speaker"] = relationship(
        "Speaker",
        back_populates="presentations",
    )

    slides: Mapped[List["Slide"]] = relationship(
        "Slide",
        back_populates="presentation",
        cascade="all, delete-orphan",
        order_by="Slide.order_index",
        lazy="selectin",
    )

    sessions: Mapped[List["Session"]] = relationship(
        "Session",
        back_populates="presentation",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Presentation(id={self.id}, title={self.title}, status={self.status})>"
