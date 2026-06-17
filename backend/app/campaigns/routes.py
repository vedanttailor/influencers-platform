from app.helpers.notification import create_notification # type: ignore
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.database import SessionLocal
from app.models import Campaign, Payment, User, UserRole
from app.auth.dependencies import get_current_user
from pydantic import BaseModel  # type: ignore
from typing import List
import uuid
from datetime import datetime
import cloudinary.uploader  # type: ignore

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class StatusUpdate(BaseModel):
    status: str


# =========================
# CREATE CAMPAIGN
# =========================

@router.post("")
async def create_campaign(
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
    logo: UploadFile = File(None),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    logo_url = None

    if logo:

        allowed_types = [
            "image/png",
            "image/jpeg",
            "image/jpg",
        ]

        if logo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PNG, JPG and JPEG images are allowed"
            )

        file_data = await logo.read()

        max_size = 2 * 1024 * 1024

        if len(file_data) > max_size:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 2MB"
            )

        await logo.seek(0)

        upload_result = cloudinary.uploader.upload(logo.file)

        logo_url = upload_result["secure_url"]

    campaign = Campaign(
        campaign_name=campaign_name,
        brand_name=brand_name,
        campaign_type=campaign_type,
        campaign_category=campaign_category,
        campaign_objective=campaign_objective,
        company_url=company_url,
        description=description,
        platforms=platforms,
        start_date=datetime.fromisoformat(start_date),
        end_date=datetime.fromisoformat(end_date),
        budget=budget,
        logo=logo_url,
        status="active",
        client_id=user["sub"],
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)


    admins = db.query(User).filter(
        User.role == UserRole.admin
    ).all()

    managers = db.query(User).filter(
        User.role == UserRole.manager
    ).all()

    influencers = db.query(User).filter(
        User.role == UserRole.influencer
    ).all()

    # Notify Admins
    for admin in admins:

        create_notification(
            db,
            admin.id,
            "New Campaign",
            f"{campaign.campaign_name} campaign created"
        )

    # Notify Managers
    for manager in managers:

        create_notification(
            db,
            manager.id,
            "New Campaign",
            f"{campaign.campaign_name} campaign created"
        )

    # Notify Influencers
    for influencer in influencers:

        create_notification(
            db,
            influencer.id,
            "New Campaign Available",
            f"New campaign {campaign.campaign_name} is available"
        )

    return {
        "message": "Campaign created successfully",
        "campaign_id": str(campaign.id)
    }


# =========================
# GET STATS
# =========================

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    campaigns = db.query(Campaign).filter(
        Campaign.client_id == user["sub"]
    )

    return {
        "total": campaigns.count(),
        "active": campaigns.filter(
            Campaign.status == "active"
        ).count(),
        "completed": campaigns.filter(
            Campaign.status == "completed"
        ).count(),
    }


# =========================
# REPORTS
# =========================

@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    campaigns = db.query(Campaign).filter(
        Campaign.client_id == user["sub"]
    ).all()

    total_budget = sum(
        float(c.budget or 0)
        for c in campaigns
    )

    total_spent = total_budget
    remaining = total_budget - total_spent

    return {
        "summary": {
            "total": len(campaigns),
            "active": len([
                c for c in campaigns
                if c.status == "active"
            ]),
            "completed": len([
                c for c in campaigns
                if c.status == "completed"
            ]),
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


# =========================
# GET ALL CAMPAIGNS
# =========================

@router.get("")
def get_campaigns(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # CLIENT CAN SEE ONLY OWN CAMPAIGNS
    if user["role"] == "client":

        campaigns = db.query(Campaign).filter(
            Campaign.client_id == user["sub"]
        ).all()

    # ADMIN / MANAGER / INFLUENCER CAN SEE ALL
    else:

        campaigns = db.query(Campaign).all()

    campaigns_data = []

    for campaign in campaigns:

        payment = db.query(Payment).filter(
            Payment.campaign_id == campaign.id,
            Payment.payment_status == "paid"
        ).first()

        client = db.query(User).filter(
            User.id == campaign.client_id
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

            "created_at": campaign.created_at,

            "post_url": campaign.post_url,

            "client_email": (
                client.email if client else None
            ),

            "client_phone": (
                client.phone
                if client and campaign.status in [
                    "accepted",
                    "completed"
                ]
                else None
            ),

            "is_paid": True if payment else False
        })

    return campaigns_data

# =========================
# GET SINGLE CAMPAIGN
# =========================

@router.get("/{id}")
def get_single_campaign(
    id: uuid.UUID,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # CLIENT CAN ACCESS ONLY OWN CAMPAIGNS
    if user["role"] == "client":

        campaign = db.query(Campaign).filter(
            Campaign.id == id,
            Campaign.client_id == user["sub"]
        ).first()

    # OTHERS CAN ACCESS ALL
    else:

        campaign = db.query(Campaign).filter(
            Campaign.id == id
        ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    payment = db.query(Payment).filter(
        Payment.campaign_id == campaign.id,
        Payment.payment_status == "paid"
    ).first()

    client = db.query(User).filter(
        User.id == campaign.client_id
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
        "start_date": campaign.start_date,
        "end_date": campaign.end_date,
        "created_at": campaign.created_at,
        "post_url": campaign.post_url,
        "client_email": (
            client.email if client else None
        ),
        "client_phone": (
            client.phone
            if client and campaign.status in [
                "accepted",
                "completed"
            ]
            else None
        ),
        "is_paid": True if payment else False
    }

# =========================
# DELETE CAMPAIGN
# =========================

@router.delete("/{id}")
def delete_campaign(
    id: uuid.UUID,
    db: Session = Depends(get_db)
):

    campaign = db.query(Campaign).filter(
        Campaign.id == id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    db.delete(campaign)
    db.commit()

    return {
        "message": "Deleted"
    }


# =========================
# EDIT CAMPAIGN
# =========================

@router.put("/{id}")
async def edit_campaign(
    id: uuid.UUID,

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

    logo: UploadFile = File(None),

    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    campaign = db.query(Campaign).filter(
        Campaign.id == id,
        Campaign.client_id == user["sub"]
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    logo_url = campaign.logo

    if logo:

        allowed_types = [
            "image/png",
            "image/jpeg",
            "image/jpg"
        ]

        if logo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only PNG, JPG and JPEG allowed"
            )

        file_data = await logo.read()

        max_size = 2 * 1024 * 1024

        if len(file_data) > max_size:
            raise HTTPException(
                status_code=400,
                detail="Image size must be less than 2MB"
            )

        await logo.seek(0)

        upload_result = cloudinary.uploader.upload(logo.file)

        logo_url = upload_result["secure_url"]

    campaign.campaign_name = campaign_name
    campaign.brand_name = brand_name
    campaign.campaign_type = campaign_type
    campaign.campaign_category = campaign_category
    campaign.campaign_objective = campaign_objective
    campaign.company_url = company_url
    campaign.description = description
    campaign.start_date = datetime.fromisoformat(start_date)
    campaign.end_date = datetime.fromisoformat(end_date)
    campaign.budget = budget
    campaign.platforms = platforms
    campaign.logo = logo_url

    db.commit()
    db.refresh(campaign)

    return {
        "message": "Campaign updated successfully"
    }


# =========================
# UPDATE STATUS
# =========================

@router.patch("/{id}")
def update_status(
    id: uuid.UUID,
    data: StatusUpdate,
    db: Session = Depends(get_db)
):

    campaign = db.query(Campaign).filter(
        Campaign.id == id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    campaign.status = data.status

    db.commit()

    return {
        "message": "Updated"
    }