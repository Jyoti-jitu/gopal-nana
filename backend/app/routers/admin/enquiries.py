from typing import Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.enquiry import EnquiryStatusUpdate
from app.services.enquiry_service import EnquiryService
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/enquiries", tags=["Admin Enquiries"])

@router.get("", summary="List / Search Customer Enquiries")
async def list_admin_enquiries(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await EnquiryService.get_enquiries(db, page=page, limit=limit, status=status, search=search)
    return {"success": True, "data": result}

@router.get("/{id}", summary="Get Enquiry Detail by ID")
async def get_enquiry(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid enquiry ID")
    doc = await db.enquiries.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Enquiry", id)
    doc["id"] = str(doc.pop("_id"))
    return {"success": True, "data": doc}

@router.patch("/{id}", summary="Update Enquiry Status (new, contacted, in_progress, resolved, spam)")
async def update_enquiry_status(
    id: str,
    body: EnquiryStatusUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    doc = await EnquiryService.update_enquiry_status(db, id, body)
    return {"success": True, "data": doc}

@router.delete("/{id}", summary="Delete Enquiry")
async def delete_enquiry(
    id: str,
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid enquiry ID")
    res = await db.enquiries.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("Enquiry", id)
    return {"success": True, "message": "Enquiry deleted"}
