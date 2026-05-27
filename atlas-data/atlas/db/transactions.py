from __future__ import annotations

from collections.abc import Generator
from contextlib import contextmanager

from fastapi import HTTPException, status
from sqlalchemy import exc
from sqlalchemy.orm import Session


def safe_flush(db: Session) -> None:
    try:
        db.flush()
    except exc.IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Integrity error: {e.orig}",
        )


@contextmanager
def transactional(db: Session) -> Generator[None, None, None]:
    try:
        yield
        db.commit()
    except exc.IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Integrity error: {e.orig}",
        )
    except Exception:
        db.rollback()
        raise
