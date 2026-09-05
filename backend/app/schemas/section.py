from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class CTAButton(BaseModel):
    label: str
    url: str
    variant: Optional[str] = "primary"

class SectionBase(BaseModel):
    type: str  # hero, trust_strip, product_range, why_choose_us, earthing_intro, installation_preview, contact_cta, rich_text, image_text, statistics, testimonial_slider, custom_cta
    enabled: bool = True
    display_order: int = 1
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    content: Dict[str, Any] = {}
    media_id: Optional[str] = None
    media_url: Optional[str] = ""
    cta: Optional[CTAButton] = None
    background_config: Dict[str, Any] = {}
    status: str = "published"

class SectionCreate(SectionBase):
    page_id: Optional[str] = None

class SectionUpdate(BaseModel):
    type: Optional[str] = None
    enabled: Optional[bool] = None
    display_order: Optional[int] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    media_id: Optional[str] = None
    media_url: Optional[str] = None
    cta: Optional[CTAButton] = None
    background_config: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class SectionResponse(SectionBase):
    id: str
    page_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
