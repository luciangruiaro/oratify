"""
Slide model representing a single slide in a presentation.

Slide types:
- content: Image + text content slide
- question_text: Free-text question for audience
- question_choice: Multiple choice question
- summary: AI-generated summary slide
- conclusion: AI-generated or manual conclusions

Content is stored as JSONB with type-specific schemas.
"""

import uuid
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.presentation import Presentation
    from app.models.response import Response


class Slide(TimestampMixin, Base):
    """
    Slide model - individual slide within a presentation.

    Attributes:
        id: UUID primary key
        presentation_id: Foreign key to parent presentation
        order_index: Position in presentation (0-based)
        type: Slide type (content, question_text, question_choice, summary, conclusion)
        content: JSONB storing type-specific content

    Content schemas by type:
        content: {
            "image_url": str | null,
            "text": str (markdown),
            "layout": "image-left" | "image-right" | "image-top" | "text-only"
        }

        question_text: {
            "question": str,
            "placeholder": str | null,
            "max_length": int | null,
            "required": bool
        }

        question_choice: {
            "question": str,
            "options": [{"id": uuid, "text": str, "order": int}, ...],
            "allow_multiple": bool,
            "show_results": bool
        }

        summary: {
            "title": str,
            "summary_text": str | null,
            "auto_generate": bool,
            "include_slides": [uuid] | "all"
        }

        conclusion: {
            "title": str,
            "conclusions": [str, ...],
            "auto_generate": bool,
            "thank_you_message": str | null
        }

    Relationships:
        presentation: Parent presentation
        responses: Audience responses to this slide
    """

    __tablename__ = "slides"

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

    order_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    content: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=True,
        default=dict,
    )

    # Relationships
    presentation: Mapped["Presentation"] = relationship(
        "Presentation",
        back_populates="slides",
    )

    responses: Mapped[List["Response"]] = relationship(
        "Response",
        back_populates="slide",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Slide(id={self.id}, type={self.type}, order={self.order_index})>"
