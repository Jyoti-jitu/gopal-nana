from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class InstallationStepBase(BaseModel):
    step_number: int
    title: str
    description: str
    image_id: Optional[str] = None
    image_url: Optional[str] = ""
    enabled: bool = True
    display_order: int = 1

class InstallationStepCreate(InstallationStepBase):
    pass

class InstallationStepUpdate(BaseModel):
    step_number: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image_id: Optional[str] = None
    image_url: Optional[str] = None
    enabled: Optional[bool] = None
    display_order: Optional[int] = None

class InstallationStepResponse(InstallationStepBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class InstallationReorderItem(BaseModel):
    id: str
    display_order: int

class InstallationReorderRequest(BaseModel):
    items: list[InstallationReorderItem]
