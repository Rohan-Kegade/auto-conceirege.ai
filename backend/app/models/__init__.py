"""SQLAlchemy ORM models (database tables).

Import every model module here so ``Base.metadata`` is fully populated for
Alembic autogeneration.
"""

from app.models.base import Base

__all__ = ["Base"]
