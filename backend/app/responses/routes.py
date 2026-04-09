from http.client import HTTPException

from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
from app.models import Response
from app.auth.dependencies import get_current_user
from pydantic import BaseModel # type: ignore

router = APIRouter(prefix="/clients", tags=["Client Responses"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET RESPONSES
@router.get("/responses")
def get_responses(db: Session = Depends(get_db), user=Depends(get_current_user)):
    responses = db.query(Response).filter(Response.client_id == user["sub"]).all()

    return [
        {
            "id": r.id,
            "influencer": r.influencer_name,
            "platforms": r.platforms,
            "campaign": r.campaign_name,
            "deliverables": r.deliverables,
            "price": r.price,
            "status": r.status
        }
        for r in responses
    ]
    


class StatusUpdate(BaseModel):
    status: str


@router.patch("/responses/{id}")
def update_response(id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    res = db.query(Response).filter(Response.id == id).first()

    if not res:
        raise HTTPException(404, "Response not found")

    res.status = data.status
    db.commit()

    return {"message": "Updated"}