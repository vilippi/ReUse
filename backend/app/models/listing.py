from typing import Literal, List, Optional
from pydantic import BaseModel, Field, HttpUrl, field_validator, ConfigDict
from bson import ObjectId

# Utilitário para ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("categoryId inválido: não é um ObjectId")
        return ObjectId(v)

# ----- Schemas -----
Status = Literal["active", "paused", "closed"]

class ListingIn(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = Field(..., min_length=2, max_length=160)
    description: str = Field(..., min_length=1, max_length=10_000)
    price: float = Field(..., ge=0)  # simples p/ trabalho acadêmico; em prod prefira cents/Decimal128
    stock: int = Field(..., ge=0)
    categoryId: str = Field(..., description="ObjectId da categoria em string")
    images: List[HttpUrl] = Field(default_factory=list, max_items=12)
    status: Status = Field(default="active")

    @field_validator("title")
    @classmethod
    def strip_title(cls, v: str) -> str:
        return v.strip()

    @field_validator("description")
    @classmethod
    def strip_desc(cls, v: str) -> str:
        return v.strip()

    @field_validator("categoryId")
    @classmethod
    def ensure_object_id(cls, v: str) -> str:
        if not ObjectId.is_valid(v):
            raise ValueError("categoryId inválido: forneça um ObjectId válido em string")
        return v

class ListingOut(BaseModel):
    id: str = Field(..., description="ID do anúncio")
    title: str
    description: str
    price: float
    stock: int
    categoryId: str
    images: List[str]
    status: Status
