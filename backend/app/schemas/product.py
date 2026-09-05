from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class SpecificationItem(BaseModel):
    label: str
    values: Dict[str, Any]

class ProductImage(BaseModel):
    media_id: Optional[str] = None
    url: str
    alt: Optional[str] = ""

class SEOData(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    keywords: Optional[List[str]] = []
    og_image: Optional[str] = ""
    canonical_url: Optional[str] = ""
    no_index: Optional[bool] = False

class CategoryEmbedded(BaseModel):
    id: str
    name: str
    slug: str

class ProductBase(BaseModel):
    code: str
    name: str
    slug: Optional[str] = None
    category_id: str
    short_description: Optional[str] = ""
    description: str
    features: List[str] = []
    specifications: List[SpecificationItem] = []
    images: List[ProductImage] = []
    applications: List[str] = []
    documents: List[Dict[str, str]] = []
    featured: bool = False
    display_order: int = 0
    status: str = "draft"  # draft, published, archived
    seo: Optional[SEOData] = Field(default_factory=SEOData)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    category_id: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[List[SpecificationItem]] = None
    images: Optional[List[ProductImage]] = None
    applications: Optional[List[str]] = None
    documents: Optional[List[Dict[str, str]]] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None
    status: Optional[str] = None
    seo: Optional[SEOData] = None

class ProductResponse(BaseModel):
    id: str
    code: str
    name: str
    slug: str
    category_id: str
    category: Optional[CategoryEmbedded] = None
    short_description: Optional[str] = ""
    description: str
    features: List[str] = []
    specifications: List[SpecificationItem] = []
    images: List[ProductImage] = []
    applications: List[str] = []
    documents: List[Dict[str, str]] = []
    featured: bool = False
    display_order: int = 0
    status: str = "draft"
    seo: Optional[SEOData] = Field(default_factory=SEOData)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ProductReorderItem(BaseModel):
    id: str
    display_order: int

class ProductReorderRequest(BaseModel):
    items: List[ProductReorderItem]
