from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db

router = APIRouter(prefix="/testimonials", tags=["Public Testimonials"])

@router.get("", summary="Get published testimonials")
async def get_testimonials(
    featured: bool = Query(False),
    limit: int = Query(25, ge=1, le=100),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {"enabled": True, "status": "published"}
    if featured:
        query["featured"] = True

    cursor = db.testimonials.find(query).sort("display_order", 1).limit(limit)
    docs = await cursor.to_list(length=limit)
    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)
    return {"success": True, "data": items}
