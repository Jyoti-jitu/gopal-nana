import io
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.media_service import MediaService, CloudinaryMediaStorage

@pytest.mark.asyncio
async def test_cloudinary_storage_configured():
    assert isinstance(MediaService.storage, CloudinaryMediaStorage)
    assert MediaService.storage.folder == "forecast_earthings"

@pytest.mark.asyncio
async def test_get_public_products():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "items" in data["data"]
