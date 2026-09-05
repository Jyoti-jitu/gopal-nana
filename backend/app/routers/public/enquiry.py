from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.schemas.enquiry import EnquiryCreate
from app.services.enquiry_service import EnquiryService

router = APIRouter(prefix="/enquiries", tags=["Public Enquiries"])

@router.post("", summary="Submit a customer contact enquiry")
async def submit_enquiry(body: EnquiryCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = await EnquiryService.create_enquiry(db, body)
    return {"success": True, "data": doc, "message": "Enquiry submitted successfully"}
