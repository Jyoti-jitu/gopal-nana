from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.office import OfficeCreate, OfficeUpdate
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/offices", tags=["Admin Offices"])

@router.get("", summary="Get Admin Office Locations")
async def list_offices(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.offices.find({}).sort("display_order", 1)
    docs = await cursor.to_list(length=20)
    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)
    return {"success": True, "data": items}

@router.post("", summary="Create Office Branch")
async def create_office(
    body: OfficeCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    res = await db.offices.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Office Details")
async def update_office(
    id: str,
    body: OfficeUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid office ID")
    existing = await db.offices.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("Office", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.offices.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.offices.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Office")
async def delete_office(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid office ID")
    res = await db.offices.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Office", id)
    return {"success": True, "message": "Office deleted"}
