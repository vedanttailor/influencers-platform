from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
from app.models import Campaign, Payment
from app.auth.dependencies import get_current_user
from pydantic import BaseModel # type: ignore
from typing import List
import uuid
from datetime import datetime
import cloudinary.uploader # type: ignore

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class StatusUpdate(BaseModel):
    status: str


# ✅ UPDATED CREATE CAMPAIGN (FILE SUPPORT)
@router.post("")
def create_campaign(
    campaign_name: str = Form(...),
    brand_name: str = Form(...),
    campaign_type: str = Form(...),
    campaign_category: str = Form(...),
    campaign_objective: str = Form(...),
    company_url: str = Form(None),
    description: str = Form(...),
    start_date: str = Form(...),
    end_date: str = Form(...),
    budget: int = Form(...),
    platforms: List[str] = Form(...),
    logo: UploadFile = File(None),  # ✅ FILE INPUT
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    logo_url = None

    # ✅ Upload to Cloudinary
    if logo:
        upload_result = cloudinary.uploader.upload(logo.file)
        logo_url = upload_result["secure_url"]

    campaign = Campaign(
        campaign_name=campaign_name,
        brand_name=brand_name,
        campaign_type=campaign_type,
        campaign_category=campaign_category,
        campaign_objective=campaign_objective,
        description=description,
        company_url=company_url,    
        platforms=platforms,
        start_date=datetime.fromisoformat(start_date),
        end_date=datetime.fromisoformat(end_date),
        budget=budget,
        logo=logo_url,  # ✅ SAVE URL
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

    total_budget = sum(float(c.budget or 0) for c in campaigns)

    # 👉 TEMP LOGIC (until payment system)
    total_spent = total_budget
    remaining = total_budget - total_spent

    return {
        "summary": {
            "total": len(campaigns),
            "active": len([c for c in campaigns if c.status == "active"]),
            "completed": len([c for c in campaigns if c.status == "completed"]),
            "spend": total_spent,
        },
        "performance": [
            {
                "name": c.campaign_name,
                "engagement": 1000 + i * 200,
                "status": c.status,
                "spend": float(c.budget or 0),
            }
            for i, c in enumerate(campaigns)
        ],
        "budget": {
            "spent": total_spent,
            "remaining": remaining,
        },
    }



@router.get("")
def get_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    campaigns = db.query(Campaign).filter(
        Campaign.client_id == user["sub"]
    ).all()

    campaigns_data = []

    for campaign in campaigns:

        payment = db.query(Payment).filter(
            Payment.campaign_id == campaign.id,
            Payment.payment_status == "paid"
        ).first()

        campaigns_data.append({

            "id": str(campaign.id),

            "campaign_name": campaign.campaign_name,

            "brand_name": campaign.brand_name,

            "campaign_type": campaign.campaign_type,

            "campaign_category": campaign.campaign_category,

            "campaign_objective": campaign.campaign_objective,

            "company_url": campaign.company_url,

            "description": campaign.description,

            "budget": campaign.budget,

            "platforms": campaign.platforms,

            "logo": campaign.logo,

            "status": campaign.status,

            "client_id": str(campaign.client_id),

            "start_date": campaign.start_date,

            "end_date": campaign.end_date,

            "is_paid": True if payment else False
        })

    return campaigns_data



@router.get("/{id}")
def get_campaign(id: uuid.UUID, db: Session = Depends(get_db)):

    campaign = db.query(Campaign).filter(
        Campaign.id == id
    ).first()

    if not campaign:
        raise HTTPException(404, "Campaign not found")

    # CHECK PAYMENT STATUS

    payment = db.query(Payment).filter(
        Payment.campaign_id == campaign.id,
        Payment.payment_status == "paid"
    ).first()

    return {

        "id": str(campaign.id),

        "campaign_name": campaign.campaign_name,

        "brand_name": campaign.brand_name,

        "campaign_type": campaign.campaign_type,

        "campaign_category": campaign.campaign_category,

        "campaign_objective": campaign.campaign_objective,

        "company_url": campaign.company_url,

        "description": campaign.description,

        "budget": campaign.budget,

        "platforms": campaign.platforms,

        "logo": campaign.logo,

        "status": campaign.status,

        "client_id": str(campaign.client_id),

        "start_date": campaign.start_date,

        "end_date": campaign.end_date,

        "post_url": campaign.post_url,

        # IMPORTANT
        "is_paid": True if payment else False
    }



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