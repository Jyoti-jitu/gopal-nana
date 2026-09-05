from datetime import datetime, timezone
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.exceptions import NotFoundException, BadRequestException
from app.schemas.page import PageCreate, PageUpdate
from app.schemas.section import SectionCreate, SectionUpdate
from app.utils.slug import slugify

class PageService:
    @staticmethod
    async def get_page_with_sections(db: AsyncIOMotorDatabase, slug: str, public_only: bool = True) -> dict:
        query = {"slug": slug}
        if public_only:
            query["status"] = "published"

        page = await db.pages.find_one(query)
        if not page:
            raise NotFoundException("Page", slug)

        page_id_str = str(page["_id"])
        
        section_query = {"page_id": page_id_str, "enabled": True}
        if public_only:
            section_query["status"] = "published"

        sections_cursor = db.sections.find(section_query).sort("display_order", 1)
        sections = await sections_cursor.to_list(length=100)

        formatted_sections = []
        for sec in sections:
            sec["id"] = str(sec.pop("_id"))
            formatted_sections.append(sec)

        page["id"] = str(page.pop("_id"))
        page["sections"] = formatted_sections
        return page

    @staticmethod
    async def create_section(db: AsyncIOMotorDatabase, data: SectionCreate) -> dict:
        doc = data.model_dump()
        doc["created_at"] = datetime.now(timezone.utc)
        doc["updated_at"] = datetime.now(timezone.utc)
        res = await db.sections.insert_one(doc)
        doc["id"] = str(res.inserted_id)
        doc.pop("_id", None)
        return doc

    @staticmethod
    async def update_section(db: AsyncIOMotorDatabase, section_id: str, data: SectionUpdate) -> dict:
        if not ObjectId.is_valid(section_id):
            raise BadRequestException("Invalid section_id format")

        existing = await db.sections.find_one({"_id": ObjectId(section_id)})
        if not existing:
            raise NotFoundException("Section", section_id)

        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        update_dict["updated_at"] = datetime.now(timezone.utc)

        await db.sections.update_one({"_id": ObjectId(section_id)}, {"$set": update_dict})
        updated = await db.sections.find_one({"_id": ObjectId(section_id)})
        updated["id"] = str(updated.pop("_id"))
        return updated
