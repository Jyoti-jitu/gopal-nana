from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = ""
    subject: Optional[str] = ""
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    message: str

class EnquiryStatusUpdate(BaseModel):
    status: str  # new, contacted, in_progress, resolved, spam
    notes: Optional[str] = None

class EnquiryResponse(EnquiryCreate):
    id: str
    status: str = "new"
    notes: Optional[str] = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
