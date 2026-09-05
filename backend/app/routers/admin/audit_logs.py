from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.auth import require_admin
from app.dependencies.database import get_db
from app.utils.pagination import build_pagination_response

router = APIRouter(prefix="/admin/audit-logs", tags=["Admin Audit Logs"])

@router.get("", summary="List / Search Audit Logs")
async def list_audit_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    action: Optional[str] = Query(None),
    entity_type: Optional[str] = Query(None),
    user_id: Optional[str] = Query(None),
    user: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {}
    if action:
        query["action"] = action
    if entity_type:
        query["entity_type"] = entity_type
    if user_id:
        query["user_id"] = user_id
    filter_user = user or search
    if filter_user:
        query["$or"] = [
            {"user_email": {"$regex": filter_user, "$options": "i"}},
            {"action": {"$regex": filter_user, "$options": "i"}},
            {"entity_type": {"$regex": filter_user, "$options": "i"}}
        ]

    skip = (page - 1) * limit
    total = await db.audit_logs.count_documents(query)
    cursor = db.audit_logs.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)

    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        if "created_at" in d and isinstance(d["created_at"], datetime):
            d["created_at"] = d["created_at"].isoformat()
            d["timestamp"] = d["created_at"]
        elif "created_at" in d:
            d["timestamp"] = str(d["created_at"])
        if "entity_type" in d:
            d["entity"] = d["entity_type"]
        items.append(d)

    return {"success": True, "data": build_pagination_response(items, total, page, limit)}
