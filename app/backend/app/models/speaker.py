"""
Speaker model representing users who create and deliver presentations.

Speakers are the primary users of the platform who:
- Create and manage presentations
- Deliver live sessions
- Have subscription plans

Relationships:
- One speaker has many presentations
"""

import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import Boolean, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.presentation import Presentation


class Speaker(TimestampMixin, Base):
    """
    Speaker model - users who create and deliver presentations.

    Attributes:
        id: UUID primary key
        email: Unique email address (used for login)
        password_hash: Bcrypt hashed password
        name: Display name
        plan_type: Subscription plan (free, pro, enterprise)
        is_active: Whether account is active (False = deactivated)
        created_at: Timestamp of account creation
        updated_at: Timestamp of last update

    Relationships:
        presentations: List of presentations created by this speaker
    """

    __tablename__ = "speakers"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    plan_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="free",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Relationships
    presentations: Mapped[List["Presentation"]] = relationship(
        "Presentation",
        back_populates="speaker",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Speaker(id={self.id}, email={self.email}, name={self.name})>"
