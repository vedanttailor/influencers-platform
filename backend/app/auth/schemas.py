from pydantic import BaseModel, EmailStr # type: ignore

class SignupSchema(BaseModel):
    role: str
    full_name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class ResetSchema(BaseModel):
    token: str
    new_password: str
