from fastapi import Depends, HTTPException # type: ignore
from fastapi.security import HTTPBearer # type: ignore
from jose import jwt # type: ignore
from app.core.security import decode_token

security = HTTPBearer()

def get_current_user(token=Depends(security)):
    try:
        payload = decode_token(token.credentials)
        return payload
    except:
        raise HTTPException(401, "Invalid token")
