from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class NavigationItem(BaseModel):
    label: str
    url: str
    enabled: bool = True
    display_order: int = 1
    target_blank: bool = False
    children: Optional[List["NavigationItem"]] = []

class NavigationMenuBase(BaseModel):
    location: str  # header, footer, mobile
    items: List[NavigationItem] = []

class NavigationMenuCreate(NavigationMenuBase):
    pass

class NavigationMenuUpdate(BaseModel):
    items: List[NavigationItem]

class NavigationMenuResponse(NavigationMenuBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
