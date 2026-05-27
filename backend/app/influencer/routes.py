from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.database import SessionLocal
from app.models import Campaign, Response, User
from app.auth.dependencies import get_current_user
from app.auth.schemas import UpdateProfileSchema
from pydantic import BaseModel  # type: ignore
from datetime import datetime, timedelta
import uuid

router = APIRouter(
    prefix="/influencer",
    tags=["Influencer"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# SCHEMAS
# =========================

class ApplyCampaign(BaseModel):
    campaign_id: uuid.UUID


class SubmitLink(BaseModel):
    instagram_url: str | None = None
    youtube_url: str | None = None


# =========================
# AVAILABLE CAMPAIGNS
# =========================

@router.get("/campaigns")
def get_available_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

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
# APPLY CAMPAIGN
# =========================

@router.post("/apply")
def apply_campaign(
    data: ApplyCampaign,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    campaign = db.query(Campaign).filter(
        Campaign.id == data.campaign_id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    if campaign.influencer_id:
        raise HTTPException(
            status_code=400,
            detail="Already assigned"
        )

    campaign.influencer_id = user["sub"]
    campaign.status = "applied"

    influencer_user = db.query(User).filter(
        User.id == user["sub"]
    ).first()

    new_response = Response(
        campaign_id=campaign.id,
        influencer_name=(
            influencer_user.full_name
            if influencer_user
            else "Unknown"
        ),
        platforms=campaign.platforms,
        campaign_name=campaign.campaign_name,
        deliverables=campaign.description or "No deliverables",
        price=str(campaign.budget),
        status="Pending",
        client_id=campaign.client_id
    )

    db.add(new_response)
    db.commit()

    return {
        "message": "Applied successfully"
    }


# =========================
# MY CAMPAIGNS
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
            "platforms": c.platforms,
            "company_url": c.company_url,
            "budget": float(c.budget or 0),
            "status": c.status,
            "end_date": c.end_date,
            "post_url": c.post_url,
            "description": c.description,
            "logo": c.logo,
        }
        for c in campaigns
    ]


# =========================
# SUBMIT LINKS
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
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    campaign.post_url = {
        "instagram": data.instagram_url,
        "youtube": data.youtube_url
    }

    campaign.status = "completed"

    db.commit()

    return {
        "message": "Link submitted successfully"
    }


# =========================
# EARNINGS
# =========================

@router.get("/earnings")
def get_earnings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    campaigns = db.query(Campaign).filter(
        Campaign.influencer_id == user["sub"]
    ).all()

    completed = [
        c for c in campaigns
        if c.status == "completed"
    ]

    pending = [
        c for c in campaigns
        if c.status in ["applied", "accepted"]
    ]

    total_earning = sum(
        float(c.budget or 0)
        for c in completed
    )

    pending_earning = sum(
        float(c.budget or 0)
        for c in pending
    )

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


# =========================
# UPDATE PROFILE
# =========================

@router.put("/update-profile")
def update_profile(
    data: UpdateProfileSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(
        User.id == current_user["sub"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.last_profile_update:

        next_update_date = (
            user.last_profile_update +
            timedelta(days=15)
        )

        if datetime.utcnow() < next_update_date:

            remaining_days = (
                next_update_date -
                datetime.utcnow()
            ).days

            raise HTTPException(
                status_code=400,
                detail=f"You can update profile after {remaining_days} days"
            )

    user.full_name = data.full_name
    user.email = data.email
    user.profile_img = data.profile_img
    user.upi_id = data.upi_id

    user.last_profile_update = datetime.utcnow()

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "upi_id": user.upi_id,
            "profile_img": user.profile_img
        }
    }