from app.database.mongodb import get_database
from app.core.logging import logger

async def create_indexes():
    db = get_database()
    
    # Products
    await db.products.create_index("slug", unique=True)
    await db.products.create_index("code", unique=True)
    await db.products.create_index("category_id")
    await db.products.create_index("status")
    await db.products.create_index([("name", "text"), ("description", "text"), ("code", "text")])
    
    # Categories
    await db.categories.create_index("slug", unique=True)
    
    # Pages
    await db.pages.create_index("slug", unique=True)
    
    # Media
    await db.media.create_index("filename")
    await db.media.create_index("public_id")
    
    # Users
    await db.users.create_index("email", unique=True)
    
    # Enquiries
    await db.enquiries.create_index("status")
    await db.enquiries.create_index("created_at")
    
    # Audit Logs
    await db.audit_logs.create_index("created_at")
    await db.audit_logs.create_index("user_id")
    
    # Testimonials
    await db.testimonials.create_index("display_order")
    await db.testimonials.create_index("status")

    # Installation Steps
    await db.installation_steps.create_index("step_number", unique=True)
    await db.installation_steps.create_index("display_order")
    
    # Offices
    await db.offices.create_index("office_type")

    logger.info("MongoDB indexes created successfully.")
