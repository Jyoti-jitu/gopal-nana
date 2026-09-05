from typing import Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.media import MediaUpdate
from app.services.media_service import MediaService
from app.services.audit_service import AuditService
from app.utils.pagination import build_pagination_response
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/media", tags=["Admin Media"])

@router.post("/upload", summary="Upload file / image to Media Library")
async def upload_media(
    file: UploadFile = File(...),
    alt_text: str = Form(""),
    caption: str = Form(""),
    folder: str = Form("general"),
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    media_doc = await MediaService.upload_media(db, file=file, alt_text=alt_text, caption=caption, folder=folder)
    media_doc["id"] = str(media_doc.pop("_id"))
    
    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="UPLOAD", entity_type="media", entity_id=media_doc["id"], changes={"filename": media_doc["filename"]}
    )
    return {"success": True, "data": media_doc}

@router.get("", summary="List / Search Media Library")
async def list_media(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    folder: Optional[str] = Query(None),
    mime_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {}
    if folder:
        query["folder"] = folder
    if mime_type:
        query["mime_type"] = mime_type
    if search:
        query["$or"] = [
            {"filename": {"$regex": search, "$options": "i"}},
            {"original_filename": {"$regex": search, "$options": "i"}},
            {"alt_text": {"$regex": search, "$options": "i"}}
        ]

    skip = (page - 1) * limit
    total = await db.media.count_documents(query)
    cursor = db.media.find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)

    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)

    return {"success": True, "data": build_pagination_response(items, total, page, limit)}

@router.get("/{id}", summary="Get Media Asset Metadata")
async def get_media(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid media ID")
    doc = await db.media.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Media", id)
    doc["id"] = str(doc.pop("_id"))
    return {"success": True, "data": doc}

@router.patch("/{id}", summary="Update Media Metadata (alt text, caption)")
async def update_media(
    id: str,
    body: MediaUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid media ID")
    existing = await db.media.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("Media", id)

    update_dict = {k: v for k, v in body.model_dump().items() if v is not None}
    await db.media.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.media.find_one({"_id": ObjectId(id)})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete Media File")
async def delete_media(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid media ID")
    doc = await db.media.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Media", id)

    await MediaService.storage.delete_file(doc["filename"])
    await db.media.delete_one({"_id": ObjectId(id)})

    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="DELETE_MEDIA", entity_type="media", entity_id=id, changes={"filename": doc["filename"]}
    )
    return {"success": True, "message": "Media asset deleted successfully"}
