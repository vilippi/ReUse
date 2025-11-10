# app/models/order.py
from typing import List, Optional, Literal
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


# status básico de pedido
OrderStatus = Literal[
    "pending",     # criado aguardando pagamento
    "paid",        # pago
    "shipped",     # enviado
    "delivered",   # entregue
    "cancelled"    # cancelado
]


class OrderItemIn(BaseModel):
    """
    Item que o cliente manda ao criar o pedido.
    Só precisa do ID do anúncio e a quantidade.
    """
    listingId: str = Field(..., description="ID do anúncio (ObjectId em string)")
    quantity: int = Field(..., ge=1, description="Quantidade solicitada")


class OrderIn(BaseModel):
    """
    Payload para criação de pedido.
    """
    model_config = ConfigDict(extra="forbid")

    items: List[OrderItemIn] = Field(..., min_length=1)
    # campos opcionais de entrega
    shippingAddress: Optional[str] = Field(None, max_length=300)
    notes: Optional[str] = Field(None, max_length=300)


class OrderItemOut(BaseModel):
    """
    Item que vai para o banco e para o GET.
    Já é o snapshot do produto no momento da compra.
    """
    listingId: str
    title: str
    unitPrice: float
    quantity: int
    lineTotal: float
    thumbnail: Optional[str] = None


class OrderOut(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str
    userId: str
    status: OrderStatus
    items: List[OrderItemOut]
    total: float
    shippingAddress: Optional[str] = None
    notes: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
