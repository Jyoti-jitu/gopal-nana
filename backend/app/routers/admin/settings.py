from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.dependencies.auth import require_admin, require_editor
from app.dependencies.database import get_db
from app.schemas.settings import WebsiteSettingsUpdate
from app.services.audit_service import AuditService

router = APIRouter(prefix="/admin/settings", tags=["Admin Settings"])

@router.get("", summary="Get Site Settings")
async def get_admin_settings(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = await db.settings.find_one({})
    if not doc:
        return {"success": True, "data": {}}
    doc["id"] = str(doc.pop("_id"))
    return {"success": True, "data": doc}

@router.put("", summary="Update Site Settings (Singleton)")
async def update_admin_settings(
    body: WebsiteSettingsUpdate,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)

    existing = await db.settings.find_one({})
    if existing:
        await db.settings.update_one({"_id": existing["_id"]}, {"$set": update_dict})
        updated = await db.settings.find_one({"_id": existing["_id"]})
    else:
        res = await db.settings.insert_one(update_dict)
        updated = await db.settings.find_one({"_id": res.inserted_id})

    updated["id"] = str(updated.pop("_id"))
    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="UPDATE", entity_type="settings", entity_id=updated["id"]
    )
    return {"success": True, "data": updated}
