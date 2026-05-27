from __future__ import annotations

from atlas import models, schemas
from atlas.enums import (
    MitigationCategoryType,
    MitigationLifecyclePhasesType,
    build_enum_list,
    sort_enum_values,
)


def to_model(
    body: schemas.MitigationInput | schemas.Mitigation,
    *,
    mitigation_id: str,
    version: str,
) -> models.Mitigation:
    return models.Mitigation(
        id=mitigation_id,
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
        lifecycle_phases=sort_enum_values(
            [phase.value for phase in body.lifecycle_phases],
            MitigationLifecyclePhasesType,
        ),
        categories=sort_enum_values(
            [category.value for category in body.categories], MitigationCategoryType
        ),
    )


def update_model(db_obj: models.Mitigation, body: schemas.MitigationInput) -> None:
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
    db_obj.lifecycle_phases = sort_enum_values(
        [phase.value for phase in body.lifecycle_phases], MitigationLifecyclePhasesType
    )
    db_obj.categories = sort_enum_values(
        [category.value for category in body.categories], MitigationCategoryType
    )


def to_schema(
    db_obj: models.Mitigation,
) -> schemas.MitigationResponse:
    mitigates = []
    for rel in db_obj.source_relationships:
        if rel.relationship_type == models.AtlasRelationshipType.MITIGATES:
            mitigates.append(
                schemas.MitigatesRelationshipFields(
                    technique=rel.target,
                    description=rel.description,
                )
            )

    attack_reference = (
        schemas.AttackReference(**db_obj.attack_reference)
        if db_obj.attack_reference is not None
        else None
    )
    return schemas.MitigationResponse(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        attack_reference=attack_reference,
        lifecycle_phases=build_enum_list(
            db_obj.lifecycle_phases or [], MitigationLifecyclePhasesType
        ),
        categories=build_enum_list(db_obj.categories or [], MitigationCategoryType),
        mitigates=mitigates,
    )


def to_export_schema(db_obj: models.Mitigation) -> schemas.Mitigation:
    attack_reference = (
        schemas.AttackReference(**db_obj.attack_reference)
        if db_obj.attack_reference is not None
        else None
    )
    return schemas.Mitigation(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        attack_reference=attack_reference,
        lifecycle_phases=build_enum_list(
            db_obj.lifecycle_phases or [], MitigationLifecyclePhasesType
        ),
        categories=build_enum_list(db_obj.categories or [], MitigationCategoryType),
    )
