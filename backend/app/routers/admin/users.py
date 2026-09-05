from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.dependencies.auth import require_super_admin, require_admin
from app.dependencies.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.core.security import get_password_hash
from app.core.exceptions import NotFoundException, BadRequestException

router = APIRouter(prefix="/admin/users", tags=["Admin Users"])

@router.get("", summary="List Admin Users")
async def list_users(
    current_user: dict = Depends(require_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1)
    users = await cursor.to_list(length=100)
    items = []
    for u in users:
        u["id"] = str(u.pop("_id"))
        items.append(u)
    return {"success": True, "data": items}

@router.post("", summary="Create User / Admin")
async def create_user(
    body: UserCreate,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing = await db.users.find_one({"email": body.email.lower().strip()})
    if existing:
        raise BadRequestException(f"User with email '{body.email}' already exists")

    doc = {
        "email": body.email.lower().strip(),
        "password_hash": get_password_hash(body.password),
        "name": body.name,
        "role": body.role,
        "is_active": True,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    res = await db.users.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)
    doc.pop("password_hash", None)
    return {"success": True, "data": doc}

@router.put("/{id}", summary="Update User Details / Role")
async def update_user(
    id: str,
    body: UserUpdate,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid user ID")
    existing = await db.users.find_one({"_id": ObjectId(id)})
    if not existing:
        raise NotFoundException("User", id)

    update_dict = {}
    if body.name is not None:
        update_dict["name"] = body.name
    if body.role is not None:
        update_dict["role"] = body.role
    if body.is_active is not None:
        update_dict["is_active"] = body.is_active
    if body.password:
        update_dict["password_hash"] = get_password_hash(body.password)

    update_dict["updated_at"] = datetime.now(timezone.utc)

    await db.users.update_one({"_id": ObjectId(id)}, {"$set": update_dict})
    updated = await db.users.find_one({"_id": ObjectId(id)}, {"password_hash": 0})
    updated["id"] = str(updated.pop("_id"))
    return {"success": True, "data": updated}

@router.delete("/{id}", summary="Delete User")
async def delete_user(
    id: str,
    current_user: dict = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    if not ObjectId.is_valid(id):
        raise BadRequestException("Invalid user ID")
    if id == current_user["id"]:
        raise BadRequestException("Cannot delete your own admin account")

    res = await db.users.delete_one({"_id": ObjectId(id)})
    if res.deleted_count == 0:
        raise NotFoundException("User", id)
    return {"success": True, "message": "User deleted"}
