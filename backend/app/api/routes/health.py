"""Liveness and readiness probes."""

from __future__ import annotations

import asyncio

from fastapi import APIRouter
from sqlalchemy import text

from app.config import get_settings
from app.db.session import engine

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


async def _check_db() -> bool:
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


async def _check_qdrant() -> bool:
    settings = get_settings()
    try:
        from qdrant_client import AsyncQdrantClient

        client = AsyncQdrantClient(
            url=settings.qdrant_url, api_key=settings.qdrant_api_key or None
        )
        await client.get_collections()
        await client.close()
        return True
    except Exception:
        return False


async def _check_redis() -> bool:
    settings = get_settings()
    try:
        import redis.asyncio as redis

        client = redis.from_url(settings.redis_url)
        await client.ping()
        await client.aclose()
        return True
    except Exception:
        return False


@router.get("/ready")
async def ready() -> dict[str, object]:
    db_ok, qdrant_ok, redis_ok = await asyncio.gather(
        _check_db(), _check_qdrant(), _check_redis()
    )
    deps = {"db": db_ok, "qdrant": qdrant_ok, "redis": redis_ok}
    return {"status": "ok" if all(deps.values()) else "degraded", "deps": deps}
