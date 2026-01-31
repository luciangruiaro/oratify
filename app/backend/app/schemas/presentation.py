"""
Presentation Pydantic Schemas

Request/response schemas for presentation CRUD operations.
"""

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

from app.models.presentation import PresentationStatus


class PresentationBase(BaseModel):
    """Base presentation fields."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    speaker_notes: str | None = Field(default=None, max_length=50000)


class PresentationCreate(PresentationBase):
    """Schema for creating a new presentation."""

    pass


class PresentationUpdate(BaseModel):
    """Schema for updating a presentation. All fields optional."""

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    speaker_notes: str | None = Field(default=None, max_length=50000)
    status: PresentationStatus | None = None


class PresentationResponse(PresentationBase):
    """Schema for presentation response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    speaker_id: UUID
    slug: str
    status: PresentationStatus
    slide_count: int = 0
    created_at: datetime
    updated_at: datetime


class PresentationListResponse(BaseModel):
    """Schema for paginated presentation list."""

    items: list[PresentationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PresentationDuplicateRequest(BaseModel):
    """Schema for duplicating a presentation."""

    new_title: str | None = Field(default=None, min_length=1, max_length=200)


class SlideOrderUpdate(BaseModel):
    """Schema for updating slide order."""

    slide_ids: list[UUID] = Field(..., min_length=1)
