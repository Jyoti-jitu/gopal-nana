from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.core.exceptions import NotFoundException, BadRequestException
from app.schemas.product import ProductCreate, ProductUpdate
from app.utils.slug import slugify
from app.utils.pagination import build_pagination_response

class ProductService:
    @staticmethod
    async def format_product(db: AsyncIOMotorDatabase, doc: dict) -> dict:
        doc["id"] = str(doc.pop("_id"))
        category_id = doc.get("category_id")
        if category_id and ObjectId.is_valid(category_id):
            cat = await db.categories.find_one({"_id": ObjectId(category_id)})
            if cat:
                doc["category"] = {
                    "id": str(cat["_id"]),
                    "name": cat["name"],
                    "slug": cat["slug"]
                }
        return doc

    @classmethod
    async def create_product(cls, db: AsyncIOMotorDatabase, data: ProductCreate) -> dict:
        # Verify code uniqueness
        existing_code = await db.products.find_one({"code": data.code})
        if existing_code:
            raise BadRequestException(f"Product with code '{data.code}' already exists")

        # Generate slug
        slug = data.slug or slugify(data.name)
        existing_slug = await db.products.find_one({"slug": slug})
        if existing_slug:
            slug = f"{slug}-{data.code.lower()}"

        # Verify category
        if ObjectId.is_valid(data.category_id):
            cat = await db.categories.find_one({"_id": ObjectId(data.category_id)})
            if not cat:
                raise NotFoundException("Category", data.category_id)
        else:
            raise BadRequestException("Invalid category_id format")

        doc = data.model_dump()
        doc["slug"] = slug
        doc["created_at"] = datetime.now(timezone.utc)
        doc["updated_at"] = datetime.now(timezone.utc)

        res = await db.products.insert_one(doc)
        doc["_id"] = res.inserted_id
        return await cls.format_product(db, doc)

    @classmethod
    async def get_products(
        cls,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        limit: int = 12,
        category_slug: Optional[str] = None,
        featured: Optional[bool] = None,
        search: Optional[str] = None,
        status: Optional[str] = "published",
        sort_by: str = "display_order",
        order: str = "asc"
    ) -> dict:
        query: Dict[str, Any] = {}
        if status:
            query["status"] = status

        if featured is not None:
            query["featured"] = featured

        if category_slug:
            cat = await db.categories.find_one({"slug": category_slug})
            if cat:
                query["category_id"] = str(cat["_id"])
            else:
                return build_pagination_response([], 0, page, limit)

        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"code": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        sort_dir = 1 if order.lower() == "asc" else -1
        skip = (page - 1) * limit

        total = await db.products.count_documents(query)
        cursor = db.products.find(query).sort(sort_by, sort_dir).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)

        formatted_items = []
        for doc in docs:
            formatted_items.append(await cls.format_product(db, doc))

        return build_pagination_response(formatted_items, total, page, limit)

    @classmethod
    async def get_product_by_slug(cls, db: AsyncIOMotorDatabase, slug: str, public_only: bool = True) -> dict:
        query = {"slug": slug}
        if public_only:
            query["status"] = "published"

        doc = await db.products.find_one(query)
        if not doc:
            raise NotFoundException("Product", slug)
        return await cls.format_product(db, doc)

    @classmethod
    async def update_product(cls, db: AsyncIOMotorDatabase, product_id: str, data: ProductUpdate) -> dict:
        if not ObjectId.is_valid(product_id):
            raise BadRequestException("Invalid product_id format")

        existing = await db.products.find_one({"_id": ObjectId(product_id)})
        if not existing:
            raise NotFoundException("Product", product_id)

        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        if "name" in update_dict and "slug" not in update_dict:
            update_dict["slug"] = slugify(update_dict["name"])

        update_dict["updated_at"] = datetime.now(timezone.utc)

        await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_dict})
        updated_doc = await db.products.find_one({"_id": ObjectId(product_id)})
        return await cls.format_product(db, updated_doc)

    @classmethod
    async def delete_product(cls, db: AsyncIOMotorDatabase, product_id: str, soft_delete: bool = True) -> bool:
        if not ObjectId.is_valid(product_id):
            raise BadRequestException("Invalid product_id format")

        if soft_delete:
            res = await db.products.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": {"status": "archived", "deleted_at": datetime.now(timezone.utc)}}
            )
            return res.modified_count > 0
        else:
            res = await db.products.delete_one({"_id": ObjectId(product_id)})
            return res.deleted_count > 0
