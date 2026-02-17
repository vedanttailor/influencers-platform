import random
from datetime import datetime, timedelta
from app.core.security import hash_password
from fastapi import HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.models import User, ResetToken
from app.utils import send_email


def forgot_password(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "User not found")


    db.query(ResetToken).filter(ResetToken.user_id == user.id).delete()
    db.commit()

    code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=10)

    token = ResetToken(
        user_id=user.id,
        token=code,
        expires_at=expires
    )

    db.add(token)
    db.commit()

    send_email(
        to=email,
        subject="Password Reset Code",
        body=f"Your reset code is: {code}\n\nValid for 5 minutes."
    )

    return {"message": "Reset code sent to email"}


def reset_password(email: str, code: str, new_password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "User not found")

    token = db.query(ResetToken).filter(
        ResetToken.user_id == user.id,
        ResetToken.token == code
    ).first()

    if not token:
        raise HTTPException(400, "Invalid code")

    if token.expires_at < datetime.utcnow():
        db.delete(token)
        db.commit()
        raise HTTPException(400, "Code expired")

    user.password = hash_password(new_password)
    db.delete(token)
    db.commit()

    return {"message": "Password updated successfully"}
