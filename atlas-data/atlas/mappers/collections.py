from __future__ import annotations

from atlas import models, schemas


def update_model(db_obj: models.Collection, body: schemas.CollectionInput) -> None:
    db_obj.name = body.name
    db_obj.description = body.description
    db_obj.references = [ref.model_dump(mode="json") for ref in body.references]
    db_obj.created_date = body.created_date
    db_obj.modified_date = body.modified_date


def to_schema(db_obj: models.Collection) -> schemas.CollectionResponse:
    return schemas.CollectionResponse(
        id=db_obj.id,
        version=db_obj.version,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
    )


def to_export_schema(db_obj: models.Collection) -> schemas.Collection:
    return schemas.Collection(
        id=db_obj.id,
        version=db_obj.version,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
    )
