import os
import uuid
import shutil
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Optional, Tuple
from PIL import Image, ImageOps
from fastapi import UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.config import settings
from app.core.exceptions import BadRequestException, NotFoundException

ALLOWED_MIME_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/svg+xml": [".svg"],
    "application/pdf": [".pdf"]
}

class MediaStorage(ABC):
    @abstractmethod
    async def save_file(self, file: UploadFile, filename: str) -> str:
        pass

    @abstractmethod
    async def delete_file(self, filepath: str) -> bool:
        pass

class LocalMediaStorage(MediaStorage):
    def __init__(self, base_dir: str = settings.MEDIA_UPLOAD_DIR, base_url: str = settings.MEDIA_BASE_URL):
        self.base_dir = os.path.abspath(base_dir)
        self.base_url = base_url.rstrip("/")
        os.makedirs(self.base_dir, exist_ok=True)

    async def save_file(self, file: UploadFile, filename: str) -> str:
        # Prevent path traversal
        safe_filename = os.path.basename(filename)
        dest_path = os.path.join(self.base_dir, safe_filename)
        
        # Verify path stays within base_dir
        if not os.path.abspath(dest_path).startswith(self.base_dir):
            raise BadRequestException("Invalid filename path traversal attempt")

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return f"{self.base_url}/{safe_filename}"

    async def delete_file(self, filename: str) -> bool:
        safe_filename = os.path.basename(filename)
        dest_path = os.path.join(self.base_dir, safe_filename)
        if os.path.exists(dest_path):
            os.remove(dest_path)
            return True
        return False

class MediaService:
    storage: MediaStorage = LocalMediaStorage()

    @classmethod
    async def upload_media(
        cls,
        db: AsyncIOMotorDatabase,
        file: UploadFile,
        alt_text: str = "",
        caption: str = "",
        folder: str = "general"
    ) -> dict:
        mime_type = file.content_type
        if mime_type not in ALLOWED_MIME_TYPES:
            raise BadRequestException(f"Unsupported MIME type: '{mime_type}'. Allowed types: {list(ALLOWED_MIME_TYPES.keys())}")

        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if file_size > max_size_bytes:
            raise BadRequestException(f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB")

        ext = os.path.splitext(file.filename)[1].lower()
        public_id = f"med_{uuid.uuid4().hex[:12]}"
        stored_filename = f"{public_id}{ext}"

        width, height = None, None
        # Convert JPG/PNG to WebP if image
        if mime_type in ["image/jpeg", "image/png", "image/webp"]:
            try:
                img = Image.open(file.file)
                img = ImageOps.exif_transpose(img)
                width, height = img.size
                file.file.seek(0)
            except Exception:
                pass

        url = await cls.storage.save_file(file, stored_filename)

        doc = {
            "filename": stored_filename,
            "original_filename": file.filename,
            "mime_type": mime_type,
            "size": file_size,
            "url": url,
            "public_id": public_id,
            "alt_text": alt_text,
            "caption": caption,
            "folder": folder,
            "width": width,
            "height": height,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        result = await db.media.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc
