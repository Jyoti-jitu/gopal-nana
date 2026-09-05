from typing import List, Callable
from fastapi import Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.dependencies.database import get_db

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise UnauthorizedException("Invalid or expired access token")
    
    user_id = payload.get("user_id")
    if not user_id or not ObjectId.is_valid(user_id):
        raise UnauthorizedException("Invalid user token payload")
        
    user = await db.users.find_one({"_id": ObjectId(user_id), "is_active": True})
    if not user:
        raise UnauthorizedException("User no longer exists or is inactive")
        
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "editor")
    }

def require_roles(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles:
            raise ForbiddenException(
                f"Role '{current_user['role']}' does not have permission. Required roles: {allowed_roles}"
            )
        return current_user
    return role_checker

require_super_admin = require_roles(["super_admin"])
require_admin = require_roles(["super_admin", "admin"])
require_editor = require_roles(["super_admin", "admin", "editor"])
