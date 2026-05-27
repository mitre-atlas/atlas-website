from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from atlas import models
from atlas.constants import ATLAS_FORMAT_VERSION

ATLAS_FORMAT_VERSION_ROW_ID = 1


def get_format_version(db: Session) -> models.FormatVersion | None:
    return db.get(models.FormatVersion, ATLAS_FORMAT_VERSION_ROW_ID)


def init_format_version(db: Session, version: str) -> models.FormatVersion:
    today = datetime.now(timezone.utc).date()
    db_obj = get_format_version(db)
    if db_obj is None:
        db_obj = models.FormatVersion(
            id=ATLAS_FORMAT_VERSION_ROW_ID,
            version=version,
            created_date=today,
            modified_date=today,
        )
        db.add(db_obj)
        db.flush()
        return db_obj

    db_obj.version = version
    db_obj.modified_date = today
    db.flush()
    return db_obj


def ensure_format_version_set(
    db: Session, default_version: str = ATLAS_FORMAT_VERSION
) -> models.FormatVersion:
    format_version = get_format_version(db)
    if format_version is None:
        return init_format_version(db, default_version)
    return format_version


def assert_format_version_matches(
    db: Session, incoming_version: str
) -> models.FormatVersion:
    format_version = ensure_format_version_set(db)
    if format_version.version != incoming_version:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Format version mismatch: "
                f"configured format-version is {format_version.version}, "
                f"input format-version is {incoming_version}."
            ),
        )
    return format_version
