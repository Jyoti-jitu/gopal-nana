from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/testimonials", tags=["Admin Testimonials"])

@router.get("", summary="List Admin Testimonials")
async def list_testimonials(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.testimonials.find({}).sort("display_order", 1)
    docs = await cursor.to_list(length=200)
    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)
    return {"success": True, "data": items}

@router.post("", summary="Create Testimonial")
async def create_testimonial(
    body: TestimonialCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)
    res = await db.testimonials.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Testimonial")
async def update_testimonial(
    id: str,
    body: TestimonialUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid testimonial ID")
    existing = await db.testimonials.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("Testimonial", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.testimonials.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.testimonials.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Testimonial")
async def delete_testimonial(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid testimonial ID")
    res = await db.testimonials.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Testimonial", id)
    return {"success": True, "message": "Testimonial deleted"}
