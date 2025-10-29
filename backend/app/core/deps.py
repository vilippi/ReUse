from fastapi import Depends, HTTPException, status
from jose import jwt, JWTError
from app.core.config import settings
from app.db.mongo import get_db
from fastapi import Request

ALGO = "HS256"

async def get_db_dep(db=Depends(get_db)):
    return db

def get_current_user_id(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = auth.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGO])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
