from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    name: str
    slug: Optional[str] = None
    description: Optional[str] = ""
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None

class CategoryResponse(CategoryBase):
    id: str
    slug: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
