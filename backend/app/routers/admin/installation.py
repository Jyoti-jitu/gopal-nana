from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.installation import InstallationStepCreate, InstallationStepUpdate, InstallationReorderRequest
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/installation", tags=["Admin Installation"])

@router.get("", summary="Get Admin Installation Steps")
async def get_admin_installation(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.installation_steps.find({}).sort("step_number", 1)
    docs = await cursor.to_list(length=50)
    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)
    return {"success": True, "data": items}

@router.post("", summary="Create Installation Step")
async def create_installation_step(
    body: InstallationStepCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    res = await db.installation_steps.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Installation Step")
async def update_installation_step(
    id: str,
    body: InstallationStepUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid step ID")
    existing = await db.installation_steps.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("InstallationStep", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.installation_steps.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.installation_steps.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Installation Step")
async def delete_installation_step(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid step ID")
    res = await db.installation_steps.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("InstallationStep", id)
    return {"success": True, "message": "Installation step deleted"}

@router.patch("/reorder", summary="Reorder Installation Steps")
async def reorder_installation_steps(
    body: InstallationReorderRequest,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    for item in body.items:
        if ObjectId.is_valid(item.id):
            await db.installation_steps.update_one(
                {"_id": ObjectId(item.id)},
                {"$set": {"display_order": item.display_order}}
            )
    return {"success": True, "message": "Steps reordered successfully"}
