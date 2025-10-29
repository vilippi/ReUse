from pydantic import BaseModel, EmailStr, field_validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def check_len(cls, v: str):
        if len(v) < 8:
            raise ValueError("Use pelo menos 8 caracteres.")
        if len(v) > 128:
            raise ValueError("Senha muito longa.")
        return v

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    is_active: bool
