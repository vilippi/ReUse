from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Trocar para PBKDF2 (sem limite de 72 bytes e sem lib nativa)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
ALGO = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)

def create_access_token(sub: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRES_MIN)
    return jwt.encode({"sub": sub, "exp": expire}, settings.JWT_SECRET, algorithm=ALGO)
