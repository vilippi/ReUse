from typing import Literal, List, Optional
from pydantic import BaseModel, Field, HttpUrl, field_validator, ConfigDict, model_validator
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

# POST
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

# GET
class ListingOut(BaseModel):
    model_config = ConfigDict(extra="ignore")  # ignora campos a mais vindos do DB (ex.: createdAt)
    
    id: str = Field(..., description="ID do anúncio")
    title: str
    description: str
    price: float
    stock: int
    categoryId: str
    images: List[str] = Field(default_factory=list)
    status: Status
    sellerName: Optional[str] = None  # preenchido no GET /listings via $lookup
    
# PATCH
class ListingUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Optional[str] = Field(None, min_length=2, max_length=160)
    description: Optional[str] = Field(None, min_length=1, max_length=10_000)
    price: Optional[float] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    categoryId: Optional[str] = Field(None, description="ObjectId da categoria em string")
    images: Optional[List[HttpUrl]] = Field(None, max_items=12)
    status: Optional[Status] = None

    @field_validator("title")
    @classmethod
    def _strip_title(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    @field_validator("description")
    @classmethod
    def _strip_desc(cls, v: Optional[str]) -> Optional[str]:
        return v.strip() if isinstance(v, str) else v

    @model_validator(mode="after")
    def _at_least_one_field(self):
        if not any([
            self.title is not None,
            self.description is not None,
            self.price is not None,
            self.stock is not None,
            self.categoryId is not None,
            self.images is not None,
            self.status is not None,
        ]):
            raise ValueError("Envie pelo menos um campo para atualizar")
        return self
