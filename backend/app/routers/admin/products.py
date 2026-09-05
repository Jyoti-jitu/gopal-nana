from typing import Optional
from fastapi import APIRouter, Depends, Query, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime, timezone

from app.dependencies.auth import require_editor, require_admin
from app.dependencies.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductReorderRequest
from app.services.product_service import ProductService
from app.services.audit_service import AuditService
from app.services.publishing_service import PublishingService
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/products", tags=["Admin Products"])

@router.post("", summary="Create Product")
async def create_product(
    body: ProductCreate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    product = await ProductService.create_product(db, body)
    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="CREATE", entity_type="product", entity_id=product["id"], changes={"name": body.name}
    )
    return {"success": True, "data": product}

@router.get("", summary="List All Admin Products (including drafts)")
async def list_admin_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await ProductService.get_products(
        db=db, page=page, limit=limit, category_slug=category,
        search=search, status=status, sort_by="display_order", order="asc"
    )
    return {"success": True, "data": result}

@router.get("/{id}", summary="Get Admin Product by ID")
async def get_admin_product(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid product ID format")
    doc = await db.products.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Product", id)
    doc = await ProductService.format_product(db, doc)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update Product (Full)")
@router.patch("/{id}", summary="Update Product (Partial)")
async def update_product(
    id: str,
    body: ProductUpdate,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    product = await ProductService.update_product(db, id, body)
    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="UPDATE", entity_type="product", entity_id=id
    )
    return {"success": True, "data": product}

@router.delete("/{id}", summary="Delete / Archive Product")
async def delete_product(
    id: str,
    permanent: bool = Query(False),
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    success = await ProductService.delete_product(db, id, soft_delete=not permanent)
    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="DELETE", entity_type="product", entity_id=id, changes={"permanent": permanent}
    )
    return {"success": success, "message": "Product deleted successfully"}

@router.post("/{id}/publish", summary="Publish Product")
async def publish_product(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid product ID format")
    res = await db.products.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "published", "updated_at": datetime.now(timezone.utc)}}
    )
    if res.matched_count == 0:
        raise NotFoundException("Product", id)
    
    doc = await db.products.find_one({"_id": ObjectId(id)})
    formatted = await ProductService.format_product(db, doc)

    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="PUBLISH", entity_type="product", entity_id=id
    )
    await PublishingService.trigger_nextjs_revalidation(slug=formatted["slug"], path=f"/products/{formatted['slug']}")

    return {"success": True, "data": formatted, "message": "Product published successfully"}

@router.post("/{id}/unpublish", summary="Unpublish Product to Draft")
async def unpublish_product(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid product ID format")
    res = await db.products.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": "draft", "updated_at": datetime.now(timezone.utc)}}
    )
    if res.matched_count == 0:
        raise NotFoundException("Product", id)

    doc = await db.products.find_one({"_id": ObjectId(id)})
    formatted = await ProductService.format_product(db, doc)

    await AuditService.log_action(
        db, user_id=current_user["id"], user_email=current_user["email"],
        action="UNPUBLISH", entity_type="product", entity_id=id
    )
    return {"success": True, "data": formatted, "message": "Product unpublished to draft"}

@router.post("/{id}/duplicate", summary="Duplicate Product")
async def duplicate_product(
    id: str,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid product ID format")
    doc = await db.products.find_one({"_id": ObjectId(id)})
    if not doc:
        raise NotFoundException("Product", id)

    doc.pop("_id")
    doc["code"] = f"{doc['code']}-COPY"
    doc["name"] = f"{doc['name']} (Copy)"
    doc["slug"] = f"{doc['slug']}-copy"
    doc["status"] = "draft"
    doc["created_at"] = datetime.now(timezone.utc)
    doc["updated_at"] = datetime.now(timezone.utc)

    res = await db.products.insert_one(doc)
    doc["_id"] = res.inserted_id
    formatted = await ProductService.format_product(db, doc)
    return {"success": True, "data": formatted}

@router.patch("/reorder", summary="Reorder Products")
async def reorder_products(
    body: ProductReorderRequest,
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    for item in body.items:
        if ObjectId.is_valid(item.id):
            await db.products.update_one(
                {"_id": ObjectId(item.id)},
                {"$set": {"display_order": item.display_order}}
            )
    return {"success": True, "message": "Products reordered successfully"}
