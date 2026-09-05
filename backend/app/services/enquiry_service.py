from datetime import datetime, timezone
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.exceptions import NotFoundException, BadRequestException
from app.schemas.enquiry import EnquiryCreate, EnquiryStatusUpdate
from app.utils.pagination import build_pagination_response

class EnquiryService:
    @staticmethod
    async def create_enquiry(db: AsyncIOMotorDatabase, data: EnquiryCreate) -> dict:
        doc = data.model_dump()
        doc["status"] = "new"
        doc["notes"] = ""
        doc["created_at"] = datetime.now(timezone.utc)
        doc["updated_at"] = datetime.now(timezone.utc)

        res = await db.enquiries.insert_one(doc)
        doc["id"] = str(res.inserted_id)
        doc.pop("_id", None)
        return doc

    @staticmethod
    async def get_enquiries(
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> dict:
        query = {}
        if status:
            query["status"] = status
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"company": {"$regex": search, "$options": "i"}},
                {"subject": {"$regex": search, "$options": "i"}}
            ]

        skip = (page - 1) * limit
        total = await db.enquiries.count_documents(query)
        cursor = db.enquiries.find(query).sort("created_at", -1).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)

        items = []
        for doc in docs:
            doc["id"] = str(doc.pop("_id"))
            items.append(doc)

        return build_pagination_response(items, total, page, limit)

    @staticmethod
    async def update_enquiry_status(db: AsyncIOMotorDatabase, enquiry_id: str, data: EnquiryStatusUpdate) -> dict:
        if not ObjectId.is_valid(enquiry_id):
            raise BadRequestException("Invalid enquiry_id format")

        existing = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
        if not existing:
            raise NotFoundException("Enquiry", enquiry_id)

        update_dict = {"status": data.status, "updated_at": datetime.now(timezone.utc)}
        if data.notes is not None:
            update_dict["notes"] = data.notes

        await db.enquiries.update_one({"_id": ObjectId(enquiry_id)}, {"$set": update_dict})
        updated = await db.enquiries.find_one({"_id": ObjectId(enquiry_id)})
        updated["id"] = str(updated.pop("_id"))
        return updated
