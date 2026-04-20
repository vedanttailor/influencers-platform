from app.auth.schemas import ForgotPasswordSchema, ResetPasswordSchema
from app.auth.service import forgot_password, reset_password
from app.auth.dependencies import get_current_user
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile  # type: ignore
from sqlalchemy.orm import Session  # type: ignore
from app.auth.schemas import SignupSchema, LoginSchema
from app.database import SessionLocal
from app.models import User, Influencer, Client, Campaign
from app.core.security import hash_password, verify_password, create_token
from app.auth.permissions import require_role
from .utils import get_user_by_email
from datetime import datetime
import os
from dotenv import load_dotenv  # type: ignore
import cloudinary.uploader  # type: ignore

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

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
        role=data.role,
        phone=data.phone,
        profile_img=data.profile_img,
        status="pending"  # 🔥 NEW USERS NEED APPROVAL
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token(user.id, user.role)

    return {
        "message": "Signup successful. Waiting for admin approval.",
        "data": {
            "token": token,
            "role": user.role
        }
    }

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data.email)


    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    
    if user.is_deleted:
        raise HTTPException(status_code=403, detail="Your account has been deleted")

    
    if user.status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your account is under review. Please wait for admin approval."
        )

    if user.status == "rejected":
        raise HTTPException(
            status_code=403,
            detail="Your account has been rejected. Please contact support."
        )

    if user.status == "suspended":
        raise HTTPException(
            status_code=403,
            detail="Your account has been suspended due to policy violation."
        )

    if user.status != "active":
        raise HTTPException(
            status_code=403,
            detail="Your account is not active."
        )

    user.last_login = datetime.utcnow()
    db.commit()

    token = create_token(user.id, user.role)

    return {
        "token": token,
        "role": user.role
    }



@router.delete("/users/{id}")
def delete_user(id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()

    if not user:
        raise HTTPException(404, "User not found")

    user.is_deleted = datetime.utcnow()
    db.commit()

    return {"message": "User deleted"}


@router.post("/forgot-password")
def forgot(data: ForgotPasswordSchema, db: Session = Depends(get_db)):
    return forgot_password(data.email, db)


@router.post("/reset-password")
def reset(data: ResetPasswordSchema, db: Session = Depends(get_db)):
    return reset_password(
        data.email,
        data.code,
        data.new_password,
        db
    )




@router.get("/me")
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user["sub"]).first()

    if not user:
        raise HTTPException(404, "User not found")

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "profile_img": user.profile_img,
    }



@router.get("/campaigns")
def campaigns(db: Session = Depends(get_db)):
    return db.query(Campaign).all()


@router.get("/client")
def get_clients(db: Session = Depends(get_db), user=Depends(require_role("client"))):
    return db.query(Client).all()


@router.get("/influencer")
def get_influencers(db: Session = Depends(get_db), user=Depends(require_role("influencer"))):
    return db.query(Influencer).all()


@router.get("/influencer/{id}")
def get_influencer(id: str, db: Session = Depends(get_db)):
    return db.query(Influencer).filter(Influencer.id == id).first()




@router.post("/upload-profile-image")
def upload_profile_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")

    try:
        result = cloudinary.uploader.upload(file.file)

        return {
            "image_url": result["secure_url"]
        }

    except Exception as e:
        raise HTTPException(500, str(e))