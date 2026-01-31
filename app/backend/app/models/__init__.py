"""
SQLAlchemy models for Oratify.

This module exports all models for easy importing:
    from app.models import Speaker, Presentation, Slide, Session, Participant, Response

All models inherit from Base which provides the declarative base class.
Most models also use TimestampMixin for created_at/updated_at columns.
"""

from app.models.base import Base, TimestampMixin, UUIDMixin
from app.models.speaker import Speaker
from app.models.presentation import Presentation
from app.models.slide import Slide
from app.models.session import Session
from app.models.participant import Participant
from app.models.response import Response

__all__ = [
    "Base",
    "TimestampMixin",
    "UUIDMixin",
    "Speaker",
    "Presentation",
    "Slide",
    "Session",
    "Participant",
    "Response",
]
