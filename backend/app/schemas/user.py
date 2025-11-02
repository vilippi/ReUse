from pydantic import BaseModel, EmailStr, Field, field_validator
from bson import ObjectId
import re

# ------------------ Utils ------------------
_re_digits = re.compile(r"\D+")

def only_digits(s: str) -> str:
    return _re_digits.sub("", s or "")

def valida_cpf(cpf: str) -> bool:
    """Valida CPF (formato BR). Aceita só dígitos, calcula dígitos verificadores."""
    cpf = only_digits(cpf)
    if len(cpf) != 11:
        return False
    if cpf == cpf[0] * 11:  # evita CPFs de dígitos repetidos (111... / 000...)
        return False

    # dígito 1
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    d1 = (soma * 10) % 11
    d1 = 0 if d1 == 10 else d1
    if d1 != int(cpf[9]):
        return False

    # dígito 2
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    d2 = (soma * 10) % 11
    d2 = 0 if d2 == 10 else d2
    if d2 != int(cpf[10]):
        return False

    return True

def normalize_phone_br(phone: str) -> str:
    """Normaliza telefone BR: mantém apenas dígitos e exige 10 ou 11 (sem DDI)."""
    digits = only_digits(phone)
    if len(digits) not in (10, 11):
        raise ValueError("Telefone deve conter 10 ou 11 dígitos (DDD + número).")
    return digits

# ------------------ Pydantic helpers ------------------
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        return ObjectId(v) if not isinstance(v, ObjectId) else v

# ------------------ Schemas de entrada/saída ------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    cpf: str
    phone: str

    @field_validator("password")
    @classmethod
    def check_len(cls, v: str):
        if len(v) < 8:
            raise ValueError("Use pelo menos 8 caracteres.")
        if len(v) > 128:
            raise ValueError("Senha muito longa.")
        return v

    @field_validator("full_name")
    @classmethod
    def nome_obrigatorio(cls, v: str):
        v = (v or "").strip()
        if len(v) < 3:
            raise ValueError("Nome muito curto.")
        return v

    @field_validator("cpf")
    @classmethod
    def cpf_ok(cls, v: str):
        v = only_digits(v)
        if not valida_cpf(v):
            raise ValueError("CPF inválido.")
        return v

    @field_validator("phone")
    @classmethod
    def phone_ok(cls, v: str):
        return normalize_phone_br(v)

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    cpf: str         # se não quiser expor o CPF publicamente, remova esta linha
    phone: str
    is_active: bool

# Schema só para login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ------------------ Modelo interno (DB) ------------------
class UserInDB(BaseModel):
    id: PyObjectId | None = Field(default=None, alias="_id")
    email: EmailStr
    full_name: str
    cpf: str            # armazenado apenas dígitos
    phone: str          # armazenado apenas dígitos (DDD+numero)
    hashed_password: str
    is_active: bool = True

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
