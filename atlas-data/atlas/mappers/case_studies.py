from __future__ import annotations

from atlas import models, schemas


def to_model(
    body: schemas.CaseStudyInput | schemas.CaseStudy,
    *,
    case_study_id: str,
    version: str,
) -> models.CaseStudy:
    return models.CaseStudy(
        id=case_study_id,
        version=version,
        name=body.name,
        description=body.description,
        references=[ref.model_dump(mode="json") for ref in body.references],
        created_date=body.created_date,
        modified_date=body.modified_date,
        type=body.type,
        actor=body.actor,
        target=body.target,
        reporter=body.reporter,
        date=body.date,
        date_granularity=body.date_granularity,
    )


def update_model(db_obj: models.CaseStudy, body: schemas.CaseStudyInput) -> None:
    db_obj.name = body.name
    db_obj.description = body.description
    db_obj.references = [ref.model_dump(mode="json") for ref in body.references]
    db_obj.created_date = body.created_date
    db_obj.modified_date = body.modified_date
    db_obj.type = body.type
    db_obj.actor = body.actor
    db_obj.target = body.target
    db_obj.reporter = body.reporter
    db_obj.date = body.date
    db_obj.date_granularity = body.date_granularity


def to_schema(
    db_obj: models.CaseStudy,
) -> schemas.CaseStudyResponse:
    attack_chain = []
    for rel in db_obj.source_relationships:
        if rel.relationship_type == models.AtlasRelationshipType.EMPLOYS:
            extra = rel.extra_fields or {}
            attack_chain.append(
                schemas.EmploysRelationshipFields(
                    technique=rel.target,
                    tactic=extra["tactic"],
                    step_id=extra.get("step_id"),
                    leads_to=extra.get("leads_to", []),
                    description=rel.description,
                )
            )

    return schemas.CaseStudyResponse(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        type=db_obj.type,
        actor=db_obj.actor,
        target=db_obj.target,
        reporter=db_obj.reporter,
        date=db_obj.date,
        date_granularity=db_obj.date_granularity,
        attack_chain=attack_chain,
    )


def to_export_schema(db_obj: models.CaseStudy) -> schemas.CaseStudy:
    return schemas.CaseStudy(
        id=db_obj.id,
        name=db_obj.name,
        description=db_obj.description,
        references=db_obj.references or [],
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        type=db_obj.type,
        actor=db_obj.actor,
        target=db_obj.target,
        reporter=db_obj.reporter,
        date=db_obj.date,
        date_granularity=db_obj.date_granularity,
    )
