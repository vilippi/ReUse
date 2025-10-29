from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserPublic
from app.schemas.auth import Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_db_dep
from app.models.user import UserInDB
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserPublic, status_code=201)
async def register_user(payload: UserCreate, db = Depends(get_db_dep)):
    col = db["users"]
    existing = await col.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email já registrado")
    doc = {
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "is_active": True,
    }
    res = await col.insert_one(doc)
    return UserPublic(id=str(res.inserted_id), email=payload.email, is_active=True)

@router.post("/login", response_model=Token)
async def login(payload: UserCreate, db = Depends(get_db_dep)):
    col = db["users"]
    user = await col.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")
    token = create_access_token(str(user["_id"]))
    return Token(access_token=token)
