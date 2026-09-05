from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel

class AuditLogResponse(BaseModel):
    id: str
    user_id: str
    user_email: Optional[str] = ""
    action: str  # LOGIN, CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH, UPLOAD, DELETE_MEDIA
    entity_type: str
    entity_id: Optional[str] = None
    changes: Optional[Dict[str, Any]] = {}
    ip_address: Optional[str] = ""
    user_agent: Optional[str] = ""
    created_at: datetime
