"""
Upload Service

Handles file uploads including:
- Image validation and processing
- File storage (local filesystem for MVP)
- File serving
"""

import os
import uuid
from pathlib import Path
from typing import BinaryIO

from PIL import Image
from fastapi import UploadFile

from app.core.config import get_settings

settings = get_settings()

# Allowed image types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

# Image size limits
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_IMAGE_DIMENSION = 4096  # Max width or height

# Upload directory
UPLOAD_DIR = Path("uploads/images")


def ensure_upload_dir() -> Path:
    """Ensure upload directory exists and return path."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    return UPLOAD_DIR


def validate_image_type(content_type: str | None, filename: str | None) -> bool:
    """
    Validate that the file is an allowed image type.

    Args:
        content_type: MIME type of the file
        filename: Original filename

    Returns:
        True if valid image type
    """
    if content_type and content_type.lower() in ALLOWED_IMAGE_TYPES:
        return True

    if filename:
        ext = Path(filename).suffix.lower()
        if ext in ALLOWED_EXTENSIONS:
            return True

    return False


def generate_filename(original_filename: str | None) -> str:
    """
    Generate a unique filename for storage.

    Args:
        original_filename: Original filename to extract extension

    Returns:
        Unique filename with extension
    """
    ext = ".jpg"  # Default
    if original_filename:
        ext = Path(original_filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            ext = ".jpg"

    unique_id = uuid.uuid4().hex[:16]
    return f"{unique_id}{ext}"


async def process_and_save_image(
    file: UploadFile,
    max_size: int = MAX_IMAGE_SIZE,
    max_dimension: int = MAX_IMAGE_DIMENSION,
) -> tuple[str, dict]:
    """
    Process and save an uploaded image.

    Processing includes:
    - Validating file type
    - Checking file size
    - Resizing if too large
    - Optimizing for web

    Args:
        file: Uploaded file object
        max_size: Maximum file size in bytes
        max_dimension: Maximum width/height in pixels

    Returns:
        Tuple of (filename, metadata dict)

    Raises:
        ValueError: If file is invalid
    """
    # Validate content type
    if not validate_image_type(file.content_type, file.filename):
        raise ValueError(
            f"Invalid file type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
        )

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > max_size:
        raise ValueError(f"File too large. Maximum size: {max_size // (1024 * 1024)} MB")

    # Process image with PIL
    try:
        from io import BytesIO
        img = Image.open(BytesIO(content))

        # Convert RGBA to RGB if needed (for JPEG)
        if img.mode in ("RGBA", "P") and file.filename and file.filename.lower().endswith((".jpg", ".jpeg")):
            img = img.convert("RGB")

        # Get original dimensions
        original_width, original_height = img.size

        # Resize if too large
        if original_width > max_dimension or original_height > max_dimension:
            ratio = min(max_dimension / original_width, max_dimension / original_height)
            new_width = int(original_width * ratio)
            new_height = int(original_height * ratio)
            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

        # Generate unique filename
        filename = generate_filename(file.filename)

        # Ensure upload directory exists
        upload_dir = ensure_upload_dir()
        filepath = upload_dir / filename

        # Save optimized image
        save_kwargs = {"optimize": True}
        if filename.lower().endswith((".jpg", ".jpeg")):
            save_kwargs["quality"] = 85
        elif filename.lower().endswith(".png"):
            save_kwargs["compress_level"] = 6

        img.save(filepath, **save_kwargs)

        # Get final file size
        final_size = filepath.stat().st_size
        final_width, final_height = img.size

        metadata = {
            "original_filename": file.filename,
            "content_type": file.content_type,
            "original_size": len(content),
            "final_size": final_size,
            "width": final_width,
            "height": final_height,
        }

        return filename, metadata

    except Exception as e:
        raise ValueError(f"Failed to process image: {str(e)}")


def get_image_path(filename: str) -> Path | None:
    """
    Get the full path to a stored image.

    Args:
        filename: Stored filename

    Returns:
        Path to file or None if not found
    """
    filepath = UPLOAD_DIR / filename
    if filepath.exists() and filepath.is_file():
        return filepath
    return None


def delete_image(filename: str) -> bool:
    """
    Delete a stored image.

    Args:
        filename: Stored filename

    Returns:
        True if deleted, False if not found
    """
    filepath = UPLOAD_DIR / filename
    if filepath.exists() and filepath.is_file():
        filepath.unlink()
        return True
    return False


def get_image_url(filename: str) -> str:
    """
    Get the URL for accessing an uploaded image.

    Args:
        filename: Stored filename

    Returns:
        URL path for the image
    """
    return f"/api/uploads/images/{filename}"
