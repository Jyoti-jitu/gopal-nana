from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.page import PageCreate, PageUpdate
from app.services.page_service import PageService
from app.services.audit_service import AuditService
from app.services.publishing_service import PublishingService
from app.core.exceptions import NotFoundException, BadRequestException
from app.utils.slug import slugify

router = APIRouter(prefix="/admin/pages", tags=["Admin Pages"])

@router.get("", summary="List Admin Pages")
async def list_pages(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.pages.find({}).sort("title", 1)
    pages = await cursor.to_list(length=100)
    items = []
    for p in pages:
        p["id"] = str(p.pop("_id"))
        items.append(p)
    return {"success": True, "data": items}

@router.post("", summary="Create Page")
async def create_page(
    body: PageCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    slug = body.slug or slugify(body.title)
    existing = await db.pages.find_one({"slug": slug})
    if existing:
        raise BadRequestException(f"Page with slug '{slug}' already exists")

    doc = body.model_dump()
    doc["slug"] = slug
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)

    res = await db.pages.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.get("/{id}", summary="Get Page by ID with Sections")
async def get_page_by_id(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid page ID")
    doc = await db.pages.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Page", id)

    doc["id"] = str(doc.pop("_id"))
    sections_cursor = db.sections.find({"page_id": doc["id"]}).sort("display_order", 1)
    secs = await sections_cursor.to_list(length=100)
    formatted_secs = []
    for s in secs:
        s["id"] = str(s.pop("_id"))
        formatted_secs.append(s)
    doc["sections"] = formatted_secs
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Page (Full)")
@router.patch("/{id}", summary="Update Page (Partial)")
async def update_page(
    id: str,
    body: PageUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid page ID")
    existing = await db.pages.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("Page", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    if "title" in update_dict and "slug" not in update_dict:
        update_dict["slug"] = slugify(update_dict["title"])
    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.pages.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.pages.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Page")
async def delete_page(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid page ID")
    res = await db.pages.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Page", id)
    return {"success": True, "message": "Page deleted"}

@router.post("/{id}/publish", summary="Publish Page")
async def publish_page(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid page ID")
    res = await db.pages.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "published", "updated_at": datetime.now(timezone.utc)}}
    )
    if res.matched_count == 0:
        raise NotFoundException("Page", id)
    page = await db.pages.find_one({"_id": ObjectId(id)})
    await PublishingService.trigger_nextjs_revalidation(slug=page["slug"], path=f"/{page['slug']}")
    return {"success": True, "message": "Page published successfully"}
