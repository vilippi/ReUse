# app/routers/anuncios/listings.py
from typing import Annotated, Union
from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone

from app.models.listing import ListingIn, ListingOut
from app.db.mongo import get_db
from app.core.deps import get_current_user_id

router = APIRouter(prefix="/listings", tags=["Listings"])

@router.post("", response_model=ListingOut, status_code=status.HTTP_201_CREATED)
async def create_listing(
    payload: ListingIn,
    user_id: Annotated[str, Depends(get_current_user_id)],  # << agora é string
    db = Depends(get_db),
):
    listings = db["listings"]

    # sellerId como ObjectId se válido; senão string
    seller_id = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id

    doc = {
        "title": payload.title,
        "description": payload.description,
        "price": float(payload.price),
        "stock": int(payload.stock),
        "categoryId": ObjectId(payload.categoryId),
        "images": list(map(str, payload.images)),
        "status": payload.status,
        "sellerId": seller_id,
        "createdAt": datetime.now(timezone.utc),
        "updatedAt": datetime.now(timezone.utc),
    }

    try:
        result = await listings.insert_one(doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao inserir anúncio: {e}")

    return ListingOut(
        id=str(result.inserted_id),
        title=doc["title"],
        description=doc["description"],
        price=doc["price"],
        stock=doc["stock"],
        categoryId=str(doc["categoryId"]),
        images=doc["images"],
        status=doc["status"],
    )
