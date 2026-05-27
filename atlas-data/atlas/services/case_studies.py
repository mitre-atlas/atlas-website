from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from atlas import models, schemas
from atlas.db import safe_flush, transactional
from atlas.enums import AtlasObjectType
from atlas.mappers import case_studies as case_study_mapper
from atlas.services.common import (
    generate_next_id,
    recompute_technique_maturity,
    replace_source_relationships,
)


def create(
    db: Session, case_study: schemas.CaseStudyInput, version: str
) -> models.CaseStudy:
    case_study_id = generate_next_id(db, AtlasObjectType.CASE_STUDY, version)

    db_case_study = case_study_mapper.to_model(
        case_study,
        case_study_id=case_study_id,
        version=version,
    )

    for uses_rel in case_study.attack_chain:
        rel = models.Relationship(
            source=case_study_id,
            target=uses_rel.technique,
            version=version,
            relationship_type=models.AtlasRelationshipType.EMPLOYS,
            description=uses_rel.description,
            extra_fields={
                "tactic": uses_rel.tactic,
                "step_id": uses_rel.step_id,
                "leads_to": uses_rel.leads_to,
            },
        )
        db.add(rel)

    with transactional(db):
        db.add(db_case_study)
        safe_flush(db)
        recompute_technique_maturity(
            db,
            version,
            {uses_rel.technique for uses_rel in case_study.attack_chain},
        )
    return db_case_study


def get(db: Session, case_study_id: str, version: str) -> models.CaseStudy | None:
    return (
        db.query(models.CaseStudy)
        .filter(
            models.CaseStudy.id == case_study_id,
            models.CaseStudy.version == version,
        )
        .first()
    )


def get_one(db: Session, case_study_id: str, version: str) -> models.CaseStudy:
    case_study = get(db, case_study_id, version)
    if case_study is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case study with id {case_study_id} not found in version {version}.",
        )
    return case_study


def get_all(db: Session, version: str) -> list[models.CaseStudy]:
    return db.query(models.CaseStudy).filter(models.CaseStudy.version == version).all()


def update(
    db: Session,
    case_study_id: str,
    version: str,
    case_study: schemas.CaseStudyInput,
) -> models.CaseStudy:
    db_case_study = get_one(db, case_study_id, version)

    old_technique_ids = [
        rel.target
        for rel in db_case_study.source_relationships
        if rel.relationship_type == models.AtlasRelationshipType.EMPLOYS
    ]

    with transactional(db):
        case_study_mapper.update_model(db_case_study, case_study)

        employs_relationships = [
            models.Relationship(
                source=db_case_study.id,
                target=step.technique,
                version=db_case_study.version,
                relationship_type=models.AtlasRelationshipType.EMPLOYS,
                description=step.description,
                extra_fields={
                    "tactic": step.tactic,
                    "step_id": step.step_id,
                    "leads_to": step.leads_to,
                },
            )
            for step in case_study.attack_chain
        ]
        replace_source_relationships(
            db,
            db_case_study,
            models.AtlasRelationshipType.EMPLOYS,
            employs_relationships,
        )

        safe_flush(db)

        all_technique_ids = set(old_technique_ids) | {
            rel.technique for rel in case_study.attack_chain
        }
        recompute_technique_maturity(db, version, all_technique_ids)

    db.refresh(db_case_study)
    return db_case_study


def delete(db: Session, case_study_id: str, version: str):
    db_case_study = get_one(db, case_study_id, version)

    technique_ids = [
        rel.target
        for rel in db_case_study.source_relationships
        if rel.relationship_type == models.AtlasRelationshipType.EMPLOYS
    ]

    with transactional(db):
        db.delete(db_case_study)
        recompute_technique_maturity(db, version, set(technique_ids))
    return {"detail": f"Case study {case_study_id} was deleted successfully."}
