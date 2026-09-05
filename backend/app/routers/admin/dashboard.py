from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.auth import require_editor
from app.dependencies.database import get_db

router = APIRouter(prefix="/admin/dashboard", tags=["Admin Dashboard"])

@router.get("", summary="Get Admin Dashboard Statistics")
async def get_dashboard_stats(
    current_user: dict = Depends(require_editor),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    product_count = await db.products.count_documents({})
    published_product_count = await db.products.count_documents({"status": "published"})
    draft_product_count = await db.products.count_documents({"status": "draft"})
    category_count = await db.categories.count_documents({})
    enquiry_count = await db.enquiries.count_documents({})
    new_enquiry_count = await db.enquiries.count_documents({"status": "new"})
    media_count = await db.media.count_documents({})
    testimonial_count = await db.testimonials.count_documents({})

    # Recent enquiries
    recent_enquiries_cursor = db.enquiries.find({}).sort("created_at", -1).limit(5)
    recent_enquiries = await recent_enquiries_cursor.to_list(length=5)
    for e in recent_enquiries:
        e["id"] = str(e.pop("_id"))

    # Recent audit activity
    recent_audit_cursor = db.audit_logs.find({}).sort("created_at", -1).limit(5)
    recent_audit = await recent_audit_cursor.to_list(length=5)
    for a in recent_audit:
        a["id"] = str(a.pop("_id"))

    return {
        "success": True,
        "data": {
            "statistics": {
                "product_count": product_count,
                "published_product_count": published_product_count,
                "draft_product_count": draft_product_count,
                "category_count": category_count,
                "enquiry_count": enquiry_count,
                "new_enquiry_count": new_enquiry_count,
                "media_count": media_count,
                "testimonial_count": testimonial_count
            },
            "recent_enquiries": recent_enquiries,
            "recent_activity": recent_audit
        }
    }
