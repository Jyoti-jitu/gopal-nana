from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.dependencies.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.common import StandardResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse, summary="Admin Login")
async def login(request: Request, body: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    ip_address = request.client.host if request.client else None
    return await AuthService.login(db, body, ip_address=ip_address)
