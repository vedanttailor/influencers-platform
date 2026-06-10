from http.client import HTTPException

from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.database import SessionLocal
from app.models import Response, Campaign, User, Influencer
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
def get_responses(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    responses = db.query(Response).filter(
        Response.client_id == user["sub"]
    ).order_by(Response.id.desc()).all()

    result = []

    for r in responses:

        campaign = db.query(Campaign).filter(
            Campaign.id == r.campaign_id
        ).first()

        item = {
            "id": r.id,
            "influencer": r.influencer_name,
            "platforms": r.platforms,
            "campaign": r.campaign_name,
            "price": r.price,
            "status": r.status,
            "campaign_status": "pending",
            "post_url": None,
            "influencer_email": "",
            "influencer_phone": "",
            "profile_url": "",
            "instagram_url": "",
            "youtube_url": "",
        }

        if campaign:

            item["campaign_status"] = campaign.status
            item["post_url"] = campaign.post_url

            if campaign.influencer_id:

                influencer_user = db.query(User).filter(
                    User.id == campaign.influencer_id
                ).first()

                if influencer_user:
                    item["influencer_email"] = influencer_user.email
                    item["influencer_phone"] = influencer_user.phone

                influencer_profile = db.query(Influencer).filter(
                    Influencer.user_id == campaign.influencer_id
                ).first()

                if influencer_profile:
                    item["instagram_url"] = influencer_profile.instagram_url or ""
                    item["youtube_url"] = influencer_profile.youtube_url or ""

                    if influencer_profile.profile:
                        item["profile_url"] = influencer_profile.profile.get(
                            "profile_url", ""
                        )

        result.append(item)

    return result
class StatusUpdate(BaseModel):
    status: str


@router.patch("/responses/{id}")
def update_response(id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    res = db.query(Response).filter(Response.id == id).first()

    if not res:
        raise HTTPException(404, "Response not found")

    res.status = data.status

    # 🔥 IMPORTANT: update campaign also
    campaign = db.query(Campaign).filter(
    Campaign.id == res.campaign_id   # ✅ FIXED
    ).first()

    if campaign:
        if data.status == "Approved":
            campaign.status = "accepted"
        elif data.status == "Rejected":
            campaign.status = "rejected"

    db.commit()

    return {"message": "Updated"}	