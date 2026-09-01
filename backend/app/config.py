"""Application settings, loaded from the environment (see ``.env.example``)."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # App
    app_env: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173"])

    # Auth
    jwt_secret: str = "change-me"
    jwt_alg: str = "HS256"
    access_token_ttl_min: int = 30
    refresh_token_ttl_days: int = 14

    # Database
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/autoconcierge"
    )

    # LLM + embeddings (Google Gemini)
    google_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"
    embedding_provider: str = "google"  # google | fastembed
    embedding_model: str = "models/text-embedding-004"
    embedding_dim: int = 768
    fastembed_model: str = "BAAI/bge-small-en-v1.5"

    # Vector store (Qdrant)
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    qdrant_collection: str = "brochure_chunks"
    retrieval_top_k: int = 8

    # Ingestion queue
    redis_url: str = "redis://localhost:6379/0"

    # Storage
    upload_dir: str = "./data/uploads"
    max_upload_mb: int = 40

    @property
    def is_dev(self) -> bool:
        return self.app_env == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()
