from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.section import SectionResponse
from app.schemas.product import SEOData

class PageBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = ""
    status: str = "draft"  # draft, published, archived
    seo: Optional[SEOData] = Field(default_factory=SEOData)

class PageCreate(PageBase):
    sections: Optional[List[str]] = []

class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    seo: Optional[SEOData] = None
    sections: Optional[List[str]] = None

class PageResponse(PageBase):
    id: str
    sections: List[SectionResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
