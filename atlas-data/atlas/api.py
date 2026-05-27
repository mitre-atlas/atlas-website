from contextlib import asynccontextmanager

from fastapi import FastAPI

from atlas.db import Base, SessionLocal, engine

# Database imports
from atlas.routes import router
from atlas.services.format_versions import ensure_format_version_set


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        ensure_format_version_set(db)
        db.commit()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(router)
