"""
Oratify API - Main Application Entry Point

This is the FastAPI application entry point. It configures:
- CORS middleware for frontend communication
- API routers for all endpoints
- Database lifecycle (startup/shutdown)
- OpenAPI documentation at /docs

To run in development:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

To run in production:
    gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import auth, presentations
from app.core.config import get_settings
from app.core.database import close_db, engine

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.

    Handles startup and shutdown events:
    - Startup: Verify database connection
    - Shutdown: Close database connections
    """
    # Startup
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("Database connection verified")
    except Exception as e:
        print(f"Database connection failed: {e}")

    yield

    # Shutdown
    await close_db()
    print("Database connections closed")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered platform for interactive presentations and augmented talks",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
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

    Checks:
    - Database connectivity by executing a simple query

    Returns:
        dict: Health status including database connectivity
    """
    db_status = "disconnected"

    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        pass

    status = "healthy" if db_status == "connected" else "unhealthy"

    return {
        "status": status,
        "database": db_status,
        "version": "0.1.0",
    }


# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(presentations.router)  # Prefix already set in router

# Future routers:
# app.include_router(slides.router)
# app.include_router(sessions.router)
# app.include_router(responses.router)
# app.include_router(admin.router)
