from pydantic import BaseModel, EmailStr # type: ignore
from typing import Optional
from app.models import UserRole 

class SignupSchema(BaseModel):
    role: UserRole
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    profile_img: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class ResetSchema(BaseModel):
    token: str
    new_password: str
    
class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    email: EmailStr
    code: str
    new_password: str

class UpdateProfileSchema(BaseModel):
    full_name: str
    email: EmailStr
    profile_img: Optional[str] = None
    upi_id: Optional[str] = None
    instagram_url: Optional[str] = None
    youtube_url: Optional[str] = None