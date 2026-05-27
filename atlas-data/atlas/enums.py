from __future__ import annotations

from enum import Enum
from typing import TypeVar

E = TypeVar("E", bound=Enum)


def sort_enum_values(values: list[str], enum_type: type[Enum]) -> list[str]:
    order = {member.value: index for index, member in enumerate(enum_type)}
    return sorted(values, key=lambda value: order.get(value, 10**6))


def build_enum_list(values: list[str], enum_type: type[E]) -> list[E]:
    return [enum_type(value) for value in sort_enum_values(values, enum_type)]


class AtlasObjectType(Enum):
    COLLECTION = "collection"
    MATRIX = "matrix"
    TACTIC = "tactic"
    TECHNIQUE = "technique"
    MITIGATION = "mitigation"
    CASE_STUDY = "case-study"


class AtlasRelationshipType(Enum):
    SEQUENCES = "sequences"
    ACHIEVES = "achieves"
    SPECIALIZES = "specializes"
    MITIGATES = "mitigates"
    EMPLOYS = "employs"


class DateGranularity(Enum):
    YEAR = "Year"
    MONTH = "Month"
    DAY = "Day"


class TechniqueMaturity(Enum):
    FEASIBLE = "Feasible"
    DEMONSTRATED = "Demonstrated"
    REALIZED = "Realized"


class TechniquePlatformType(Enum):
    PREDICTIVE = "Predictive AI"
    GENERATIVE = "Generative AI"
    AGENTIC = "Agentic AI"
    ENTERPRISE = "Enterprise"


class MitigationCategoryType(Enum):
    POLICY = "Policy"
    TECHNICAL_AI = "Technical - AI"
    TECHNICAL_CYBER = "Technical - Cyber"


class MitigationLifecyclePhasesType(Enum):
    DATA_UNDERSTANDING = "Business and Data Understanding"
    DATA_PREPARATION = "Data Preparation"
    MODEL_ENGINEERING = "AI Model Engineering"
    MODEL_EVALUATION = "AI Model Evaluation"
    DEPLOYMENT = "Deployment"
    MONITORING = "Monitoring and Maintenance"


class CaseStudyType(Enum):
    INCIDENT = "Incident"
    EXERCISE = "Exercise"
