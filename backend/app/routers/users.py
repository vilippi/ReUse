from fastapi import APIRouter, Depends, HTTPException, Query
from bson import ObjectId
from app.core.deps import get_db_dep, get_current_user_id
from app.schemas.user import UserPublic

router = APIRouter(prefix="/users", tags=["users"])

# Lista com paginação por cursor (ObjectId)
@router.get("", response_model=list[UserPublic])
async def list_users(
    db=Depends(get_db_dep),
    _=Depends(get_current_user_id),  # rota protegida
    limit: int = Query(20, ge=1, le=100),
    after_id: str | None = None
):
    col = db["users"]
    filt = {"_id": {"$gt": ObjectId(after_id)}} if after_id else {}
    cursor = col.find(filt).sort("_id", 1).limit(limit)
    items: list[UserPublic] = []
    async for doc in cursor:
        items.append(UserPublic(id=str(doc["_id"]), email=doc["email"], is_active=doc.get("is_active", True)))
    return items

@router.get("/me", response_model=UserPublic)
async def me(db=Depends(get_db_dep), user_id: str = Depends(get_current_user_id)):
    col = db["users"]
    doc = await col.find_one({"_id": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UserPublic(id=str(doc["_id"]), email=doc["email"], is_active=doc.get("is_active", True))
