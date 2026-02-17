from fastapi import FastAPI, HTTPException, Depends # type: ignore
from app.auth.routes import router
from app.auth.dependencies import get_current_user
from app.database import Base, engine
from app.auth.permissions import require_role
from fastapi.middleware.cors import CORSMiddleware # type: ignore


app = FastAPI()
Base.metadata.create_all(engine)

app.include_router(router, prefix="/auth")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


