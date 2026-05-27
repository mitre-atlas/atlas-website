from __future__ import annotations

import re

from fastapi import HTTPException, status
from sqlalchemy import Integer as SQLInteger
from sqlalchemy import and_, case, cast, func
from sqlalchemy.orm import Session

from atlas import models
from atlas.enums import (
    AtlasObjectType,
    AtlasRelationshipType,
    CaseStudyType,
    TechniqueMaturity,
)

_ID_PREFIXES: dict[AtlasObjectType, tuple[str, int]] = {
    AtlasObjectType.TACTIC: ("AML.TA", 4),
    AtlasObjectType.TECHNIQUE: ("AML.T", 4),
    AtlasObjectType.MITIGATION: ("AML.M", 4),
    AtlasObjectType.CASE_STUDY: ("AML.CS", 4),
}

_SUBTECHNIQUE_RE = re.compile(r"^AML\.T(\d{4})$")

MATURITY_PRIORITY = {
    TechniqueMaturity.FEASIBLE: 0,
    TechniqueMaturity.DEMONSTRATED: 1,
    TechniqueMaturity.REALIZED: 2,
}


def generate_next_id(
    db: Session,
    object_type: AtlasObjectType,
    version: str,
    *,
    specializes_target: str | None = None,
) -> str:
    """Generate the next auto-incremented ID for an object type within a version."""
    prefix, width = _ID_PREFIXES[object_type]

    if object_type == AtlasObjectType.TECHNIQUE and specializes_target:
        # Generate subtechnique ID: AML.T{parent}.{NNN}
        match = _SUBTECHNIQUE_RE.match(specializes_target)
        if not match:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid parent technique ID: {specializes_target}",
            )
        parent_num = match.group(1)
        sub_prefix = f"AML.T{parent_num}."
        max_num = (
            db.query(
                func.max(
                    cast(
                        func.substr(models.Technique.id, len(sub_prefix) + 1),
                        SQLInteger,
                    )
                )
            )
            .filter(
                models.Technique.version == version,
                models.Technique.id.like(f"{sub_prefix}%"),
            )
            .scalar()
        )
        max_num = max_num or 0
        return f"AML.T{parent_num}.{max_num + 1:03d}"

    max_num = (
        db.query(
            func.max(
                cast(
                    func.substr(models.AtlasObject.id, len(prefix) + 1),
                    SQLInteger,
                )
            )
        )
        .filter(
            models.AtlasObject.object_type == object_type,
            models.AtlasObject.version == version,
            models.AtlasObject.id.like(f"{prefix}%"),
        )
        .scalar()
    )
    max_num = max_num or 0

    return f"{prefix}{max_num + 1:0{width}d}"


def replace_source_relationships(
    db: Session,
    db_obj: models.AtlasObject,
    relationship_type: AtlasRelationshipType,
    new_relationships: list[models.Relationship],
) -> None:
    db_obj.source_relationships = [
        rel
        for rel in db_obj.source_relationships
        if rel.relationship_type != relationship_type
    ]
    db.flush()
    db_obj.source_relationships.extend(new_relationships)


def recompute_technique_maturity(
    db: Session,
    version: str,
    changed_technique_ids: set[str],
) -> None:
    """Recompute maturity in batch for changed techniques and affected parents."""
    if not changed_technique_ids:
        return

    impacted_ids = set(changed_technique_ids)

    parent_rows = (
        db.query(models.Relationship.source, models.Relationship.target)
        .filter(
            models.Relationship.version == version,
            models.Relationship.relationship_type == AtlasRelationshipType.SPECIALIZES,
            models.Relationship.source.in_(changed_technique_ids),
        )
        .all()
    )
    parent_ids = {target for _, target in parent_rows}
    impacted_ids.update(parent_ids)

    if parent_ids:
        child_rows = (
            db.query(models.Relationship.source, models.Relationship.target)
            .filter(
                models.Relationship.version == version,
                models.Relationship.relationship_type
                == AtlasRelationshipType.SPECIALIZES,
                models.Relationship.target.in_(parent_ids),
            )
            .all()
        )
    else:
        child_rows = []

    parent_to_children: dict[str, list[str]] = {}
    for child_id, parent_id in child_rows:
        parent_to_children.setdefault(parent_id, []).append(child_id)
        impacted_ids.add(child_id)

    if not impacted_ids:
        return

    case_maturity_score = case(
        (models.CaseStudy.type == CaseStudyType.INCIDENT, 2),
        (models.CaseStudy.type == CaseStudyType.EXERCISE, 1),
        else_=0,
    )

    case_rows = (
        db.query(models.Relationship.target, func.max(case_maturity_score))
        .join(
            models.CaseStudy,
            and_(
                models.Relationship.source == models.CaseStudy.id,
                models.Relationship.version == models.CaseStudy.version,
            ),
        )
        .filter(
            models.Relationship.version == version,
            models.Relationship.relationship_type == AtlasRelationshipType.EMPLOYS,
            models.Relationship.target.in_(impacted_ids),
        )
        .group_by(models.Relationship.target)
        .all()
    )
    base_score = {technique_id: score for technique_id, score in case_rows}

    techniques = (
        db.query(models.Technique)
        .filter(
            models.Technique.version == version,
            models.Technique.id.in_(impacted_ids),
        )
        .all()
    )

    for technique in techniques:
        score = base_score.get(technique.id, 0)
        for child_id in parent_to_children.get(technique.id, []):
            score = max(score, base_score.get(child_id, 0))
        technique.maturity = _maturity_from_score(score)


def _maturity_from_score(score: int) -> TechniqueMaturity:
    if score >= MATURITY_PRIORITY[TechniqueMaturity.REALIZED]:
        return TechniqueMaturity.REALIZED
    if score >= MATURITY_PRIORITY[TechniqueMaturity.DEMONSTRATED]:
        return TechniqueMaturity.DEMONSTRATED
    return TechniqueMaturity.FEASIBLE
