from __future__ import annotations

import re
import uuid
from abc import abstractmethod
from datetime import date
from typing import Annotated, Any, Literal, Self

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    HttpUrl,
    StringConstraints,
    computed_field,
    field_serializer,
    field_validator,
    model_validator,
)

from atlas.constants import ATLAS_COLLECTION_ID, ATLAS_MATRIX_ID
from atlas.enums import (
    AtlasObjectType,
    AtlasRelationshipType,
    CaseStudyType,
    DateGranularity,
    MitigationCategoryType,
    MitigationLifecyclePhasesType,
    TechniqueMaturity,
    TechniquePlatformType,
)

# Letters, digits, spaces, punctuation. No tabs, newlines, or unicode - used for names and other short text fields
PRINTABLE_ASCII = r"^[ -~]*$"

# printable ascii plus newline for multi-line text fields - used for descriptions
ASCII_TEXT = r"^[ -~\n]*$"

# kebab formatted text - used for field names
KEBAB_TEXT = r"^[a-z][a-z0-9-]*$"

# semantic versioning - used for format-version
# from https://semver.org/
SEMVER = r"^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$"

ATLAS_UUID_DOMAIN = uuid.UUID("atlas.mitre.org.".encode("utf-8").hex())

CollectionId = Annotated[str, StringConstraints(pattern=rf"^{ATLAS_COLLECTION_ID}$")]
MatrixId = Annotated[str, StringConstraints(pattern=rf"^{ATLAS_MATRIX_ID}$")]
TacticId = Annotated[str, StringConstraints(pattern=r"^AML\.TA[0-9]{4}$")]
ParentTechniqueId = Annotated[str, StringConstraints(pattern=r"^AML\.T[0-9]{4}$")]
SubTechniqueId = Annotated[
    str, StringConstraints(pattern=r"^AML\.T[0-9]{4}\.[0-9]{3}$")
]
TechniqueId = ParentTechniqueId | SubTechniqueId
MitigationId = Annotated[str, StringConstraints(pattern=r"^AML\.M[0-9]{4}$")]
CaseStudyId = Annotated[str, StringConstraints(pattern=r"^AML\.CS[0-9]{4}$")]
AtlasObjectId = (
    CollectionId | MatrixId | TacticId | TechniqueId | MitigationId | CaseStudyId
)
CaseStudyStepId = Annotated[str, StringConstraints(pattern=r"^S[0-9]{2}$")]

AttackTacticId = Annotated[str, StringConstraints(pattern=r"^TA[0-9]{4}$")]
AttackTechniqueId = Annotated[
    str, StringConstraints(pattern=r"^T[0-9]{4}(\.[0-9]{3})?$")
]
AttackMitigationId = Annotated[str, StringConstraints(pattern=r"^M[0-9]{4}$")]
AttackId = AttackTacticId | AttackTechniqueId | AttackMitigationId


class ConfiguredBaseModel(BaseModel):
    @staticmethod
    def to_kebab(name: str) -> str:
        return name.replace("_", "-")

    model_config = ConfigDict(
        extra="ignore",
        populate_by_name=True,
        alias_generator=to_kebab,
        str_strip_whitespace=True,
    )


class StrictConfiguredBaseModel(ConfiguredBaseModel):
    model_config = ConfigDict(extra="forbid")


# ---------------------------------------------------------------------------
# Base schema layers
# ---------------------------------------------------------------------------


class AtlasObject(ConfiguredBaseModel):
    """Full ATLAS object schema with id (for responses)."""

    id: AtlasObjectId

    @model_validator(mode="wrap")
    @classmethod
    def _verify_computed_fields(cls, data: Any, handler) -> Self:
        uuid_in = None
        obj_type_in = None
        if isinstance(data, dict):
            uuid_in = data.pop("uuid", None)
            obj_type_in = data.pop("object_type", None)
            if "object-type" in data:
                obj_type_in = data.pop("object-type")
        instance = handler(data)
        if uuid_in is not None and instance.uuid != uuid_in:
            raise ValueError(
                f"uuid mismatch for id={instance.id}: "
                f"got {uuid_in}, expected {instance.uuid}"
            )
        if obj_type_in is not None:
            obj_type_val = getattr(obj_type_in, "value", obj_type_in)
            if obj_type_val != instance.object_type.value:
                raise ValueError(
                    f"object_type mismatch for id={instance.id}: "
                    f"got {obj_type_in}, expected {instance.object_type.value}"
                )
        return instance

    @computed_field
    @property
    def uuid(self) -> str:
        return str(uuid.uuid5(ATLAS_UUID_DOMAIN, self.id))

    @computed_field
    @property
    @abstractmethod
    def object_type(self) -> AtlasObjectType:
        raise NotImplementedError


class AtlasObjectFields(ConfiguredBaseModel):
    """Fields shared by all ATLAS objects, without id (for create/update)."""

    name: str = Field(pattern=PRINTABLE_ASCII)
    description: str = Field(pattern=ASCII_TEXT)
    references: list[Reference] = Field(default_factory=list)
    created_date: date = Field(default_factory=date.today)
    modified_date: date = Field(default_factory=date.today)

    @field_serializer("created_date", "modified_date", when_used="json")
    def serialize_dates(self, dt: date):
        return dt.strftime("%Y-%m-%d")


class AtlasRelationship(ConfiguredBaseModel):
    source: AtlasObjectId
    target: AtlasObjectId
    relationship_type: AtlasRelationshipType
    description: str | None = Field(None, pattern=ASCII_TEXT)
    tactic: TacticId | None = None
    step_id: CaseStudyStepId | None = None
    leads_to: list[CaseStudyStepId] | None = None
    position: int | None = Field(default=None, ge=1)


# ---------------------------------------------------------------------------
# Relationship schemas for create/update/response
# ---------------------------------------------------------------------------


class SequencesRelationshipFields(StrictConfiguredBaseModel):
    tactic: TacticId
    description: str | None = Field(None, pattern=ASCII_TEXT)
    position: int = Field(ge=1)


class AchievesRelationshipFields(StrictConfiguredBaseModel):
    tactic: TacticId
    description: str | None = Field(None, pattern=ASCII_TEXT)


class SpecializesRelationshipFields(StrictConfiguredBaseModel):
    technique: ParentTechniqueId
    description: str | None = Field(None, pattern=ASCII_TEXT)


class MitigatesRelationshipFields(StrictConfiguredBaseModel):
    technique: TechniqueId
    description: str | None = Field(None, pattern=ASCII_TEXT)


class EmploysRelationshipFields(StrictConfiguredBaseModel):
    technique: TechniqueId
    tactic: TacticId
    step_id: CaseStudyStepId | None = None
    leads_to: list[CaseStudyStepId] = Field(default_factory=list)
    description: str | None = Field(None, pattern=ASCII_TEXT)


# ---------------------------------------------------------------------------
# Per-type create/update schemas (no id)
# ---------------------------------------------------------------------------


class CollectionFields(AtlasObjectFields):
    version: str = Field(pattern=PRINTABLE_ASCII)


class CollectionRelationships(ConfiguredBaseModel):
    pass


class MatrixFields(AtlasObjectFields):
    pass


class MatrixRelationships(ConfiguredBaseModel):
    sequences: list[SequencesRelationshipFields] = Field(
        default_factory=list, min_length=1
    )


class TacticFields(AtlasObjectFields):
    attack_reference: AttackReference | None = None


class TacticRelationships(ConfiguredBaseModel):
    pass


class TechniqueFields(AtlasObjectFields):
    platforms: list[TechniquePlatformType] = Field(default_factory=list, min_length=1)
    attack_reference: AttackReference | None = None


class TechniqueRelationships(ConfiguredBaseModel):
    tactics: list[AchievesRelationshipFields] = Field(default_factory=list)
    specializes: SpecializesRelationshipFields | None = None


class MitigationFields(AtlasObjectFields):
    attack_reference: AttackReference | None = None
    lifecycle_phases: list[MitigationLifecyclePhasesType] = Field(
        default_factory=list, min_length=1
    )
    categories: list[MitigationCategoryType] = Field(default_factory=list, min_length=1)


class MitigationRelationships(ConfiguredBaseModel):
    mitigates: list[MitigatesRelationshipFields] = Field(default_factory=list)


class CaseStudyFields(AtlasObjectFields):
    type: CaseStudyType
    actor: str = Field(pattern=PRINTABLE_ASCII)
    target: str = Field(pattern=PRINTABLE_ASCII)
    reporter: str | None = Field(None, pattern=PRINTABLE_ASCII)
    date: date
    date_granularity: DateGranularity

    @field_validator("date", mode="before")
    @classmethod
    def normalize_partial_date(cls, value: date | str) -> date:
        if isinstance(value, date):
            return value
        if not isinstance(value, str):
            raise ValueError("date must be YYYY, YYYY-MM, or YYYY-MM-DD")

        if re.fullmatch(r"\d{4}", value):
            return date.fromisoformat(f"{value}-01-01")
        if re.fullmatch(r"\d{4}-\d{2}", value):
            return date.fromisoformat(f"{value}-01")
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
            return date.fromisoformat(value)
        raise ValueError("date must be YYYY, YYYY-MM, or YYYY-MM-DD")

    @field_serializer("date", when_used="json")
    def serialize_date(self, dt: date):
        return dt.strftime("%Y-%m-%d")


class CaseStudyRelationships(ConfiguredBaseModel):
    attack_chain: list[EmploysRelationshipFields]


# ---------------------------------------------------------------------------
# Combined input schemas (for create/update endpoints)
# ---------------------------------------------------------------------------


class CollectionInput(
    CollectionRelationships, AtlasObjectFields, StrictConfiguredBaseModel
):
    pass


class MatrixInput(MatrixRelationships, MatrixFields, StrictConfiguredBaseModel):
    pass


class TacticInput(TacticRelationships, TacticFields, StrictConfiguredBaseModel):
    pass


class TechniqueInput(
    TechniqueRelationships, TechniqueFields, StrictConfiguredBaseModel
):
    pass


class MitigationInput(
    MitigationRelationships, MitigationFields, StrictConfiguredBaseModel
):
    pass


class CaseStudyInput(
    CaseStudyRelationships, CaseStudyFields, StrictConfiguredBaseModel
):
    pass


# ---------------------------------------------------------------------------
# Base per-type schemas for response and export schemas
# ---------------------------------------------------------------------------


class Collection(AtlasObject, CollectionFields):
    @property
    def id(self) -> CollectionId:
        return ATLAS_COLLECTION_ID

    @property
    def object_type(self) -> Literal[AtlasObjectType.COLLECTION]:
        return AtlasObjectType.COLLECTION


class Matrix(AtlasObject, MatrixFields):
    @property
    def id(self) -> MatrixId:
        return ATLAS_MATRIX_ID

    @property
    def object_type(self) -> Literal[AtlasObjectType.MATRIX]:
        return AtlasObjectType.MATRIX


class Tactic(AtlasObject, TacticFields):
    id: TacticId

    @property
    def object_type(self) -> Literal[AtlasObjectType.TACTIC]:
        return AtlasObjectType.TACTIC


class Technique(AtlasObject, TechniqueFields):
    id: TechniqueId
    maturity: TechniqueMaturity

    @property
    def object_type(self) -> Literal[AtlasObjectType.TECHNIQUE]:
        return AtlasObjectType.TECHNIQUE


class Mitigation(AtlasObject, MitigationFields):
    id: MitigationId

    @property
    def object_type(self) -> Literal[AtlasObjectType.MITIGATION]:
        return AtlasObjectType.MITIGATION


class CaseStudy(AtlasObject, CaseStudyFields):
    id: CaseStudyId

    @property
    def object_type(self) -> Literal[AtlasObjectType.CASE_STUDY]:
        return AtlasObjectType.CASE_STUDY


# ---------------------------------------------------------------------------
# Response schemas (with id)
# ---------------------------------------------------------------------------


class CollectionResponse(Collection, CollectionRelationships):
    pass


class MatrixResponse(Matrix, MatrixRelationships):
    pass


class TacticResponse(Tactic, TacticRelationships):
    pass


class TechniqueResponse(Technique, TechniqueRelationships):
    pass


class MitigationResponse(Mitigation, MitigationRelationships):
    pass


class CaseStudyResponse(CaseStudy, CaseStudyRelationships):
    pass


# ---------------------------------------------------------------------------
# Export schema
# ---------------------------------------------------------------------------


class AtlasExport(ConfiguredBaseModel):
    format_version: str = Field(pattern=SEMVER)
    collection: Collection
    matrix: Matrix
    tactics: dict[TacticId, Tactic] = Field(default_factory=dict)
    techniques: dict[TechniqueId, Technique] = Field(default_factory=dict)
    mitigations: dict[MitigationId, Mitigation] = Field(default_factory=dict)
    case_studies: dict[CaseStudyId, CaseStudy] = Field(default_factory=dict)
    relationships: dict[
        AtlasObjectId, dict[AtlasRelationshipType, list[AtlasRelationship]]
    ] = Field(default_factory=dict)


# ---------------------------------------------------------------------------
# Support schemas
# ---------------------------------------------------------------------------


class Reference(ConfiguredBaseModel):
    id: str = Field(pattern=KEBAB_TEXT)
    title: str = Field(pattern=PRINTABLE_ASCII)
    url: HttpUrl

    @field_serializer("url")
    def serialize_url(self, v: HttpUrl):
        return str(v)


class AttackReference(ConfiguredBaseModel):
    id: AttackId
    url: HttpUrl

    @field_serializer("url")
    def serialize_url(self, v: HttpUrl):
        return str(v)


# ---------------------------------------------------------------------------
# Version schemas
# ---------------------------------------------------------------------------


class VersionCreateCollectionFields(StrictConfiguredBaseModel):
    name: str = Field(pattern=PRINTABLE_ASCII)
    description: str = Field(pattern=ASCII_TEXT)
    references: list[Reference] = Field(default_factory=list)


class VersionCreateRequest(StrictConfiguredBaseModel):
    new_version: str = Field(pattern=PRINTABLE_ASCII)
    base_version: str | None = Field(default=None, pattern=PRINTABLE_ASCII)
    publish_date: date | None = None
    collection: VersionCreateCollectionFields | None = None

    @model_validator(mode="after")
    def validate_create_or_copy(self) -> Self:
        if self.base_version and self.base_version == self.new_version:
            raise ValueError("base_version and new_version must differ")
        if self.base_version is None and self.collection is None:
            raise ValueError("collection is required when base_version is not provided")
        return self


class VersionUpdateRequest(StrictConfiguredBaseModel):
    publish_date: date | None = None


class Version(ConfiguredBaseModel):
    version: str = Field(pattern=PRINTABLE_ASCII)
    base_version: str | None = None
    created_date: date
    modified_date: date
    publish_date: date | None = None


class VersionCreateResponse(ConfiguredBaseModel):
    mode: Literal["create", "copy"]
    version: Version
    detail: str = Field(pattern=PRINTABLE_ASCII)
