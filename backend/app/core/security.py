import hashlib
from passlib.context import CryptContext # type: ignore
from jose import jwt # type: ignore
from datetime import datetime, timedelta

SECRET = "SUPER_SECRET_KEY"
ALGO = "HS256"

pwd_ctx = CryptContext(schemes=["bcrypt"])

def _normalize(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def hash_password(password: str):
    return pwd_ctx.hash(_normalize(password))

def verify_password(password: str, hash: str):
    return pwd_ctx.verify(_normalize(password), hash)

def create_token(user_id, role):
    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def decode_token(token):
    return jwt.decode(token, SECRET, algorithms=[ALGO])
