from __future__ import annotations

from atlas import models, schemas


def update_model(db_obj: models.Matrix, body: schemas.MatrixInput) -> None:
    db_obj.name = body.name
    db_obj.description = body.description
    db_obj.references = [ref.model_dump(mode="json") for ref in body.references]
    db_obj.created_date = body.created_date
    db_obj.modified_date = body.modified_date


def to_schema(
    db_obj: models.Matrix,
) -> schemas.MatrixResponse:
    sequence_rows: list[tuple[int | None, str, str | None]] = []
    for rel in db_obj.source_relationships:
        if rel.relationship_type == models.AtlasRelationshipType.SEQUENCES:
            extra = rel.extra_fields or {}
            raw_position = extra.get("position")
            position = raw_position if isinstance(raw_position, int) else None
            sequence_rows.append((position, rel.target, rel.description))

    sequence_rows.sort(
        key=lambda row: (
            row[0] is None,
            row[0] if row[0] is not None else 0,
            row[1],
        )
    )

    sequences = [
        schemas.SequencesRelationshipFields(
            tactic=tactic,
            description=description,
            position=position or idx,
        )
        for idx, (position, tactic, description) in enumerate(sequence_rows, start=1)
    ]

    return schemas.MatrixResponse(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        sequences=sequences,
    )


def to_export_schema(db_obj: models.Matrix) -> schemas.Matrix:
    return schemas.Matrix(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
    )
