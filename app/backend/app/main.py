"""
Oratify API - Main Application Entry Point

This is the FastAPI application entry point. It configures:
- CORS middleware for frontend communication
- API routers for all endpoints
- OpenAPI documentation at /docs

To run in development:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

To run in production:
    gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings

settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered platform for interactive presentations and augmented talks",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint returning API information.

    Returns:
        dict: API name and version
    """
    return {
        "message": settings.app_name,
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for container orchestration and monitoring.

    Returns:
        dict: Health status including database connectivity

    Note:
        Database check will be implemented in Epic 2 after SQLAlchemy setup.
        For now, returns basic health status.
    """
    return {
        "status": "healthy",
        "database": "not_configured",  # Will be updated in Epic 2
        "version": "0.1.0",
    }


# API Routers will be included here after creation
# from app.api import auth, presentations, sessions
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(presentations.router, prefix="/api/presentations", tags=["Presentations"])
# app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
