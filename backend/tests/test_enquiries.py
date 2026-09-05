import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_installation_steps():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/installation")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

@pytest.mark.asyncio
async def test_submit_enquiry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/enquiries", json={
            "name": "Test Client",
            "email": "test@example.com",
            "phone": "+91 9999999999",
            "company": "Test Infra",
            "subject": "Product Enquiry",
            "message": "Interested in 50 FEGI earthing electrodes."
        })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Test Client"
