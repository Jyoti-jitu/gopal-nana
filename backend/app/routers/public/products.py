from typing import Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.schemas.common import StandardResponse, PaginatedAPIResponse
from app.services.product_service import ProductService
from bson import ObjectId

router = APIRouter(prefix="", tags=["Public Products"])

@router.get("/products", summary="Get published products with filtering and pagination")
async def get_public_products(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    category: Optional[str] = Query(None, description="Category slug"),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort: str = Query("display_order"),
    order: str = Query("asc"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await ProductService.get_products(
        db=db,
        page=page,
        limit=limit,
        category_slug=category,
        featured=featured,
        search=search,
        status="published",
        sort_by=sort,
        order=order
    )
    return {"success": True, "data": result}

@router.get("/products/featured", summary="Get featured published products")
async def get_featured_products(
    limit: int = Query(6, ge=1, le=20),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await ProductService.get_products(
        db=db,
        page=1,
        limit=limit,
        featured=True,
        status="published",
        sort_by="display_order",
        order="asc"
    )
    return {"success": True, "data": result["items"]}

@router.get("/products/{slug}", summary="Get published product by slug")
async def get_product_by_slug(slug: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    product = await ProductService.get_product_by_slug(db=db, slug=slug, public_only=True)
    return {"success": True, "data": product}

@router.get("/categories", summary="Get published product categories")
async def get_categories(db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db.categories.find({}).sort("display_order", 1)
    cats = await cursor.to_list(length=100)
    items = []
    for c in cats:
        c["id"] = str(c.pop("_id"))
        items.append(c)
    return {"success": True, "data": items}

@router.get("/categories/{slug}/products", summary="Get products in category")
async def get_category_products(
    slug: str,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    result = await ProductService.get_products(
        db=db,
        page=page,
        limit=limit,
        category_slug=slug,
        status="published"
    )
    return {"success": True, "data": result}
