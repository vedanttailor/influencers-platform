from fastapi import Depends, HTTPException # type: ignore
from .dependencies import get_current_user

def require_role(role: str):
    def checker(user=Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(403, "Forbidden")
        return user
    return checker
