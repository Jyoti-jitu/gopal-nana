from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.section import SectionCreate, SectionUpdate
from app.services.page_service import PageService
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/sections", tags=["Admin Sections"])

@router.post("", summary="Create Dynamic Section")
async def create_section(
    body: SectionCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = await PageService.create_section(db, body)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Section")
@router.patch("/{id}", summary="Update Section Partial")
async def update_section(
    id: str,
    body: SectionUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = await PageService.update_section(db, id, body)
    return {"success": True, "data": doc}

@router.delete("/{id}", summary="Delete Section")
async def delete_section(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid section ID")
    res = await db.sections.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Section", id)
    return {"success": True, "message": "Section deleted"}
