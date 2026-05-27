from __future__ import annotations

from atlas import models, schemas


def to_model(
    body: schemas.TacticInput | schemas.Tactic,
    *,
    tactic_id: str,
    version: str,
) -> models.Tactic:
    return models.Tactic(
        id=tactic_id,
        version=version,
        name=body.name,
        description=body.description,
        references=[ref.model_dump(mode="json") for ref in body.references],
        created_date=body.created_date,
        modified_date=body.modified_date,
        attack_reference=(
            body.attack_reference.model_dump(mode="json")
            if body.attack_reference is not None
            else None
        ),
    )


def update_model(db_obj: models.Tactic, body: schemas.TacticInput) -> None:
    db_obj.name = body.name
    db_obj.description = body.description
    db_obj.references = [ref.model_dump(mode="json") for ref in body.references]
    db_obj.created_date = body.created_date
    db_obj.modified_date = body.modified_date
    db_obj.attack_reference = (
        body.attack_reference.model_dump(mode="json")
        if body.attack_reference is not None
        else None
    )


def to_schema(db_obj: models.Tactic) -> schemas.TacticResponse:
    attack_reference = (
        schemas.AttackReference(**db_obj.attack_reference)
        if db_obj.attack_reference is not None
        else None
    )
    return schemas.TacticResponse(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        attack_reference=attack_reference,
    )


def to_export_schema(db_obj: models.Tactic) -> schemas.Tactic:
    attack_reference = (
        schemas.AttackReference(**db_obj.attack_reference)
        if db_obj.attack_reference is not None
        else None
    )
    return schemas.Tactic(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        attack_reference=attack_reference,
    )
