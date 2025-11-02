# app/routers/anuncios/listings.py
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from bson import ObjectId
from datetime import datetime, timezone

from app.models.listing import ListingIn, ListingOut, ListingUpdate
from app.db.mongo import get_db
from app.core.deps import get_current_user_id

router = APIRouter(prefix="/listings", tags=["Listings"])


# POST
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
    
    
# GET
@router.get("", response_model=List[ListingOut])
async def list_listings(
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
    q: Optional[str] = Query(None, description="Busca por título/descrição (case-insensitive)"),
    categoryId: Optional[str] = Query(None, description="ObjectId da categoria"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    listings = db["listings"]

    # Excluir anúncios do usuário atual (cobre sellerId salvo como string e/ou ObjectId)
    exclude_vals = [user_id]
    if ObjectId.is_valid(user_id):
        exclude_vals.append(ObjectId(user_id))

    pipeline = [
        {"$match": {"sellerId": {"$nin": exclude_vals}}},
    ]

    # Busca por texto em title/description
    if q:
        pipeline.append({
            "$match": {
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"description": {"$regex": q, "$options": "i"}},
                ]
            }
        })

    # Filtro por categoria (aceita string ou ObjectId válido)
    if categoryId:
        match_cat = ObjectId(categoryId) if ObjectId.is_valid(categoryId) else categoryId
        pipeline.append({"$match": {"categoryId": match_cat}})

    # Lookup nos usuários para obter o nome do vendedor (full_name)
    pipeline += [
        {
            "$lookup": {
                "from": "users",
                "let": {"sid": "$sellerId"},
                "pipeline": [
                    {"$match": {"$expr": {
                        "$or": [
                            {"$eq": ["$_id", "$$sid"]},   # quando sellerId é ObjectId e users._id também
                            {"$eq": ["$id", "$$sid"]},    # quando users.id (string) = sellerId (string)
                        ]
                    }}},
                    {"$project": {"_id": 0, "full_name": 1}}
                ],
                "as": "seller"
            }
        },
        {
            "$addFields": {
                "sellerName": {
                    "$ifNull": [
                        {"$arrayElemAt": ["$seller.full_name", 0]},
                        None
                    ]
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "title": 1,
                "description": 1,
                "price": 1,
                "stock": 1,
                "categoryId": 1,
                "images": 1,
                "status": 1,
                "sellerName": 1,
                "createdAt": 1
            }
        },
        {"$sort": {"createdAt": -1}},
        {"$skip": (page - 1) * limit},
        {"$limit": limit},
    ]

    docs = await listings.aggregate(pipeline).to_list(length=limit)

    return [
        ListingOut(
            id=str(d["_id"]),
            title=d.get("title", ""),
            description=d.get("description", ""),
            price=float(d.get("price", 0)),
            stock=int(d.get("stock", 0)),
            categoryId=str(d.get("categoryId")) if d.get("categoryId") is not None else "",
            images=[str(u) for u in (d.get("images") or [])],
            status=d.get("status", "active"),
            sellerName=d.get("sellerName"),
        )
        for d in docs
    ]
    
# PATCH

@router.patch("/{listing_id}", response_model=ListingOut)
async def update_listing(
    listing_id: Annotated[str, Path(..., description="ID do anúncio (ObjectId)")],
    payload: ListingUpdate,
    user_id: Annotated[str, Depends(get_current_user_id)],
    db = Depends(get_db),
):
    listings = db["listings"]

    # 1) validar id
    if not ObjectId.is_valid(listing_id):
        raise HTTPException(status_code=400, detail="listing_id inválido")

    _id = ObjectId(listing_id)

    # 2) buscar anúncio e checar propriedade
    doc = await listings.find_one({"_id": _id})
    if not doc:
        raise HTTPException(status_code=404, detail="Anúncio não encontrado")

    # sellerId pode estar salvo como ObjectId ou string — precisamos comparar com ambos
    is_owner = False
    if "sellerId" in doc:
        if isinstance(doc["sellerId"], ObjectId) and ObjectId.is_valid(user_id):
            is_owner = (doc["sellerId"] == ObjectId(user_id))
        # também cobre caso sellerId seja string ou user_id não seja ObjectId
        is_owner = is_owner or (str(doc["sellerId"]) == str(user_id))

    if not is_owner:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este anúncio")

    # 3) construir update set
    to_set = {"updatedAt": datetime.now(timezone.utc)}
    if payload.title is not None:
        to_set["title"] = payload.title
    if payload.description is not None:
        to_set["description"] = payload.description
    if payload.price is not None:
        to_set["price"] = float(payload.price)
    if payload.stock is not None:
        to_set["stock"] = int(payload.stock)
    if payload.images is not None:
        to_set["images"] = [str(u) for u in payload.images]
    if payload.status is not None:
        to_set["status"] = payload.status
    if payload.categoryId is not None:
        if not ObjectId.is_valid(payload.categoryId):
            raise HTTPException(status_code=400, detail="categoryId inválido")
        to_set["categoryId"] = ObjectId(payload.categoryId)

    try:
        await listings.update_one({"_id": _id}, {"$set": to_set})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar: {e}")

    # 4) retornar no formato ListingOut
    updated = await listings.find_one({"_id": _id})
    return ListingOut(
        id=str(updated["_id"]),
        title=updated.get("title", ""),
        description=updated.get("description", ""),
        price=float(updated.get("price", 0)),
        stock=int(updated.get("stock", 0)),
        categoryId=str(updated.get("categoryId")) if updated.get("categoryId") is not None else "",
        images=[str(u) for u in (updated.get("images") or [])],
        status=updated.get("status", "active"),
        # sellerName é opcional no ListingOut; no PATCH não fazemos lookup — mantém None
    )