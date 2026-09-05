from typing import Optional
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db

router = APIRouter(prefix="/navigation", tags=["Public Navigation"])

@router.get("", summary="Get navigation menus by location")
async def get_navigation(location: Optional[str] = Query(None), db: AsyncIOMotorDatabase = Depends(get_db)):
    query = {}
    if location:
        query["location"] = location

    cursor = db.navigation.find(query)
    menus = await cursor.to_list(length=10)
    items = []
    for m in menus:
        m["id"] = str(m.pop("_id"))
        items.append(m)
    return {"success": True, "data": items}
