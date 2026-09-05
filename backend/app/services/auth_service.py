from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import UnauthorizedException, BadRequestException
from app.schemas.auth import LoginRequest, LoginResponse, UserAuthInfo
from app.services.audit_service import AuditService

class AuthService:
    @staticmethod
    async def login(db: AsyncIOMotorDatabase, request: LoginRequest, ip_address: str = None) -> LoginResponse:
        user = await db.users.find_one({"email": request.email.lower().strip()})
        if not user or not verify_password(request.password, user["password_hash"]):
            raise UnauthorizedException("Invalid email or password")
            
        if not user.get("is_active", True):
            raise UnauthorizedException("User account is disabled")
            
        user_id_str = str(user["_id"])
        token = create_access_token(
            subject=user["email"],
            user_id=user_id_str,
            role=user.get("role", "editor")
        )
        
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login_at": datetime.now(timezone.utc)}}
        )
        
        await AuditService.log_action(
            db=db,
            user_id=user_id_str,
            user_email=user["email"],
            action="LOGIN",
            entity_type="user",
            entity_id=user_id_str,
            ip_address=ip_address
        )
        
        return LoginResponse(
            access_token=token,
            token_type="bearer",
            expires_in=600 * 60,
            user=UserAuthInfo(
                id=user_id_str,
                email=user["email"],
                name=user.get("name", ""),
                role=user.get("role", "editor")
            )
        )
