from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db

router = APIRouter(prefix="/installation", tags=["Public Installation"])

@router.get("", summary="Get 7-step installation workflow")
async def get_installation_steps(db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db.installation_steps.find({"enabled": True}).sort("step_number", 1)
    docs = await cursor.to_list(length=20)
    items = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        items.append(d)
    return {"success": True, "data": items}
