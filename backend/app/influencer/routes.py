from fastapi import APIRouter, Depends, HTTPException  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.database import SessionLocal
from app.models import Campaign, Response, User
from app.auth.dependencies import get_current_user
from app.auth.schemas import UpdateProfileSchema
from pydantic import BaseModel  # type: ignore
from datetime import datetime, timedelta
from typing import List, Optional
import uuid
import requests
import os
import instaloader



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


class ApplyCampaign(BaseModel):
    campaign_id: uuid.UUID



class SubmitLink(BaseModel):
    instagram_url: Optional[List[str]] = []
    youtube_url: Optional[List[str]] = []



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


    instagram_links = []

    if data.instagram_url:

        instagram_links = [
            link.strip()
            for link in data.instagram_url.split(",")
            if link.strip()
        ]

    youtube_links = []

    if data.youtube_url:

        youtube_links = [
            link.strip()
            for link in data.youtube_url.split(",")
            if link.strip()
        ]

    campaign.post_url = {
    "instagram": data.instagram_url or [],
    "youtube": data.youtube_url or []
}

    campaign.status = "completed"

    db.commit()
    db.refresh(campaign)

    return {
        "message": "Links submitted successfully",
        "post_url": campaign.post_url
    }


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


    now = datetime.utcnow()

    if user.last_profile_update:

        next_update_date = (
            user.last_profile_update +
            timedelta(days=15)
        )

        if now < next_update_date:

            remaining_days = (
                next_update_date - now
            ).days

            raise HTTPException(
                status_code=400,
                detail=f"You can update profile after {remaining_days} days"
            )


    user.full_name = data.full_name

    user.email = data.email

    user.profile_img = data.profile_img

    user.upi_id = data.upi_id


    user.instagram_url = data.instagram_url

    user.youtube_url = data.youtube_url

    user.last_profile_update = now

    db.commit()

    db.refresh(user)


    return {

        "message":
            "Profile updated successfully",

        "user": {

            "id":
                str(user.id),

            "full_name":
                user.full_name,

            "email":
                user.email,

            "upi_id":
                user.upi_id,

            "profile_img":
                user.profile_img,

            "instagram_url":
                user.instagram_url,

            "youtube_url":
                user.youtube_url,

            "last_profile_update":
                user.last_profile_update
        }
    }
    

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


@router.post("/sync-social-analytics")
def sync_social_analytics(
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


    if user.instagram_url:

        instagram_username = (
            user.instagram_url
            .rstrip("/")
            .split("/")[-1]
            .split("?")[0]
    )

    user.instagram_username = instagram_username

    # Temporary mock values

    user.followers_count = 5000
    user.engagement_rate = 4.5


    if user.youtube_url:

        youtube_handle = (
            user.youtube_url
            .split("@")[-1]
            .split("?")[0]
            .replace("/", "")
        )

        user.youtube_channel_name = youtube_handle

        # SEARCH CHANNEL

        search_url = (
            "https://www.googleapis.com/youtube/v3/search"
        )

        search_params = {
            "part": "snippet",
            "q": youtube_handle,
            "type": "channel",
            "key": YOUTUBE_API_KEY
        }

        search_response = requests.get(
            search_url,
            params=search_params
        )

        search_data = search_response.json()

        items = search_data.get("items", [])

        if items:

            channel_id = (
                items[0]["snippet"]["channelId"]
            )

            user.youtube_channel_id = channel_id

            # GET CHANNEL STATS

            stats_url = (
                "https://www.googleapis.com/youtube/v3/channels"
            )

            stats_params = {
                "part": "statistics,snippet",
                "id": channel_id,
                "key": YOUTUBE_API_KEY
            }

            stats_response = requests.get(
                stats_url,
                params=stats_params
            )

            stats_data = stats_response.json()

            channel_items = stats_data.get(
                "items",
                []
            )

            if channel_items:

                stats = (
                    channel_items[0]["statistics"]
                )

                user.youtube_subscribers = int(
                    stats.get(
                        "subscriberCount",
                        0
                    )
                )

                user.youtube_views = int(
                    stats.get(
                        "viewCount",
                        0
                    )
                )

                user.youtube_videos = int(
                    stats.get(
                        "videoCount",
                        0
                    )
                )

    db.commit()

    db.refresh(user)

    return {

        "message":
            "Social analytics synced",

        "data": {

            "instagram_username":
                user.instagram_username,

            "youtube_channel_name":
                user.youtube_channel_name,

            "followers_count":
                user.followers_count,

            "engagement_rate":
                user.engagement_rate,

            "youtube_subscribers":
                user.youtube_subscribers,

            "youtube_views":
                user.youtube_views,

            "youtube_videos":
                user.youtube_videos
        }
    }
