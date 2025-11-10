# app/routers/favorites.py
from typing import Annotated, List
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Path, Query
from bson import ObjectId

from app.db.mongo import get_db
from app.core.deps import get_current_user_id
from app.models.favorite import FavoriteIn, FavoriteOut

router = APIRouter(prefix="/favorites", tags=["Favorites"])


# ===== utils =====
def now_utc():
    return datetime.now(timezone.utc)


def to_object_id_or_400(value: str, field_name: str = "id") -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail=f"{field_name} inválido")
    return ObjectId(value)


# ===== POST /favorites =====
@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    payload: FavoriteIn,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    favorites = db["favorites"]
    listings = db["listings"]

    listing_oid = to_object_id_or_400(payload.listingId, "listingId")

    # 1) checar se o anúncio existe
    listing_doc = await listings.find_one({"_id": listing_oid})
    if not listing_doc:
        raise HTTPException(status_code=404, detail="Anúncio não encontrado")

    # userId pode ter sido salvo como string ou ObjectId em outras coleções,
    # mas aqui vamos manter string para simplificar
    user_key = str(user_id)

    # 2) evitar duplicado
    existing = await favorites.find_one({
        "userId": user_key,
        "listingId": listing_oid,
    })
    if existing:
        # podemos devolver o já existente
        return FavoriteOut(
            id=str(existing["_id"]),
            listingId=str(existing["listingId"]),
            userId=existing["userId"],
            createdAt=existing["createdAt"],
        )

    doc = {
        "userId": user_key,
        "listingId": listing_oid,
        "createdAt": now_utc(),
    }

    result = await favorites.insert_one(doc)

    return FavoriteOut(
        id=str(result.inserted_id),
        listingId=str(doc["listingId"]),
        userId=doc["userId"],
        createdAt=doc["createdAt"],
    )


# ===== GET /favorites =====
@router.get("", response_model=List[FavoriteOut])
async def list_favorites(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
):
    favorites = db["favorites"]

    # Vamos fazer um aggregate para já trazer dados do listing
    pipeline = [
        {"$match": {"userId": str(user_id)}},
        {"$sort": {"createdAt": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
        {
            "$lookup": {
                "from": "listings",
                "localField": "listingId",
                "foreignField": "_id",
                "as": "listing",
            }
        },
        {
            "$addFields": {
                "listing": {"$arrayElemAt": ["$listing", 0]}
            }
        },
        {
            "$project": {
                "_id": 1,
                "userId": 1,
                "listingId": 1,
                "createdAt": 1,
                # campos do listing
                "title": "$listing.title",
                "price": "$listing.price",
                "thumbnail": {"$arrayElemAt": ["$listing.images", 0]},
            }
        },
    ]

    docs = await favorites.aggregate(pipeline).to_list(length=limit)

    return [
        FavoriteOut(
            id=str(d["_id"]),
            listingId=str(d["listingId"]),
            userId=d["userId"],
            createdAt=d["createdAt"],
            title=d.get("title"),
            price=float(d["price"]) if d.get("price") is not None else None,
            thumbnail=d.get("thumbnail"),
        )
        for d in docs
    ]


# ===== DELETE /favorites/{favorite_id} =====
@router.delete("/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(
    favorite_id: Annotated[str, Path(..., description="ID do favorito (ObjectId).")],
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    favorites = db["favorites"]

    fav_oid = to_object_id_or_400(favorite_id, "favorite_id")

    doc = await favorites.find_one({"_id": fav_oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")

    if str(doc["userId"]) != str(user_id):
        raise HTTPException(status_code=403, detail="Você não pode remover o favorito de outro usuário")

    await favorites.delete_one({"_id": fav_oid})
    return None


# ===== DELETE /favorites/by-listing/{listing_id} =====
@router.delete("/by-listing/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite_by_listing(
    listing_id: Annotated[str, Path(..., description="ID do anúncio favoritado (ObjectId).")],
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    favorites = db["favorites"]
    listing_oid = to_object_id_or_400(listing_id, "listing_id")

    result = await favorites.delete_one({
        "userId": str(user_id),
        "listingId": listing_oid,
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")

    return None
