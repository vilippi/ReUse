from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserCreate, UserPublic, LoginRequest
from app.schemas.auth import Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_db_dep
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserPublic, status_code=201)
async def register_user(payload: UserCreate, db = Depends(get_db_dep)):
    col = db["users"]

    # garanta índices únicos (faça uma vez no startup da app; deixei aqui por praticidade)
    await col.create_index("email", unique=True)
    await col.create_index("cpf", unique=True)

    # conflitos comuns
    existing_email = await col.find_one({"email": payload.email})
    if existing_email:
        raise HTTPException(status_code=409, detail="Email já registrado")

    existing_cpf = await col.find_one({"cpf": payload.cpf})
    if existing_cpf:
        raise HTTPException(status_code=409, detail="CPF já registrado")

    doc = {
        "email": payload.email,
        "full_name": payload.full_name.strip(),
        "cpf": payload.cpf,           # já validado/normalizado (apenas dígitos)
        "phone": payload.phone,       # já normalizado (apenas dígitos)
        "hashed_password": hash_password(payload.password),
        "is_active": True,
        "created_at": datetime.utcnow(),
    }
    res = await col.insert_one(doc)

    return UserPublic(
        id=str(res.inserted_id),
        email=payload.email,
        full_name=doc["full_name"],
        cpf=doc["cpf"],
        phone=doc["phone"],
        is_active=True,
    )

@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db = Depends(get_db_dep)):
    col = db["users"]
    user = await col.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )
    token = create_access_token(str(user["_id"]))
    return Token(access_token=token)
