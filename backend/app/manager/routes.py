from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from pydantic import BaseModel  # type: ignore
from typing import Optional

from app.database import SessionLocal
from app.models import User, Influencer, Client, Campaign, UserRole
from app.auth.permissions import require_role

router = APIRouter(prefix="/manager", tags=["Manager"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ManagerUserActionSchema(BaseModel):
    action: str


class ManagerCampaignActionSchema(BaseModel):
    action: str


class AssignInfluencerSchema(BaseModel):
    influencer_user_id: str
    manager_user_id: Optional[str] = None


@router.get("/stats")
def get_manager_stats(db: Session = Depends(get_db), user=Depends(require_role("manager"))):
    clients = db.query(User).filter(User.role == UserRole.client, User.is_deleted == None).count()  # noqa: E711
    influencers = db.query(User).filter(User.role == UserRole.influencer, User.is_deleted == None).count()  # noqa: E711
    campaigns = db.query(Campaign).count()
    pending_approvals = db.query(User).filter(User.status == "Pending", User.is_deleted == None).count()  # noqa: E711

    return {
        "clients": clients,
        "influencers": influencers,
        "campaigns": campaigns,
        "pending_approvals": pending_approvals,
    }


@router.get("/reports")
def get_manager_reports(db: Session = Depends(get_db), user=Depends(require_role("manager"))):
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).all()

    # Bar chart: last 6 months counts
    from collections import OrderedDict

    month_counts = OrderedDict()
    for i in range(5, -1, -1):
        month_counts[i] = 0

    # Build a map like {"Jan": 3, ...} based on created_at
    # Keep it simple and timezone-agnostic: use created_at month label.
    counts_by_label = {}
    for c in campaigns:
        if not getattr(c, "created_at", None):
            continue
        label = c.created_at.strftime("%b")
        counts_by_label[label] = int(counts_by_label.get(label, 0)) + 1

    performance = [{"name": k, "campaigns": v} for (k, v) in counts_by_label.items()]

    # Pie chart: influencer platforms distribution
    platform_counts = {}
    influencer_rows = db.query(Influencer).all()
    for inf in influencer_rows:
        profile = inf.profile if isinstance(inf.profile, dict) else {}
        platforms = profile.get("platforms") or []
        if isinstance(platforms, str):
            platforms = [platforms]
        if not isinstance(platforms, list):
            platforms = []
        for p in platforms:
            key = str(p)
            platform_counts[key] = int(platform_counts.get(key, 0)) + 1

    platforms = [{"name": k, "value": v} for (k, v) in platform_counts.items()]

    # Fallbacks so charts still render
    if not performance:
        performance = [{"name": "N/A", "campaigns": 0}]
    if not platforms:
        platforms = [{"name": "N/A", "value": 0}]

    return {"performance": performance, "platforms": platforms}


@router.get("/clients")
def get_manager_clients(db: Session = Depends(get_db), user=Depends(require_role("manager"))):
    users = (
        db.query(User)
        .filter(User.role == UserRole.client)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(User.created_at.desc())
        .all()
    )

    items = []
    for user_row in users:
        client_profile = db.query(Client).filter(Client.user_id == user_row.id).first()
        total_campaigns = db.query(Campaign).filter(Campaign.client_id == user_row.id).count()
        active_campaigns = (
            db.query(Campaign)
            .filter(Campaign.client_id == user_row.id, Campaign.status == "Active")
            .count()
        )
        spend = db.query(Campaign.budget).filter(Campaign.client_id == user_row.id).all()
        total_spend = float(sum([float(s[0] or 0) for s in spend]))
        
        latest_campaign = (
            db.query(Campaign)
            .filter(Campaign.client_id == user_row.id)
            .order_by(Campaign.created_at.desc())
            .first()
        )
        items.append(
            {
                "id": str(client_profile.id) if client_profile else str(user_row.id),
                "user_id": str(user_row.id),
                "name": (
                    client_profile.client_name
                    if client_profile and client_profile.client_name
                    else user_row.full_name
                ),
                "company_name": (
                    latest_campaign.brand_name
                    if latest_campaign and latest_campaign.brand_name
                    else None
                ),
                "phone": user_row.phone,
                "logo": (
                    client_profile.product_logo
                    if client_profile and client_profile.product_logo
                    else user_row.profile_img
                ),
                "email": user_row.email,
                "status": user_row.status,
                "active_campaigns": active_campaigns,
                "total_campaigns": total_campaigns,
                "total_spend": total_spend,
                "created_at": user_row.created_at,
            }
        )

    return items


@router.get("/influencers")
def get_manager_influencers(db: Session = Depends(get_db), user=Depends(require_role("manager"))):
    users = (
        db.query(User)
        .filter(User.role == UserRole.influencer)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(User.created_at.desc())
        .all()
    )

    items = []
    for user_row in users:
        influencer_profile = db.query(Influencer).filter(Influencer.user_id == user_row.id).first()
        profile = (
            influencer_profile.profile
            if influencer_profile and isinstance(influencer_profile.profile, dict)
            else {}
        )
        followers = int(profile.get("followers_count") or 0)
        engagement = float(profile.get("engagement_rate") or 0)
        platforms = profile.get("platforms") or []
        if not isinstance(platforms, list):
            platforms = []

        active_campaigns = (
            db.query(Campaign)
            .filter(Campaign.influencer_id == user_row.id, Campaign.status == "active")
            .count()
        )

        items.append(
            {
                "id": str(influencer_profile.id) if influencer_profile else str(user_row.id),
                "user_id": str(user_row.id),
                "name": (
                    influencer_profile.name
                    if influencer_profile and influencer_profile.name
                    else user_row.full_name
                ),       
                "email": user_row.email,
                "phone": user_row.phone,
                "category": influencer_profile.category if influencer_profile else None,
                "status": user_row.status,
                "profile_img": user_row.profile_img,
                "followers": followers,
                "engagement_rate": engagement,
                "platforms": platforms,
                "active_campaigns": active_campaigns,
                "created_at": user_row.created_at,
            }
        )

    return items


@router.get("/campaigns")
def get_manager_campaigns(
    db: Session = Depends(get_db),
    user=Depends(require_role("manager"))
):
    campaigns = db.query(Campaign).order_by(Campaign.created_at.desc()).all()

    items = []

    for c in campaigns:
        client = None
        influencer = None

        if c.client_id:
            client = db.query(User).filter(User.id == c.client_id).first()

        if c.influencer_id:
            influencer = db.query(User).filter(User.id == c.influencer_id).first()

        items.append(
            {
                "id": str(c.id),
                "campaign_name": c.campaign_name,
                "brand_name": c.brand_name,
                "description": c.description,
                "company_url": c.company_url,
                "logo": c.logo,
                "platforms": c.platforms or [],
                "budget": float(c.budget or 0),
                "start_date": c.start_date,
                "end_date": c.end_date,
                "status": c.status,

                # Client Details
                "client_id": str(c.client_id) if c.client_id else None,
                "client_name": client.full_name if client else None,
                "client_email": client.email if client else None,
                "client_phone": client.phone if client else None,

                # Influencer Details
                "influencer_id": str(c.influencer_id) if c.influencer_id else None,
                "influencer_name": influencer.full_name if influencer else None,
                "influencer_email": influencer.email if influencer else None,
                "influencer_phone": influencer.phone if influencer else None,

                # Manager
                "manager_id": str(c.manager_id) if c.manager_id else None,

                "created_at": c.created_at,
            }
        )

    return items


@router.patch("/users/{user_id}/action")
def user_action(
    user_id: str,
    data: ManagerUserActionSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("manager")),
):
    action = (data.action or "").lower().strip()
    user_row = (
        db.query(User)
        .filter(User.id == user_id, User.is_deleted == None)  # noqa: E711
        .first()
    )

    if not user_row:
        raise HTTPException(404, "User not found")

    if user_row.role == UserRole.admin:
        raise HTTPException(403, "Admin accounts cannot be modified")

    if action == "Approve":
        user_row.status = "Active"
    elif action == "Reject":
        user_row.status = "Rejected"
    elif action == "Suspend":
        user_row.status = "Suspended"
    elif action == "Activate":
        user_row.status = "Active"
    else:
        raise HTTPException(400, "Invalid action")

    db.commit()
    db.refresh(user_row)

    return {"message": "User updated", "data": {"id": str(user_row.id), "status": user_row.status}}


@router.patch("/campaigns/{campaign_id}/action")
def campaign_action(
    campaign_id: str,
    data: ManagerCampaignActionSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("manager")),
):
    action = (data.action or "").lower().strip()
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        raise HTTPException(404, "Campaign not found")

    if action == "Approve":
        campaign.status = "Active"
    elif action == "Reject":
        campaign.status = "Rejected"
    elif action == "Suspend":
        campaign.status = "Suspended"
    elif action == "Complete":
        campaign.status = "Completed"
    elif action == "Activate":
        campaign.status = "Active"
    else:
        raise HTTPException(400, "Invalid action")

    db.commit()
    db.refresh(campaign)

    return {"message": "Campaign updated", "data": {"id": str(campaign.id), "status": campaign.status}}


@router.patch("/campaigns/{campaign_id}/assign")
def assign_influencer(
    campaign_id: str,
    data: AssignInfluencerSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("manager")),
):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(404, "Campaign not found")

    influencer_user = db.query(User).filter(User.id == data.influencer_user_id).first()
    if not influencer_user or influencer_user.role != UserRole.influencer:
        raise HTTPException(400, "Invalid influencer")

    campaign.influencer_id = influencer_user.id
    campaign.manager_id = user["sub"]
    if campaign.status in ["Pending", "Available"]:
        campaign.status = "Assigned"

    db.commit()
    db.refresh(campaign)

    return {
        "message": "Assigned",
        "data": {
            "id": str(campaign.id),
            "influencer_id": str(campaign.influencer_id) if campaign.influencer_id else None,
            "manager_id": str(campaign.manager_id) if campaign.manager_id else None,
            "status": campaign.status,
        },
    }

