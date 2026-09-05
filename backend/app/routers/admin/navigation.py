from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.navigation import NavigationMenuCreate, NavigationMenuUpdate
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/navigation", tags=["Admin Navigation"])

@router.get("", summary="Get Admin Navigation Menus")
async def list_navigation(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.navigation.find({})
    menus = await cursor.to_list(length=20)
    items = []
    for m in menus:
        m["id"] = str(m.pop("_id"))
        items.append(m)
    return {"success": True, "data": items}

@router.post("", summary="Create Navigation Menu")
async def create_navigation_menu(
    body: NavigationMenuCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing = await db.navigation.find_one({"location": body.location})
    if existing:
        raise BadRequestException(f"Menu for location '{body.location}' already exists. Use PUT to update.")

    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    res = await db.navigation.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Navigation Items")
async def update_navigation_menu(
    id: str,
    body: NavigationMenuUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid navigation menu ID")
    existing = await db.navigation.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("NavigationMenu", id)

    items_data = [i.model_dump() for i in body.items]
    await db.navigation.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"items": items_data, "updated_at": datetime.now(timezone.utc)}}
    )
    updated = await db.navigation.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Navigation Menu")
async def delete_navigation(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid navigation menu ID")
    res = await db.navigation.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("NavigationMenu", id)
    return {"success": True, "message": "Navigation menu deleted"}
