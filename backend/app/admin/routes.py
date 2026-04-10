from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from pydantic import BaseModel, EmailStr  # type: ignore
from typing import Optional

from app.database import SessionLocal
from app.models import User, Influencer, Client, Campaign, Manager, UserRole
from app.auth.permissions import require_role
from app.auth.utils import get_user_by_email
from app.core.security import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class AdminCreateManagerSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    profile_img: Optional[str] = None


class AdminUserActionSchema(BaseModel):
    action: str


class AdminCampaignActionSchema(BaseModel):
    action: str


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    users = db.query(User).count()
    influencers = db.query(User).filter(User.role == UserRole.influencer).count()
    clients = db.query(User).filter(User.role == UserRole.client).count()
    managers = db.query(Manager).count()
    campaigns = db.query(Campaign).count()

    return {
        "users": users,
        "influencers": influencers,
        "managers": managers,
        "clients": clients,
        "campaigns": campaigns,
    }


@router.get("/users")
def get_admin_users(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    users = (
        db.query(User)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(u.id),
            "full_name": u.full_name,
            "email": u.email,
            "role": u.role,
            "status": u.status,
            "created_at": u.created_at,
            "last_login": u.last_login,
        }
        for u in users
    ]


@router.get("/campaigns")
def get_admin_campaigns(
    db: Session = Depends(get_db), user=Depends(require_role("admin"))
):
    return db.query(Campaign).order_by(Campaign.created_at.desc()).all()


@router.get("/clients")
def get_admin_clients(db: Session = Depends(get_db), user=Depends(require_role("admin"))):
    users = (
        db.query(User)
        .filter(User.role == UserRole.client)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(User.created_at.desc())
        .all()
    )

    items = []
    for user_row in users:
        client_profile = (
            db.query(Client).filter(Client.user_id == user_row.id).first()
        )
        total_campaigns = (
            db.query(Campaign).filter(Campaign.client_id == user_row.id).count()
        )
        active_campaigns = (
            db.query(Campaign)
            .filter(Campaign.client_id == user_row.id, Campaign.status == "active")
            .count()
        )
        spend = (
            db.query(Campaign.budget).filter(Campaign.client_id == user_row.id).all()
        )
        total_spend = float(sum([float(s[0] or 0) for s in spend]))

        items.append(
            {
                "id": str(client_profile.id) if client_profile else str(user_row.id),
                "user_id": str(user_row.id),
                "name": (
                    client_profile.client_name
                    if client_profile and client_profile.client_name
                    else user_row.full_name
                ),
                "company_name": client_profile.company_name if client_profile else None,
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
def get_admin_influencers(
    db: Session = Depends(get_db), user=Depends(require_role("admin"))
):
    users = (
        db.query(User)
        .filter(User.role == UserRole.influencer)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(User.created_at.desc())
        .all()
    )

    items = []
    for user_row in users:
        influencer_profile = (
            db.query(Influencer).filter(Influencer.user_id == user_row.id).first()
        )
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
                "id": (
                    str(influencer_profile.id)
                    if influencer_profile
                    else str(user_row.id)
                ),
                "user_id": str(user_row.id),
                "name": (
                    influencer_profile.name
                    if influencer_profile and influencer_profile.name
                    else user_row.full_name
                ),
                "email": user_row.email,
                "category": influencer_profile.category if influencer_profile else None,
                "status": user_row.status,
                "followers": followers,
                "engagement_rate": engagement,
                "platforms": platforms,
                "active_campaigns": active_campaigns,
                "created_at": user_row.created_at,
            }
        )

    return items


@router.get("/managers")
def get_admin_managers(
    db: Session = Depends(get_db), user=Depends(require_role("admin"))
):
    managers = (
        db.query(Manager, User)
        .join(User, User.id == Manager.user_id)
        .filter(User.is_deleted == None)  # noqa: E711
        .order_by(Manager.created_at.desc())
        .all()
    )

    return [
        {
            "id": str(m.id),
            "user_id": str(u.id),
            "full_name": u.full_name,
            "email": u.email,
            "phone": u.phone,
            "profile_img": u.profile_img,
            "status": m.status,
            "approval_status": m.approval_status,
            "created_at": m.created_at,
        }
        for (m, u) in managers
    ]


@router.post("/create-manager")
def create_manager(
    data: AdminCreateManagerSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")),
):
    if get_user_by_email(db, data.email):
        raise HTTPException(400, "Email already exists")

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        role=UserRole.manager,
        phone=data.phone,
        profile_img=data.profile_img,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    manager = Manager(
        user_id=new_user.id,
        approval_status="approved",
        status="active",
        image=data.profile_img,
        client_info=None,
        influencer_info=None,
    )
    db.add(manager)
    db.commit()
    db.refresh(manager)

    return {
        "message": "Manager created",
        "data": {
            "id": str(new_user.id),
            "full_name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role,
            "phone": new_user.phone,
            "profile_img": new_user.profile_img,
            "manager_id": str(manager.id),
            "status": manager.status,
            "approval_status": manager.approval_status,
        },
    }


@router.patch("/users/{user_id}/action")
def user_action(
    user_id: str,
    data: AdminUserActionSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")),
):
    action = (data.action or "").lower().strip()
    user_row = db.query(User).filter(User.id == user_id, User.is_deleted == None).first()  # noqa: E711

    if not user_row:
        raise HTTPException(404, "User not found")

    if user_row.role == UserRole.admin:
        raise HTTPException(403, "Admin accounts cannot be modified")

    if action == "approve":
        user_row.status = "active"
    elif action == "reject":
        user_row.status = "rejected"
    elif action == "suspend":
        user_row.status = "suspended"
    elif action == "activate":
        user_row.status = "active"
    else:
        raise HTTPException(400, "Invalid action")

    db.commit()
    db.refresh(user_row)

    return {
        "message": "User updated",
        "data": {
            "id": str(user_row.id),
            "status": user_row.status,
        },
    }


@router.patch("/campaigns/{campaign_id}/action")
def campaign_action(
    campaign_id: str,
    data: AdminCampaignActionSchema,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")),
):
    action = (data.action or "").lower().strip()
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()

    if not campaign:
        raise HTTPException(404, "Campaign not found")

    if action == "approve":
        campaign.status = "active"
    elif action == "reject":
        campaign.status = "rejected"
    elif action == "suspend":
        campaign.status = "suspended"
    elif action == "complete":
        campaign.status = "completed"
    elif action == "activate":
        campaign.status = "active"
    else:
        raise HTTPException(400, "Invalid action")

    db.commit()
    db.refresh(campaign)

    return {
        "message": "Campaign updated",
        "data": {
            "id": str(campaign.id),
            "status": campaign.status,
        },
    }
