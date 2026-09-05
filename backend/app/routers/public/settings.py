from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db

router = APIRouter(prefix="/settings", tags=["Public Settings"])

@router.get("", summary="Get global website settings")
async def get_settings(db: AsyncIOMotorDatabase = Depends(get_db)):
    doc = await db.settings.find_one({})
    if not doc:
        return {
            "success": True,
            "data": {
                "site_name": "FORECAST EARTHINGS PVT. LTD.",
                "tagline": "Grounded for a Safer World",
                "motto": "Chalo Banaye Behtar Bharat",
                "primary_email": "sales@forecastearthings.com",
                "primary_phone": "+91 7978206652",
                "secondary_phone": "+91 9658264263"
            }
        }
    doc["id"] = str(doc.pop("_id"))
    return {"success": True, "data": doc}
