from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from atlas import models, schemas
from atlas.db import transactional
from atlas.mappers import collections as collection_mapper


def get(db: Session, version: str) -> models.Collection | None:
    try:
        return (
            db.query(models.Collection)
            .filter(models.Collection.version == version)
            .first()
        )
    except OperationalError:
        return None


def get_one(db: Session, version: str) -> models.Collection:
    collection = get(db, version)
    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection not found in version {version}.",
        )
    return collection


def update(
    db: Session, version: str, body: schemas.CollectionInput
) -> models.Collection:
    collection = get_one(db, version)

    with transactional(db):
        collection_mapper.update_model(collection, body)
    db.refresh(collection)
    return collection
