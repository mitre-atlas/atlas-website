from __future__ import annotations

from atlas import models, schemas


def to_schema(db_obj: models.Version) -> schemas.Version:
    return schemas.Version(
        version=db_obj.version,
        base_version=db_obj.base_version,
        created_date=db_obj.created_date,
        modified_date=db_obj.modified_date,
        publish_date=db_obj.publish_date,
    )
