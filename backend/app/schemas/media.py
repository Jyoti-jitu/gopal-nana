from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class MediaBase(BaseModel):
    filename: str
    original_filename: str
    mime_type: str
    size: int
    url: str
    public_id: Optional[str] = ""
    alt_text: Optional[str] = ""
    caption: Optional[str] = ""
    folder: Optional[str] = "general"
    width: Optional[int] = None
    height: Optional[int] = None

class MediaUpdate(BaseModel):
    alt_text: Optional[str] = None
    caption: Optional[str] = None
    folder: Optional[str] = None

class MediaResponse(MediaBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
