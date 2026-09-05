import re
from bson import ObjectId
from app.core.exceptions import BadRequestException

def validate_object_id(val: str) -> str:
    if not val or not ObjectId.is_valid(val):
        raise BadRequestException(f"Invalid ObjectId format: '{val}'")
    return val

def validate_email_format(email: str) -> str:
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    if not re.match(pattern, email):
        raise BadRequestException("Invalid email format")
    return email.lower().strip()

def validate_phone_number(phone: str) -> str:
    cleaned = re.sub(r"[^\d+]", "", phone)
    if len(cleaned) < 8:
        raise BadRequestException("Invalid phone number")
    return phone.strip()
