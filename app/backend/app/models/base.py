"""
SQLAlchemy base model and common mixins.

This module provides:
- Base: Declarative base class for all models
- TimestampMixin: Adds created_at and updated_at columns
- UUIDMixin: Adds UUID primary key column

All models should inherit from Base and optionally include mixins:

    class Speaker(TimestampMixin, Base):
        __tablename__ = "speakers"
        id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
        ...
"""

import uuid
from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.

    Provides common configuration and can be extended with
    class-level attributes shared by all models.
    """

    pass


class TimestampMixin:
    """
    Mixin that adds created_at and updated_at timestamp columns.

    - created_at: Set automatically on insert
    - updated_at: Updated automatically on each update

    Usage:
        class MyModel(TimestampMixin, Base):
            __tablename__ = "my_table"
            ...
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class UUIDMixin:
    """
    Mixin that adds a UUID primary key column.

    Generates UUIDs automatically using Python's uuid4.

    Usage:
        class MyModel(UUIDMixin, TimestampMixin, Base):
            __tablename__ = "my_table"
            ...
    """

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
