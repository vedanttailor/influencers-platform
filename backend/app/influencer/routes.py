from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
from app.models import Campaign
from app.auth.dependencies import get_current_user
from pydantic import BaseModel # type: ignore
import uuid

router = APIRouter(prefix="/influencer", tags=["Influencer"])


def get_db():
    db = SessionLocal()
    try:    
        yield db
    finally:
        db.close()



class ApplyCampaign(BaseModel):
    campaign_id: uuid.UUID


class SubmitLink(BaseModel):
    post_url: str



@router.get("/campaigns")
def get_available_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()

    return [
        {
            "id": str(c.id),
            "campaign_name": c.campaign_name,
            "brand_name": c.brand_name,
            "platforms": c.platforms,
            "budget": float(c.budget),
            "end_date": c.end_date,
            "status": c.status,
            "description": c.description,
        }
        for c in campaigns
    ]



@router.post("/apply")
def apply_campaign(
    data: ApplyCampaign,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    campaign = db.query(Campaign).filter(Campaign.id == data.campaign_id).first()

    if not campaign:
        raise HTTPException(404, "Campaign not found")

    if campaign.influencer_id:
        raise HTTPException(400, "Already assigned")

    campaign.influencer_id = user["sub"]
    campaign.status = "applied"

    db.commit()

    return {"message": "Applied successfully"}



@router.get("/my-campaigns")
def my_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    campaigns = db.query(Campaign).filter(
        Campaign.influencer_id == user["sub"]
    ).all()

    return [
        {
            "id": str(c.id),
            "campaign_name": c.campaign_name,
            "brand_name": c.brand_name,
            "budget": float(c.budget),
            "status": c.status,
            "end_date": c.end_date,
            "post_url": c.post_url,
            "description": c.description,
        }
        for c in campaigns
    ]


@router.patch("/submit/{id}")
def submit_link(
    id: uuid.UUID,
    data: SubmitLink,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    campaign = db.query(Campaign).filter(
        Campaign.id == id,
        Campaign.influencer_id == user["sub"]
    ).first()

    if not campaign:
        raise HTTPException(404, "Campaign not found")

    campaign.post_url = data.post_url
    campaign.status = "completed"

    db.commit()

    return {"message": "Link submitted successfully"}

@router.get("/earnings")
def get_earnings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    campaigns = db.query(Campaign).filter(
        Campaign.influencer_id == user["sub"]
    ).all()

    completed = [c for c in campaigns if c.status == "completed"]
    pending = [c for c in campaigns if c.status in ["applied", "accepted"]]

    total_earning = sum(float(c.budget or 0) for c in completed)
    pending_earning = sum(float(c.budget or 0) for c in pending)

    return {
        "total_earning": total_earning,
        "pending_earning": pending_earning,
        "completed_campaigns": len(completed),
        "campaigns": [
            {
                "id": str(c.id),
                "campaign_name": c.campaign_name,
                "brand_name": c.brand_name,
                "budget": float(c.budget or 0),
                "status": c.status,
            }
            for c in campaigns
        ],
    }