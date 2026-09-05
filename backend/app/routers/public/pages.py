from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.services.page_service import PageService

router = APIRouter(prefix="/pages", tags=["Public Pages"])

@router.get("/home", summary="Get Home Page content")
async def get_home_page(db: AsyncIOMotorDatabase = Depends(get_db)):
    data = await PageService.get_page_with_sections(db, "home", public_only=True)
    return {"success": True, "data": data}

@router.get("/about", summary="Get About Page content")
async def get_about_page(db: AsyncIOMotorDatabase = Depends(get_db)):
    data = await PageService.get_page_with_sections(db, "about", public_only=True)
    return {"success": True, "data": data}

@router.get("/contact", summary="Get Contact Page offices and CTA")
async def get_contact_page(db: AsyncIOMotorDatabase = Depends(get_db)):
    offices_cursor = db.offices.find({"enabled": True}).sort("display_order", 1)
    offices_list = await offices_cursor.to_list(length=20)
    formatted_offices = []
    for o in offices_list:
        o["id"] = str(o.pop("_id"))
        formatted_offices.append(o)
        
    try:
        page_data = await PageService.get_page_with_sections(db, "contact", public_only=True)
    except Exception:
        page_data = None

    return {
        "success": True,
        "data": {
            "page": page_data,
            "offices": formatted_offices
        }
    }

@router.get("/{slug}", summary="Get dynamic published page by slug")
async def get_page_by_slug(slug: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    data = await PageService.get_page_with_sections(db, slug, public_only=True)
    return {"success": True, "data": data}
