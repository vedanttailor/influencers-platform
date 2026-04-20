from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.database import SessionLocal
from app.models import Campaign, Response, User
from app.auth.dependencies import get_current_user
from pydantic import BaseModel  # type: ignore
import uuid

router = APIRouter(prefix="/influencer", tags=["Influencer"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# Schemas
# =========================

class ApplyCampaign(BaseModel):
    campaign_id: uuid.UUID


class SubmitLink(BaseModel):
    instagram_url: str | None = None
    youtube_url: str | None = None


# =========================
# Get Available Campaigns
# =========================

@router.get("/campaigns")
def get_available_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    # ✅ Only campaigns NOT assigned to anyone
    campaigns = db.query(Campaign).filter(
        Campaign.influencer_id == None
    ).all()

    return [
        {
            "id": str(c.id),
            "campaign_name": c.campaign_name,
            "brand_name": c.brand_name,
            "platforms": c.platforms,
            "company_url": c.company_url,
            "budget": float(c.budget or 0),
            "end_date": c.end_date,
            "status": c.status,
            "description": c.description,
            "logo": c.logo,
        }
        for c in campaigns
    ]


# =========================
# Apply Campaign
# =========================

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

    # ✅ Assign influencer
    campaign.influencer_id = user["sub"]
    campaign.status = "applied"

    # Get influencer info
    influencer_user = db.query(User).filter(User.id == user["sub"]).first()

    # ✅ Create response entry
    new_response = Response(
        campaign_id=campaign.id,
        influencer_name=influencer_user.full_name if influencer_user else "Unknown",
        platforms=campaign.platforms,
        campaign_name=campaign.campaign_name,
        deliverables=campaign.description or "No deliverables",
        price=str(campaign.budget),
        status="Pending",
        client_id=campaign.client_id
    )

    db.add(new_response)
    db.commit()

    return {"message": "Applied successfully"}


# =========================
# My Campaigns (ONLY USER DATA)
# =========================

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
            "company_url": c.company_url,
            "budget": float(c.budget or 0),
            "status": c.status,
            "end_date": c.end_date,
            "post_url": c.post_url,
            "description": c.description,
        }
        for c in campaigns
    ]


# =========================
# Submit Post Links
# =========================

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

    # ✅ Store both links
    campaign.post_url = {
        "instagram": data.instagram_url,
        "youtube": data.youtube_url
    }

    campaign.status = "completed"

    db.commit()

    return {"message": "Link submitted successfully"}


# =========================
# Earnings
# =========================

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