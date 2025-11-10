from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, users
from app.routers.anuncios import listings
from app.routers import favorites
from app.routers import orders
from app.db.mongo import get_db

# --- helpers ---
def norm_prefix(p: str) -> str:
    """Garante prefixo começando com / e sem / final (exceto raiz)."""
    if not p:
        return ""
    p = p.strip()
    if not p.startswith("/"):
        p = "/" + p
    if len(p) > 1 and p.endswith("/"):
        p = p[:-1]
    return p

API_PREFIX = norm_prefix(settings.API_PREFIX)
MEDIA_DIR = getattr(settings, "MEDIA_DIR", "media")

app = FastAPI(
    title="APP API",
    openapi_url=f"{API_PREFIX}/openapi.json" if API_PREFIX else "/openapi.json",
)

# CORS (ajuste em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    # índices e pasta de mídia
    db = await get_db()
    await db["users"].create_index("email", unique=True)

    import os
    os.makedirs(MEDIA_DIR, exist_ok=True)

# --- servir /media ---
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")

# --- rotas com prefixo ---
api = APIRouter(prefix=API_PREFIX)  # ex: "/api" ou ""
api.include_router(auth.router)     
api.include_router(users.router)    
api.include_router(listings.router) 
app.include_router(favorites.router)
app.include_router(orders.router)

# health simples
@api.get("/health")
async def health():
    return {"ok": True}

# registra o grupo /api
app.include_router(api)

# raiz sem prefixo (opcional)
@app.get("/")
async def root():
    return {"ok": True, "message": "API up"}
