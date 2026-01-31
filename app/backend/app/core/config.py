"""
Application configuration loaded from environment variables.

All settings are validated on startup using Pydantic Settings.
Missing required variables will cause the application to fail fast with clear error messages.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Required environment variables:
    - DATABASE_URL: PostgreSQL connection string
    - JWT_SECRET_KEY: Secret key for JWT token signing

    Optional with defaults:
    - DEBUG, BACKEND_PORT, etc.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Oratify API"
    debug: bool = False
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    # Database
    database_url: str = "postgresql+asyncpg://oratify:oratify@localhost:5432/oratify"

    # JWT Authentication
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    # LLM
    llm_provider: str = "openai"
    openai_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"


@lru_cache
def get_settings() -> Settings:
    """
    Get cached settings instance.

    Settings are loaded once and cached for performance.
    Use this function to access settings throughout the application.

    Returns:
        Settings: Application settings instance
    """
    return Settings()
