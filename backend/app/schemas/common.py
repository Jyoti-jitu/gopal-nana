from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from app.utils.pagination import PaginationMeta

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None

class PaginatedDataWrapper(BaseModel, Generic[T]):
    items: list[T]
    pagination: PaginationMeta

class PaginatedAPIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: PaginatedDataWrapper[T]

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[dict] = None

class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail
