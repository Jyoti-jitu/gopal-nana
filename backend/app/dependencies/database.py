from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.mongodb import get_database

async def get_db() -> AsyncIOMotorDatabase:
    return get_database()
