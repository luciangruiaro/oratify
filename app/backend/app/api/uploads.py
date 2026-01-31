"""
Upload API Endpoints

Handles file uploads and serving:
- Image upload for slide content
- Image serving
"""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.api.deps import get_current_speaker
from app.models import Speaker
from app.services import upload as upload_service

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

CurrentSpeaker = Annotated[Speaker, Depends(get_current_speaker)]


class ImageUploadResponse(BaseModel):
    """Response schema for image upload."""
    filename: str
    url: str
    width: int
    height: int
    size: int
    content_type: str | None


@router.post("/images", response_model=ImageUploadResponse)
async def upload_image(
    speaker: CurrentSpeaker,
    file: UploadFile = File(...),
):
    """
    Upload an image for use in slides.

    Accepts JPEG, PNG, GIF, and WebP images up to 10MB.
    Images larger than 4096x4096 will be automatically resized.

    Returns the URL to access the uploaded image.
    """
    try:
        filename, metadata = await upload_service.process_and_save_image(file)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return ImageUploadResponse(
        filename=filename,
        url=upload_service.get_image_url(filename),
        width=metadata["width"],
        height=metadata["height"],
        size=metadata["final_size"],
        content_type=metadata["content_type"],
    )


@router.get("/images/{filename}")
async def get_image(filename: str):
    """
    Serve an uploaded image.

    This endpoint is public to allow embedding images in presentations.
    """
    # Validate filename (prevent path traversal)
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename",
        )

    filepath = upload_service.get_image_path(filename)

    if not filepath:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    # Determine media type
    media_type = "image/jpeg"
    suffix = filepath.suffix.lower()
    if suffix == ".png":
        media_type = "image/png"
    elif suffix == ".gif":
        media_type = "image/gif"
    elif suffix == ".webp":
        media_type = "image/webp"

    return FileResponse(
        filepath,
        media_type=media_type,
        headers={
            "Cache-Control": "public, max-age=31536000",  # 1 year cache
        },
    )


@router.delete("/images/{filename}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    speaker: CurrentSpeaker,
    filename: str,
):
    """
    Delete an uploaded image.

    Note: This does not check if the image is still in use by slides.
    """
    # Validate filename
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid filename",
        )

    deleted = upload_service.delete_image(filename)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )
