import math
from typing import Any, Dict, List, TypeVar, Generic
from pydantic import BaseModel

T = TypeVar("T")

class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    pagination: PaginationMeta

def build_pagination_response(items: List[Any], total: int, page: int, limit: int) -> Dict[str, Any]:
    pages = math.ceil(total / limit) if limit > 0 else 1
    return {
        "items": items,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": pages
        }
    }
