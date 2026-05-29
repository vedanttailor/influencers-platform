from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.database import SessionLocal
from app.models import Notification
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user["sub"]
        )
        .order_by(Notification.created_at.desc())
        .all()
    )

    unread_count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user["sub"],
            Notification.is_read == False
        )
        .count()
    )

    return {
        "unread_count": unread_count,
        "notifications": [
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "is_read": n.is_read,
                "created_at": n.created_at
            }
            for n in notifications
        ]
    }


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.user_id == current_user["sub"]
        )
        .first()
    )

    if notification:

        notification.is_read = True

        db.commit()

    return {
        "message": "Notification updated"
    }