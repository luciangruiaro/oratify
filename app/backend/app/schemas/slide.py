"""
Slide Pydantic Schemas

Request/response schemas for slide CRUD operations.
Includes type-specific content schemas for all 5 slide types:
- content: Image + text content slide
- question_text: Free-text question for audience
- question_choice: Multiple choice question
- summary: AI-generated summary slide
- conclusion: AI-generated or manual conclusions
"""

from datetime import datetime
from enum import Enum
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict, field_validator


class SlideType(str, Enum):
    """Valid slide types."""
    CONTENT = "content"
    QUESTION_TEXT = "question_text"
    QUESTION_CHOICE = "question_choice"
    SUMMARY = "summary"
    CONCLUSION = "conclusion"


class LayoutType(str, Enum):
    """Layout options for content slides."""
    IMAGE_LEFT = "image-left"
    IMAGE_RIGHT = "image-right"
    IMAGE_TOP = "image-top"
    TEXT_ONLY = "text-only"


# ============================================================================
# Content Schemas for each slide type
# ============================================================================

class ContentSlideContent(BaseModel):
    """Content for a content slide (image + text)."""
    image_url: str | None = None
    text: str = Field(default="", max_length=10000)
    layout: LayoutType = LayoutType.TEXT_ONLY


class QuestionTextContent(BaseModel):
    """Content for a free-text question slide."""
    question: str = Field(..., min_length=1, max_length=500)
    placeholder: str | None = Field(default=None, max_length=200)
    max_length: int | None = Field(default=500, ge=1, le=5000)
    required: bool = False


class ChoiceOption(BaseModel):
    """A single choice option for multiple choice questions."""
    id: str
    text: str = Field(..., min_length=1, max_length=200)
    order: int = Field(..., ge=0)


class QuestionChoiceContent(BaseModel):
    """Content for a multiple choice question slide."""
    question: str = Field(..., min_length=1, max_length=500)
    options: list[ChoiceOption] = Field(..., min_length=2, max_length=10)
    allow_multiple: bool = False
    show_results: bool = True

    @field_validator('options')
    @classmethod
    def validate_unique_option_ids(cls, v: list[ChoiceOption]) -> list[ChoiceOption]:
        ids = [opt.id for opt in v]
        if len(ids) != len(set(ids)):
            raise ValueError('Option IDs must be unique')
        return v


class SummaryContent(BaseModel):
    """Content for a summary slide."""
    title: str = Field(default="Summary", max_length=200)
    summary_text: str | None = Field(default=None, max_length=10000)
    auto_generate: bool = True
    include_slides: list[str] | Literal["all"] = "all"


class ConclusionContent(BaseModel):
    """Content for a conclusion slide."""
    title: str = Field(default="Key Takeaways", max_length=200)
    conclusions: list[str] = Field(default_factory=list, max_length=10)
    auto_generate: bool = False
    thank_you_message: str | None = Field(default=None, max_length=500)

    @field_validator('conclusions')
    @classmethod
    def validate_conclusions(cls, v: list[str]) -> list[str]:
        return [c[:500] for c in v]  # Truncate each conclusion to 500 chars


# Union type for all content types
SlideContent = ContentSlideContent | QuestionTextContent | QuestionChoiceContent | SummaryContent | ConclusionContent


# ============================================================================
# Slide Request/Response Schemas
# ============================================================================

class SlideBase(BaseModel):
    """Base slide fields."""
    slide_type: SlideType = Field(..., alias="type")
    content: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(populate_by_name=True)


class SlideCreate(SlideBase):
    """Schema for creating a new slide."""
    order_index: int | None = Field(default=None, ge=0)


class SlideUpdate(BaseModel):
    """Schema for updating a slide. All fields optional."""
    slide_type: SlideType | None = Field(default=None, alias="type")
    content: dict[str, Any] | None = None
    order_index: int | None = Field(default=None, ge=0)

    model_config = ConfigDict(populate_by_name=True)


class SlideResponse(BaseModel):
    """Schema for slide response."""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    presentation_id: UUID
    order_index: int
    slide_type: SlideType = Field(..., alias="type")
    content: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class SlideListResponse(BaseModel):
    """Schema for list of slides."""
    items: list[SlideResponse]
    total: int


class SlideReorderRequest(BaseModel):
    """Schema for reordering slides."""
    slide_ids: list[UUID] = Field(..., min_length=1)


class SlideReorderResponse(BaseModel):
    """Schema for reorder response."""
    reordered: int
    slides: list[SlideResponse]


# ============================================================================
# Content Validation Functions
# ============================================================================

def validate_slide_content(slide_type: SlideType, content: dict[str, Any]) -> dict[str, Any]:
    """
    Validate and normalize slide content based on type.

    Args:
        slide_type: The type of slide
        content: The content dictionary to validate

    Returns:
        Validated and normalized content dictionary

    Raises:
        ValueError: If content is invalid for the slide type
    """
    try:
        if slide_type == SlideType.CONTENT:
            validated = ContentSlideContent(**content)
        elif slide_type == SlideType.QUESTION_TEXT:
            validated = QuestionTextContent(**content)
        elif slide_type == SlideType.QUESTION_CHOICE:
            validated = QuestionChoiceContent(**content)
        elif slide_type == SlideType.SUMMARY:
            validated = SummaryContent(**content)
        elif slide_type == SlideType.CONCLUSION:
            validated = ConclusionContent(**content)
        else:
            raise ValueError(f"Unknown slide type: {slide_type}")

        return validated.model_dump()
    except Exception as e:
        raise ValueError(f"Invalid content for {slide_type}: {str(e)}")


def get_default_content(slide_type: SlideType) -> dict[str, Any]:
    """
    Get default content for a slide type.

    Args:
        slide_type: The type of slide

    Returns:
        Default content dictionary for the slide type
    """
    defaults = {
        SlideType.CONTENT: ContentSlideContent(),
        SlideType.QUESTION_TEXT: QuestionTextContent(question="Enter your question here"),
        SlideType.QUESTION_CHOICE: QuestionChoiceContent(
            question="Enter your question here",
            options=[
                ChoiceOption(id="opt1", text="Option 1", order=0),
                ChoiceOption(id="opt2", text="Option 2", order=1),
            ]
        ),
        SlideType.SUMMARY: SummaryContent(),
        SlideType.CONCLUSION: ConclusionContent(),
    }
    return defaults[slide_type].model_dump()
