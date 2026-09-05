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

    skip = (page - 1) * limit
    total = await db.audit_logs.count_documents(query)
    cursor = db.audit_logs.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)

    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)

    return {"success": True, "data": build_pagination_response(items, total, page, limit)}
