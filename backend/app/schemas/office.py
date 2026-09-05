from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class OfficeBase(BaseModel):
    name: str
    office_type: str  # corporate, regional
    address: str
    city: str
    state: str
    postal_code: str
    country: str = "India"
    phones: List[str] = []
    emails: List[str] = []
    map_url: Optional[str] = ""
    map_embed_url: Optional[str] = ""
    is_primary: bool = False
    enabled: bool = True
    display_order: int = 1

class OfficeCreate(OfficeBase):
    pass

class OfficeUpdate(BaseModel):
    name: Optional[str] = None
    office_type: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    phones: Optional[List[str]] = None
    emails: Optional[List[str]] = None
    map_url: Optional[str] = None
    map_embed_url: Optional[str] = None
    is_primary: Optional[bool] = None
    enabled: Optional[bool] = None
    display_order: Optional[int] = None

class OfficeResponse(OfficeBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
