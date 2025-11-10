# app/routers/orders.py
from typing import Annotated, List, Optional
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from bson import ObjectId

from app.db.mongo import get_db
from app.core.deps import get_current_user_id
from app.models.order import (
    OrderIn, OrderOut, OrderItemOut, OrderStatus
)

router = APIRouter(prefix="/orders", tags=["Orders"])


def now_utc():
    return datetime.now(timezone.utc)


def to_object_id_or_400(value: str, field_name: str = "id") -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail=f"{field_name} inválido")
    return ObjectId(value)


# ===== POST /orders =====
@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderIn,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    listings_col = db["listings"]
    orders_col = db["orders"]

    if not payload.items:
        raise HTTPException(status_code=400, detail="Envie ao menos 1 item")

    # 1) buscar todos os listings envolvidos
    listing_ids = [to_object_id_or_400(i.listingId, "listingId") for i in payload.items]
    listings_docs = await listings_col.find({"_id": {"$in": listing_ids}}).to_list(length=len(listing_ids))
    listings_map = {d["_id"]: d for d in listings_docs}

    order_items: List[OrderItemOut] = []
    total = 0.0

    # 2) montar snapshot e validar estoque
    for item_in in payload.items:
        listing_oid = ObjectId(item_in.listingId)
        listing = listings_map.get(listing_oid)
        if not listing:
            raise HTTPException(status_code=404, detail=f"Anúncio {item_in.listingId} não encontrado")

        # checar estoque
        stock = int(listing.get("stock", 0))
        if item_in.quantity > stock:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente para o anúncio '{listing.get('title', '')}'"
            )

        unit_price = float(listing.get("price", 0))
        line_total = unit_price * item_in.quantity
        total += line_total

        order_items.append(
            OrderItemOut(
                listingId=str(listing["_id"]),
                title=listing.get("title", ""),
                unitPrice=unit_price,
                quantity=item_in.quantity,
                lineTotal=line_total,
                thumbnail=(listing.get("images") or [None])[0],
            )
        )

    # 3) opcional: abater estoque
    for item_in in payload.items:
        listing_oid = ObjectId(item_in.listingId)
        await listings_col.update_one(
            {"_id": listing_oid},
            {"$inc": {"stock": -item_in.quantity}}
        )

    # 4) criar pedido
    now = now_utc()
    doc = {
        "userId": str(user_id),
        "status": "pending",
        "items": [i.model_dump() for i in order_items],
        "total": total,
        "shippingAddress": payload.shippingAddress,
        "notes": payload.notes,
        "createdAt": now,
        "updatedAt": now,
    }

    result = await orders_col.insert_one(doc)

    return OrderOut(
        id=str(result.inserted_id),
        userId=doc["userId"],
        status=doc["status"],
        items=order_items,
        total=total,
        shippingAddress=doc["shippingAddress"],
        notes=doc["notes"],
        createdAt=doc["createdAt"],
        updatedAt=doc["updatedAt"],
    )


# ===== GET /orders =====
@router.get("", response_model=List[OrderOut])
async def list_my_orders(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[OrderStatus] = Query(None, description="Filtrar por status"),
):
    orders_col = db["orders"]

    query = {"userId": str(user_id)}
    if status_filter:
        query["status"] = status_filter

    cursor = (
        orders_col
        .find(query)
        .sort("createdAt", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    docs = await cursor.to_list(length=limit)

    out: List[OrderOut] = []
    for d in docs:
        out.append(
            OrderOut(
                id=str(d["_id"]),
                userId=d["userId"],
                status=d["status"],
                items=[OrderItemOut(**item) for item in d.get("items", [])],
                total=float(d.get("total", 0)),
                shippingAddress=d.get("shippingAddress"),
                notes=d.get("notes"),
                createdAt=d["createdAt"],
                updatedAt=d["updatedAt"],
            )
        )
    return out


# ===== GET /orders/{order_id} =====
@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: Annotated[str, Path(..., description="ID do pedido (ObjectId).")],
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    orders_col = db["orders"]
    oid = to_object_id_or_400(order_id, "order_id")

    doc = await orders_col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    if str(doc["userId"]) != str(user_id):
        raise HTTPException(status_code=403, detail="Você não pode ver o pedido de outro usuário")

    return OrderOut(
        id=str(doc["_id"]),
        userId=doc["userId"],
        status=doc["status"],
        items=[OrderItemOut(**item) for item in doc.get("items", [])],
        total=float(doc.get("total", 0)),
        shippingAddress=doc.get("shippingAddress"),
        notes=doc.get("notes"),
        createdAt=doc["createdAt"],
        updatedAt=doc["updatedAt"],
    )


# ===== PATCH /orders/{order_id}/status =====
# simples: só deixa o próprio usuário cancelar o pedido
@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: Annotated[str, Path(..., description="ID do pedido (ObjectId).")],
    new_status: OrderStatus,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    orders_col = db["orders"]
    oid = to_object_id_or_400(order_id, "order_id")

    doc = await orders_col.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    # regra simples: o cliente só pode cancelar o próprio pedido
    if str(doc["userId"]) != str(user_id):
        raise HTTPException(status_code=403, detail="Você não pode alterar pedido de outro usuário")

    if new_status != "cancelled":
        raise HTTPException(status_code=400, detail="No momento só é permitido cancelar o pedido")

    await orders_col.update_one(
        {"_id": oid},
        {"$set": {"status": new_status, "updatedAt": now_utc()}}
    )

    updated = await orders_col.find_one({"_id": oid})
    return OrderOut(
        id=str(updated["_id"]),
        userId=updated["userId"],
        status=updated["status"],
        items=[OrderItemOut(**item) for item in updated.get("items", [])],
        total=float(updated.get("total", 0)),
        shippingAddress=updated.get("shippingAddress"),
        notes=updated.get("notes"),
        createdAt=updated["createdAt"],
        updatedAt=updated["updatedAt"],
    )
