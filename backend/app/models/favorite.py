# app/models/favorite.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("ObjectId inválido")
        return ObjectId(v)


class FavoriteIn(BaseModel):
    """
    Payload para favoritar um anúncio.
    """
    model_config = ConfigDict(extra="forbid")
    listingId: str = Field(..., description="ID do anúncio (ObjectId em string)")


class FavoriteOut(BaseModel):
    """
    Retorno simples de favorito.
    """
    model_config = ConfigDict(extra="ignore")

    id: str = Field(..., description="ID do favorito")
    listingId: str = Field(..., description="ID do anúncio favoritado")
    userId: str = Field(..., description="ID do usuário dono do favorito")
    createdAt: datetime
    title: Optional[str] = None
    price: Optional[float] = None
    thumbnail: Optional[str] = None
