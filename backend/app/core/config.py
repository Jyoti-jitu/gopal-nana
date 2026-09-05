import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Forecast Earthings CMS API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DATABASE: str = "forecast_earthings"
    
    # JWT Auth
    JWT_SECRET_KEY: str = "forecast_earthings_enterprise_cms_jwt_secret_key_2026_super_secure_min_32_bytes"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 600
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["http://localhost:3000"]
        
    # Media Storage
    MEDIA_STORAGE_TYPE: str = "cloudinary"
    MEDIA_BASE_URL: str = "http://localhost:8000/media"
    MEDIA_UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str = "bctl2gxd"
    CLOUDINARY_API_KEY: str = "214629581935829"
    CLOUDINARY_API_SECRET: str = "SKAdrjwseUB0v-jLFIqeX0sb-Vs"
    CLOUDINARY_URL: str = "cloudinary://214629581935829:SKAdrjwseUB0v-jLFIqeX0sb-Vs@bctl2gxd"
    CLOUDINARY_FOLDER: str = "forecast_earthings"
    
    # Admin Credentials for Seeding
    ADMIN_EMAIL: str = "admin@forecastearthings.com"
    ADMIN_PASSWORD: str = "Admin@Forecast2026!"
    
    # Next.js Revalidation Webhook
    NEXT_PUBLIC_REVALIDATION_URL: str = "http://localhost:3000/api/revalidate"
    REVALIDATION_SECRET: str = "forecast_revalidate_secret_2026"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
