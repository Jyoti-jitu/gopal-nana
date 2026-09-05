from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.utils.slug import slugify
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/categories", tags=["Admin Categories"])

@router.post("", summary="Create Product Category")
async def create_category(
    body: CategoryCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    slug = body.slug or slugify(body.name)
    existing = await db.categories.find_one({"slug": slug})
    if existing:
        raise BadRequestException(f"Category with slug '{slug}' already exists")

    doc = body.model_dump()
    doc["slug"] = slug
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)

    res = await db.categories.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.get("", summary="List Admin Categories")
async def list_categories(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.categories.find({}).sort("display_order", 1)
    cats = await cursor.to_list(length=100)
    items = []
    for c in cats:
        c["id"] = str(c.pop("_id"))
        items.append(c)
    return {"success": True, "data": items}

@router.get("/{id}", summary="Get Category by ID")
async def get_category(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid category ID")
    doc = await db.categories.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Category", id)
    doc["id"] = str(doc.pop("_id"))
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Category")
async def update_category(
    id: str,
    body: CategoryUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid category ID")
    existing = await db.categories.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("Category", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    if "name" in update_dict and "slug" not in update_dict:
        update_dict["slug"] = slugify(update_dict["name"])
    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.categories.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.categories.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Category")
async def delete_category(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid category ID")
    res = await db.categories.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Category", id)
    return {"success": True, "message": "Category deleted"}
