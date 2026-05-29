from app.models import Notification
from datetime import datetime


def create_notification(
    db,
    user_id,
    title,
    message,
    type="info"
):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False,
        created_at=datetime.utcnow()
    )

    db.add(notification)

    db.commit()