from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
from app.models import Campaign
from app.auth.dependencies import get_current_user
from pydantic import BaseModel # type: ignore
from typing import List
import uuid
from datetime import datetime

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CampaignCreate(BaseModel):
    campaign_name: str
    brand_name: str
    campaign_type: str
    campaign_category: str
    campaign_objective: str
    description: str
    start_date: str
    end_date: str
    budget: int
    platforms: List[str]


class StatusUpdate(BaseModel):
    status: str



@router.post("")
def create_campaign(
    data: CampaignCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    campaign = Campaign(
        campaign_name=data.campaign_name,
        brand_name=data.brand_name,
        campaign_type=data.campaign_type,
        campaign_category=data.campaign_category,
        campaign_objective=data.campaign_objective,
        description=data.description,
        platforms=data.platforms,
        start_date=datetime.fromisoformat(data.start_date),
        end_date=datetime.fromisoformat(data.end_date),
        budget=data.budget,
        status="active",
        client_id=user["sub"],
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    return campaign



@router.get("/stats")
def get_stats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    campaigns = db.query(Campaign).filter(Campaign.client_id == user["sub"])

    return {
        "total": campaigns.count(),
        "active": campaigns.filter(Campaign.status == "active").count(),
        "completed": campaigns.filter(Campaign.status == "completed").count(),
    }



@router.get("/reports")
def get_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    campaigns = db.query(Campaign).filter(Campaign.client_id == user["sub"]).all()

    return {
        "summary": {
            "total": len(campaigns),
            "active": len([c for c in campaigns if c.status == "active"]),
            "completed": len([c for c in campaigns if c.status == "completed"]),
            "spend": sum([float(c.budget or 0) for c in campaigns]),
        },
        "performance": [
            {"name": c.campaign_name, "engagement": 1000 + i * 200}
            for i, c in enumerate(campaigns)
        ],
        "budget": {"spent": 65, "remaining": 35},
    }



@router.get("")
def get_campaigns(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Campaign).filter(Campaign.client_id == user["sub"]).all()



@router.get("/{id}")
def get_campaign(id: uuid.UUID, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(404, "Campaign not found")
    return campaign



@router.delete("/{id}")
def delete_campaign(id: uuid.UUID, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(404, "Campaign not found")

    db.delete(campaign)
    db.commit()
    return {"message": "Deleted"}



@router.patch("/{id}")
def update_status(id: uuid.UUID, data: StatusUpdate, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == id).first()
    if not campaign:
        raise HTTPException(404, "Campaign not found")

    campaign.status = data.status
    db.commit()
    return {"message": "Updated"}