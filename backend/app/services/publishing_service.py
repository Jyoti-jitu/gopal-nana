import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import logger

class PublishingService:
    @staticmethod
    async def trigger_nextjs_revalidation(slug: Optional[str] = None, path: Optional[str] = None) -> bool:
        if not settings.NEXT_PUBLIC_REVALIDATION_URL:
            return False
            
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                payload = {
                    "secret": settings.REVALIDATION_SECRET,
                    "slug": slug,
                    "path": path
                }
                response = await client.post(settings.NEXT_PUBLIC_REVALIDATION_URL, json=payload)
                if response.status_code == 200:
                    logger.info(f"Successfully triggered Next.js revalidation for path: {path or slug}")
                    return True
                else:
                    logger.warning(f"Revalidation hook returned status {response.status_code}: {response.text}")
                    return False
        except Exception as e:
            logger.warning(f"Could not connect to Next.js revalidation webhook: {e}")
            return False
