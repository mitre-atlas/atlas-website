from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from atlas import models, schemas
from atlas.db import transactional
from atlas.mappers import matrices as matrix_mapper
from atlas.services.common import replace_source_relationships


def get(db: Session, version: str) -> models.Matrix | None:
    try:
        return db.query(models.Matrix).filter(models.Matrix.version == version).first()
    except OperationalError:
        return None


def get_one(db: Session, version: str) -> models.Matrix:
    matrix = get(db, version)
    if matrix is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Matrix not found in version {version}.",
        )
    return matrix


def update(db: Session, version: str, matrix: schemas.MatrixInput) -> models.Matrix:
    db_matrix = get_one(db, version)

    with transactional(db):
        matrix_mapper.update_model(db_matrix, matrix)

        sequences_relationships = [
            models.Relationship(
                source=db_matrix.id,
                target=seq.tactic,
                version=db_matrix.version,
                relationship_type=models.AtlasRelationshipType.SEQUENCES,
                description=seq.description,
                extra_fields={"position": seq.position},
            )
            for seq in matrix.sequences
        ]
        replace_source_relationships(
            db,
            db_matrix,
            models.AtlasRelationshipType.SEQUENCES,
            sequences_relationships,
        )

    db.refresh(db_matrix)
    return db_matrix
