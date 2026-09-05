import asyncio
import os
import sys
import json
import mimetypes
from datetime import datetime, timezone
import cloudinary
import cloudinary.uploader
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings

def setup_cloudinary():
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    print(f"Cloudinary configured for cloud_name: {settings.CLOUDINARY_CLOUD_NAME}")

async def migrate():
    setup_cloudinary()

    # 1. Locate frontend images
    frontend_images_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "images"))
    if not os.path.exists(frontend_images_dir):
        print(f"Error: Frontend images directory not found at {frontend_images_dir}")
        return

    print(f"Scanning images in: {frontend_images_dir}")
    mapping = {}
    uploaded_media_docs = []

    # Upload all files
    for root, dirs, files in os.walk(frontend_images_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, frontend_images_dir).replace("\\", "/")
            url_path = f"/images/{rel_path}"
            
            # Extract folder and public_id
            rel_dir = os.path.dirname(rel_path).replace("\\", "/")
            folder_name = f"forecast_earthings/{rel_dir}" if rel_dir else "forecast_earthings"
            file_base_name = os.path.splitext(f)[0]
            
            print(f"Uploading {url_path} to Cloudinary ({folder_name}/{file_base_name})...")
            try:
                upload_res = cloudinary.uploader.upload(
                    full_path,
                    folder=folder_name,
                    public_id=file_base_name,
                    resource_type="auto",
                    overwrite=True
                )
                secure_url = upload_res.get("secure_url") or upload_res.get("url")
                mapping[url_path] = secure_url
                print(f"  -> SUCCESS: {secure_url}")

                mime_type, _ = mimetypes.guess_type(full_path)
                file_size = os.path.getsize(full_path)

                uploaded_media_docs.append({
                    "filename": f,
                    "original_filename": f,
                    "mime_type": mime_type or "image/jpeg",
                    "size": file_size,
                    "url": secure_url,
                    "public_id": upload_res.get("public_id", f"{folder_name}/{file_base_name}"),
                    "alt_text": file_base_name.replace("-", " ").title(),
                    "caption": "",
                    "folder": rel_dir or "general",
                    "width": upload_res.get("width"),
                    "height": upload_res.get("height"),
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc)
                })
            except Exception as e:
                print(f"  -> FAILED to upload {url_path}: {e}")

    # Save mapping file
    mapping_out_backend = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "cloudinary_mapping.json"))
    with open(mapping_out_backend, "w") as mf:
        json.dump(mapping, mf, indent=2)
    print(f"\nSaved mapping of {len(mapping)} assets to {mapping_out_backend}")

    # Also save mapping to frontend and admin lib
    frontend_lib_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "lib"))
    admin_lib_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "admin", "lib"))
    
    if os.path.exists(frontend_lib_dir):
        with open(os.path.join(frontend_lib_dir, "cloudinary-assets.json"), "w") as f:
            json.dump(mapping, f, indent=2)
        print("Exported mapping to frontend/lib/cloudinary-assets.json")
        
    if os.path.exists(admin_lib_dir):
        with open(os.path.join(admin_lib_dir, "cloudinary-assets.json"), "w") as f:
            json.dump(mapping, f, indent=2)
        print("Exported mapping to admin/lib/cloudinary-assets.json")

    # 2. Update Database
    print("\nConnecting to MongoDB...")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        db = client[settings.MONGODB_DATABASE]
        await client.admin.command("ping")
        print("Connected to MongoDB successfully.")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return

    # Update Products
    products_count = 0
    async for p in db.products.find({}):
        modified = False
        images = p.get("images", [])
        updated_images = []
        for img in images:
            if isinstance(img, dict):
                current_url = img.get("url", "")
                if current_url in mapping:
                    img["url"] = mapping[current_url]
                    modified = True
                elif current_url.startswith("/images/"):
                    # Check partial matches
                    for local_path, cloud_url in mapping.items():
                        if local_path.lower() == current_url.lower():
                            img["url"] = cloud_url
                            modified = True
                            break
                updated_images.append(img)
            elif isinstance(img, str):
                new_url = mapping.get(img, img)
                if new_url != img:
                    modified = True
                updated_images.append(new_url)

        if modified:
            await db.products.update_one({"_id": p["_id"]}, {"$set": {"images": updated_images, "updated_at": datetime.now(timezone.utc)}})
            products_count += 1
            print(f"Updated product: {p.get('name')} with Cloudinary images.")

    print(f"Products updated: {products_count}")

    # Populate Media Library
    media_added = 0
    for doc in uploaded_media_docs:
        existing = await db.media.find_one({"url": doc["url"]})
        if not existing:
            await db.media.insert_one(doc)
            media_added += 1

    print(f"Media library populated with {media_added} assets.")
    print("\nMigration completed successfully!")

if __name__ == "__main__":
    asyncio.run(migrate())
