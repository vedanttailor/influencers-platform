from app.auth.service import forgot_password, reset_password
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from app.auth.schemas import SignupSchema, LoginSchema 
from app.database import SessionLocal
from app.models import User
from app.core.security import hash_password, verify_password, create_token
from .utils import get_user_by_email
from datetime import datetime

router = APIRouter(prefix="/auth")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup")
def signup(data: SignupSchema, db: Session = Depends(get_db)):
    if get_user_by_email(db, data.email):
        raise HTTPException(400, "Email already exists")

    user = User(
        full_name=data.full_name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id, user.role)

    return {"token": token, "role": user.role}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(401, "Invalid credentials")

   
    if user.is_deleted:
        raise HTTPException(403, "Account deleted")

    
    if user.status != "active":
        raise HTTPException(403, "Account suspended")

    
    user.last_login = datetime.utcnow()
    db.commit()

    token = create_token(user.id, user.role)
    return {"token": token, "role": user.role}


@router.delete("/users/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    user = db.query(User).get(id)
    user.is_deleted = datetime.utcnow()
    db.commit()


@router.post("/forgot-password")
def forgot(data: dict, db: Session = Depends(get_db)):
    return forgot_password(data["email"], db)

@router.post("/reset-password")
def reset(data: dict, db: Session = Depends(get_db)):
    return reset_password(
        data["email"],
        data["code"],
        data["new_password"],
        db
    )