from datetime import datetime, timezone
from typing import Any, Dict, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

class AuditService:
    @staticmethod
    async def log_action(
        db: AsyncIOMotorDatabase,
        user_id: str,
        user_email: str,
        action: str,
        entity_type: str,
        entity_id: Optional[str] = None,
        changes: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ):
        doc = {
            "user_id": user_id,
            "user_email": user_email,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "changes": changes or {},
            "ip_address": ip_address or "",
            "user_agent": user_agent or "",
            "created_at": datetime.now(timezone.utc)
        }
        await db.audit_logs.insert_one(doc)
