import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.exceptions import APIException, api_exception_handler, http_exception_handler, global_exception_handler
from app.database.mongodb import connect_to_mongo, close_mongo_connection, db_manager, get_database
from app.database.indexes import create_indexes

# Auth & Public Routers
from app.routers import auth
from app.routers.public import products as public_products
from app.routers.public import pages as public_pages
from app.routers.public import installation as public_installation
from app.routers.public import settings as public_settings
from app.routers.public import navigation as public_navigation
from app.routers.public import testimonials as public_testimonials
from app.routers.public import enquiry as public_enquiry

# Admin Routers
from app.routers.admin import dashboard as admin_dashboard
from app.routers.admin import products as admin_products
from app.routers.admin import categories as admin_categories
from app.routers.admin import pages as admin_pages
from app.routers.admin import sections as admin_sections
from app.routers.admin import installation as admin_installation
from app.routers.admin import offices as admin_offices
from app.routers.admin import testimonials as admin_testimonials
from app.routers.admin import media as admin_media
from app.routers.admin import navigation as admin_navigation
from app.routers.admin import settings as admin_settings
from app.routers.admin import enquiries as admin_enquiries
from app.routers.admin import users as admin_users
from app.routers.admin import audit_logs as admin_audit_logs

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await create_indexes()
    os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Exception Handlers
app.add_exception_handler(APIException, api_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# CORS Middleware
origins = settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Static Media Server
os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.MEDIA_UPLOAD_DIR), name="media")

# Router Registrations
v1 = settings.API_V1_STR

# Auth
app.include_router(auth.router, prefix=v1)

# Public API
app.include_router(public_products.router, prefix=v1)
app.include_router(public_pages.router, prefix=v1)
app.include_router(public_installation.router, prefix=v1)
app.include_router(public_settings.router, prefix=v1)
app.include_router(public_navigation.router, prefix=v1)
app.include_router(public_testimonials.router, prefix=v1)
app.include_router(public_enquiry.router, prefix=v1)

# Admin API
app.include_router(admin_dashboard.router, prefix=v1)
app.include_router(admin_products.router, prefix=v1)
app.include_router(admin_categories.router, prefix=v1)
app.include_router(admin_pages.router, prefix=v1)
app.include_router(admin_sections.router, prefix=v1)
app.include_router(admin_installation.router, prefix=v1)
app.include_router(admin_offices.router, prefix=v1)
app.include_router(admin_testimonials.router, prefix=v1)
app.include_router(admin_media.router, prefix=v1)
app.include_router(admin_navigation.router, prefix=v1)
app.include_router(admin_settings.router, prefix=v1)
app.include_router(admin_enquiries.router, prefix=v1)
app.include_router(admin_users.router, prefix=v1)
app.include_router(admin_audit_logs.router, prefix=v1)

@app.get("/health", tags=["Health Check"])
@app.get(f"{v1}/health", tags=["Health Check"])
async def health_check(db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    return {
        "status": "ok",
        "database": db_status,
        "version": settings.VERSION
    }
