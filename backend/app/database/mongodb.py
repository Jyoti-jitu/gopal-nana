import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
from app.core.logging import logger

class MongoDBManager:
    client = None
    db: AsyncIOMotorDatabase = None

db_manager = MongoDBManager()

async def connect_to_mongo():
    if db_manager.db is not None:
        return db_manager.db
        
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        await client.admin.command("ping")
        db_manager.client = client
        db_manager.db = client[settings.MONGODB_DATABASE]
        logger.info(f"[MongoDB] Connected to database: '{settings.MONGODB_DATABASE}'")
    except Exception as e:
        logger.warning(f"[MongoDB Warning] Real MongoDB connection failed ({e}). Falling back to mongomock_motor.")
        from mongomock_motor import AsyncMongoMockClient
        client = AsyncMongoMockClient()
        db_manager.client = client
        db_manager.db = client[settings.MONGODB_DATABASE]
        logger.info(f"[MongoDB] Initialized in-memory database: '{settings.MONGODB_DATABASE}'")
    return db_manager.db

async def close_mongo_connection():
    if db_manager.client:
        logger.info("Closing MongoDB connection...")
        db_manager.client.close()
        logger.info("MongoDB connection closed.")
        db_manager.client = None
        db_manager.db = None

def get_database() -> AsyncIOMotorDatabase:
    if db_manager.db is None:
        from mongomock_motor import AsyncMongoMockClient
        client = AsyncMongoMockClient()
        db_manager.client = client
        db_manager.db = client[settings.MONGODB_DATABASE]
    return db_manager.db
