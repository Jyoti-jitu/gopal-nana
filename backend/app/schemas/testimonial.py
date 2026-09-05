from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class TestimonialBase(BaseModel):
    name: str
    designation: Optional[str] = ""
    company: Optional[str] = ""
    content: str
    rating: int = 5
    photo: Optional[str] = ""
    enabled: bool = True
    featured: bool = False
    display_order: int = 1
    status: str = "published"  # draft, published, archived

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    photo: Optional[str] = None
    enabled: Optional[bool] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None
    status: Optional[str] = None

class TestimonialResponse(TestimonialBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
