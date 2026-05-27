from typing import Any

import yaml
from fastapi import APIRouter, Depends, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from atlas import mappers, schemas, services
from atlas.dependencies import get_db

router = APIRouter()


# ---------------------------------------------------------------------------
# Health check (unversioned)
# ---------------------------------------------------------------------------


@router.get("/health")
def health_check():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Version
# ---------------------------------------------------------------------------


@router.post("/versions", status_code=status.HTTP_201_CREATED)
def create_version(
    body: schemas.VersionCreateRequest,
    db: Session = Depends(get_db),
) -> schemas.VersionCreateResponse:
    return services.versions.create(db, body)


@router.get("/versions")
def get_versions(db: Session = Depends(get_db)) -> list[schemas.Version]:
    return services.versions.get_all(db)


@router.patch("/versions/{version}")
def update_version(
    version: str,
    body: schemas.VersionUpdateRequest,
    db: Session = Depends(get_db),
) -> schemas.Version:
    return services.versions.update_metadata(db, version, body)


@router.delete("/versions/{version}")
def delete_version(version: str, db: Session = Depends(get_db)) -> dict[str, str]:
    return services.versions.delete(db, version)


@router.get("/versions/{version}")
def get_version(version: str, db: Session = Depends(get_db)) -> schemas.Version:
    version = services.versions.get_one(db, version)
    return mappers.versions.to_schema(version)


@router.get("/versions/{version}/data")
def export_collection(version: str, db: Session = Depends(get_db)):
    export = services.export.build(db, version)
    data = export.model_dump(
        mode="json",
        exclude_none=True,
        by_alias=True,
    )
    yaml_str = yaml.dump(data, indent=2, sort_keys=False, allow_unicode=True)
    return Response(content=yaml_str, media_type="application/x-yaml")


# ---------------------------------------------------------------------------
# Collection
# ---------------------------------------------------------------------------


@router.get("/{version}/collection/")
def get_collection(
    version: str, db: Session = Depends(get_db)
) -> schemas.CollectionResponse:
    collection = services.collections.get_one(db, version)
    return mappers.collections.to_schema(collection)


@router.put("/{version}/collection/")
def update_collection(
    version: str,
    body: schemas.CollectionInput,
    db: Session = Depends(get_db),
) -> schemas.CollectionResponse:
    collection = services.collections.update(db, version, body)
    return mappers.collections.to_schema(collection)


# ---------------------------------------------------------------------------
# Matrix
# ---------------------------------------------------------------------------


@router.get("/{version}/matrix/")
def get_matrix(version: str, db: Session = Depends(get_db)):
    matrix = services.matrices.get_one(db, version)
    return mappers.matrices.to_schema(matrix)


@router.put("/{version}/matrix/")
def update_matrix(
    version: str,
    body: schemas.MatrixInput,
    db: Session = Depends(get_db),
) -> schemas.MatrixResponse:
    matrix = services.matrices.update(db, version, body)
    return mappers.matrices.to_schema(matrix)


# ---------------------------------------------------------------------------
# Tactics
# ---------------------------------------------------------------------------


@router.get("/{version}/tactics/")
def get_all_tactics(
    version: str, db: Session = Depends(get_db)
) -> list[schemas.TacticResponse]:
    tactics = services.tactics.get_all(db, version)
    return [mappers.tactics.to_schema(t) for t in tactics]


@router.post("/{version}/tactics/", status_code=status.HTTP_201_CREATED)
def create_tactic(
    version: str,
    tactic: schemas.TacticInput,
    db: Session = Depends(get_db),
) -> schemas.TacticResponse:
    db_tactic = services.tactics.create(db, tactic, version)
    return mappers.tactics.to_schema(db_tactic)


@router.get("/{version}/tactics/{tactic_id}")
def get_tactic(
    version: str, tactic_id: str, db: Session = Depends(get_db)
) -> schemas.TacticResponse:
    db_tactic = services.tactics.get_one(db, tactic_id, version)
    return mappers.tactics.to_schema(db_tactic)


@router.put("/{version}/tactics/{tactic_id}")
def update_tactic(
    version: str,
    tactic_id: str,
    tactic: schemas.TacticInput,
    db: Session = Depends(get_db),
) -> schemas.TacticResponse:
    db_tactic = services.tactics.update(db, tactic_id, version, tactic)
    return mappers.tactics.to_schema(db_tactic)


@router.delete("/{version}/tactics/{tactic_id}")
def delete_tactic(
    version: str, tactic_id: str, db: Session = Depends(get_db)
) -> dict[str, Any]:
    return services.tactics.delete(db, tactic_id, version)


# ---------------------------------------------------------------------------
# Techniques
# ---------------------------------------------------------------------------


@router.get("/{version}/techniques/")
def get_all_techniques(
    version: str, db: Session = Depends(get_db)
) -> list[schemas.TechniqueResponse]:
    db_techniques = services.techniques.get_all(db, version)
    return [mappers.techniques.to_schema(t) for t in db_techniques]


@router.post("/{version}/techniques/", status_code=status.HTTP_201_CREATED)
def create_technique(
    version: str,
    technique: schemas.TechniqueInput,
    db: Session = Depends(get_db),
) -> schemas.TechniqueResponse:
    db_technique = services.techniques.create(db, technique, version)
    return mappers.techniques.to_schema(db_technique)


@router.get("/{version}/techniques/{technique_id}")
def get_technique(
    version: str, technique_id: str, db: Session = Depends(get_db)
) -> schemas.TechniqueResponse:
    db_technique = services.techniques.get_one(db, technique_id, version)
    return mappers.techniques.to_schema(db_technique)


@router.put("/{version}/techniques/{technique_id}")
def update_technique(
    version: str,
    technique_id: str,
    technique: schemas.TechniqueInput,
    db: Session = Depends(get_db),
) -> schemas.TechniqueResponse:
    db_technique = services.techniques.update(db, technique_id, version, technique)
    return mappers.techniques.to_schema(db_technique)


@router.delete("/{version}/techniques/{technique_id}")
def delete_technique(
    version: str, technique_id: str, db: Session = Depends(get_db)
) -> dict[str, Any]:
    return services.techniques.delete(db, technique_id, version)


# ---------------------------------------------------------------------------
# Mitigations
# ---------------------------------------------------------------------------


@router.get("/{version}/mitigations/")
def get_all_mitigations(version: str, db: Session = Depends(get_db)):
    mitigations = services.mitigations.get_all(db, version)
    return [mappers.mitigations.to_schema(db_m) for db_m in mitigations]


@router.post("/{version}/mitigations/", status_code=status.HTTP_201_CREATED)
def create_mitigation(
    version: str,
    mitigation: schemas.MitigationInput,
    db: Session = Depends(get_db),
) -> schemas.MitigationResponse:
    db_mitigation = services.mitigations.create(db, mitigation, version)
    return mappers.mitigations.to_schema(db_mitigation)


@router.get("/{version}/mitigations/{mitigation_id}")
def get_mitigation(
    version: str, mitigation_id: str, db: Session = Depends(get_db)
) -> schemas.MitigationResponse:
    db_mitigation = services.mitigations.get_one(db, mitigation_id, version)
    return mappers.mitigations.to_schema(db_mitigation)


@router.put("/{version}/mitigations/{mitigation_id}")
def update_mitigation(
    version: str,
    mitigation_id: str,
    mitigation: schemas.MitigationInput,
    db: Session = Depends(get_db),
) -> schemas.MitigationResponse:
    db_mitigation = services.mitigations.update(db, mitigation_id, version, mitigation)
    return mappers.mitigations.to_schema(db_mitigation)


@router.delete("/{version}/mitigations/{mitigation_id}")
def delete_mitigation(
    version: str, mitigation_id: str, db: Session = Depends(get_db)
) -> dict[str, Any]:
    return services.mitigations.delete(db, mitigation_id, version)


# ---------------------------------------------------------------------------
# Case Studies
# ---------------------------------------------------------------------------


@router.post("/{version}/case-studies/", status_code=status.HTTP_201_CREATED)
def create_case_study(
    version: str,
    case_study: schemas.CaseStudyInput,
    db: Session = Depends(get_db),
) -> schemas.CaseStudyResponse:
    db_case_study = services.case_studies.create(db, case_study, version)
    return mappers.case_studies.to_schema(db_case_study)


@router.get("/{version}/case-studies/{case_study_id}")
def get_case_study(
    version: str, case_study_id: str, db: Session = Depends(get_db)
) -> schemas.CaseStudyResponse:
    db_case_study = services.case_studies.get_one(db, case_study_id, version)
    return mappers.case_studies.to_schema(db_case_study)


@router.get("/{version}/case-studies/")
def get_all_case_studies(
    version: str, db: Session = Depends(get_db)
) -> list[schemas.CaseStudyResponse]:
    case_studies = services.case_studies.get_all(db, version)
    return [mappers.case_studies.to_schema(db_cs) for db_cs in case_studies]


@router.put("/{version}/case-studies/{case_study_id}")
def update_case_study(
    version: str,
    case_study_id: str,
    case_study: schemas.CaseStudyInput,
    db: Session = Depends(get_db),
) -> schemas.CaseStudyResponse:
    db_case_study = services.case_studies.update(db, case_study_id, version, case_study)
    return mappers.case_studies.to_schema(db_case_study)


@router.delete("/{version}/case-studies/{case_study_id}")
def delete_case_study(
    version: str, case_study_id: str, db: Session = Depends(get_db)
) -> dict[str, Any]:
    return services.case_studies.delete(db, case_study_id, version)
