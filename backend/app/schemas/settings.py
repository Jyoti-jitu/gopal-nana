from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, Field
from app.schemas.product import SEOData

class SocialLinks(BaseModel):
    linkedin: Optional[str] = ""
    facebook: Optional[str] = ""
    youtube: Optional[str] = ""
    twitter: Optional[str] = ""
    instagram: Optional[str] = ""
    whatsapp: Optional[str] = ""

class FooterConfig(BaseModel):
    description: Optional[str] = ""
    copyright_text: Optional[str] = ""
    powered_by: Optional[str] = ""

class WebsiteSettingsBase(BaseModel):
    site_name: str = "FORECAST EARTHINGS PVT. LTD."
    tagline: str = "Grounded for a Safer World"
    motto: str = "Chalo Banaye Behtar Bharat"
    logo_media_id: Optional[str] = None
    logo_url: Optional[str] = ""
    favicon_media_id: Optional[str] = None
    favicon_url: Optional[str] = ""
    primary_email: str = "sales@forecastearthings.com"
    primary_phone: str = "+91 7978206652"
    secondary_phone: Optional[str] = "+91 9658264263"
    social_links: SocialLinks = Field(default_factory=SocialLinks)
    footer: FooterConfig = Field(default_factory=FooterConfig)
    seo: SEOData = Field(default_factory=SEOData)

class WebsiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    tagline: Optional[str] = None
    motto: Optional[str] = None
    logo_media_id: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_media_id: Optional[str] = None
    favicon_url: Optional[str] = None
    primary_email: Optional[str] = None
    primary_phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    social_links: Optional[SocialLinks] = None
    footer: Optional[FooterConfig] = None
    seo: Optional[SEOData] = None

class WebsiteSettingsResponse(WebsiteSettingsBase):
    id: str
    updated_at: Optional[datetime] = None
