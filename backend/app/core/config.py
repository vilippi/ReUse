from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
from typing import List

class Settings(BaseSettings):
    MONGODB_URI: str
    MONGO_DB_NAME: str = "appdb"
    JWT_SECRET: str
    JWT_EXPIRES_MIN: int = 60
    API_PREFIX: str = "/api"
    CORS_ORIGINS: List[AnyHttpUrl] | List[str] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def split_csv(cls, v):
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        return v

    model_config = {"env_file": ".env", "case_sensitive": True}

settings = Settings()
