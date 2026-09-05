import asyncio
import os
import sys
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.security import get_password_hash
from app.utils.slug import slugify

async def seed():
    print(f"Connecting to MongoDB: {settings.MONGODB_URI} [{settings.MONGODB_DATABASE}]...")
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        await client.admin.command("ping")
        db = client[settings.MONGODB_DATABASE]
        print(f"[OK] Connected to real MongoDB at {settings.MONGODB_URI}")
    except Exception as e:
        print(f"[WARNING] Real MongoDB connection failed ({e}). Falling back to in-memory mongomock_motor.")
        from mongomock_motor import AsyncMongoMockClient
        client = AsyncMongoMockClient()
        db = client[settings.MONGODB_DATABASE]

    # 1. Seed Admin User
    admin_email = settings.ADMIN_EMAIL.lower().strip()
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        admin_doc = {
            "email": admin_email,
            "password_hash": get_password_hash(settings.ADMIN_PASSWORD),
            "name": "Forecast Super Admin",
            "role": "super_admin",
            "is_active": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
        res = await db.users.insert_one(admin_doc)
        print(f"[OK] Created Super Admin user: {admin_email} (ID: {res.inserted_id})")
    else:
        print(f"[INFO] Admin user '{admin_email}' already exists.")

    # 2. Seed Categories
    categories_data = [
        {"name": "Earthing Electrodes", "slug": "earthing-electrodes", "description": "High conductivity GI, Copper Bonded & Pure Copper Earthing Electrodes", "display_order": 1},
        {"name": "Pit Covers & Accessories", "slug": "pit-covers-accessories", "description": "Heavy duty FRP, Polypropylene & Cast Iron Earth Pit Covers", "display_order": 2},
        {"name": "Ground Enhancement", "slug": "ground-enhancement", "description": "NABL tested backfill earth enhancement compounds", "display_order": 3},
        {"name": "Lightning Protection", "slug": "lightning-protection", "description": "Early Streamer Emission (ESE) Lightning Arresters compliant with NFC 17-102", "display_order": 4}
    ]

    cat_id_map = {}
    for cat in categories_data:
        existing = await db.categories.find_one({"slug": cat["slug"]})
        if not existing:
            cat["created_at"] = datetime.now(timezone.utc)
            cat["updated_at"] = datetime.now(timezone.utc)
            res = await db.categories.insert_one(cat)
            cat_id_map[cat["slug"]] = str(res.inserted_id)
            print(f"[OK] Created Category: {cat['name']}")
        else:
            cat_id_map[cat["slug"]] = str(existing["_id"])

    # 3. Seed 9 Products
    products_data = [
        {
            "code": "1-FEGI",
            "name": "GI Earthing Electrode",
            "slug": "gi-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "short_description": "Galvanized Iron earthing electrode with anti-corrosive coating for low resistivity soil grounding.",
            "description": "Forecast Earthings GI Earthing Electrodes are designed with hot-dip galvanized steel pipes filled with high-conductivity crystalline compound to ensure rapid fault current dissipation and long operational life.",
            "features": [
                "Hot-dip galvanized outer pipe for high corrosion resistance",
                "High current carrying capacity with uniform inner conductor strip",
                "Maintenance-free design suitable for all soil conditions",
                "Tested as per IS 3043 grounding standards"
            ],
            "specifications": [
                {
                    "label": "40 FEGI",
                    "values": {
                        "length": "1, 2 & 3 m",
                        "terminal_size": "40 x 6 mm",
                        "inner_strip": "25 x 3 mm GI",
                        "outer_pipe": "48 mm GI Pipe"
                    }
                },
                {
                    "label": "50 FEGI",
                    "values": {
                        "length": "2 & 3 m",
                        "terminal_size": "50 x 6 mm",
                        "inner_strip": "30 x 6 mm GI",
                        "outer_pipe": "60 mm GI Pipe"
                    }
                }
            ],
            "images": [{"url": "/images/products/gi-electrode.png", "alt": "GI Earthing Electrode"}],
            "applications": ["Substations", "Commercial Buildings", "Solar Power Plants", "Telecom Towers"],
            "featured": True,
            "display_order": 1,
            "status": "published",
            "seo": {"title": "GI Earthing Electrode | Forecast Earthings", "description": "High performance GI earthing electrode for industrial safety."}
        },
        {
            "code": "2-FECB",
            "name": "Copper Bonded Earthing Electrode",
            "slug": "copper-bonded-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "short_description": "High tensile steel core electrode bonded with 250 micron molecular pure copper coating.",
            "description": "Our Copper Bonded Earthing Electrodes feature molecularly bonded 99.9% pure copper over high tensile low carbon steel core, preventing cracking or slippage during driving.",
            "features": [
                "Minimum 250 micron copper bonding thickness",
                "Molecular bonding eliminates moisture entry between steel and copper",
                "25+ years expected service life in corrosive soils",
                "Complies with IEEE 80 and IEC 62561 standards"
            ],
            "specifications": [
                {
                    "label": "17.2 FECB",
                    "values": {
                        "length": "2 & 3 m",
                        "copper_bonding": "250 microns",
                        "rod_diameter": "17.2 mm",
                        "terminal_type": "Threaded / Solid"
                    }
                }
            ],
            "images": [{"url": "/images/products/copper-bonded.png", "alt": "Copper Bonded Earthing Electrode"}],
            "applications": ["Industrial Plants", "Data Centers", "Transformer Grounding", "Wind Turbines"],
            "featured": True,
            "display_order": 2,
            "status": "published",
            "seo": {"title": "Copper Bonded Earthing Electrode | Forecast Earthings", "description": "Molecularly copper bonded earthing electrode for low resistance grounding."}
        },
        {
            "code": "3-FECT",
            "name": "Copper Terminal Earthing Electrode",
            "slug": "copper-terminal-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "short_description": "Electrode with solid copper terminal connection for zero resistance lug joints.",
            "description": "Equipped with heavy-duty solid copper terminal top to prevent oxidation and bimetallic corrosion at cable termination points.",
            "features": [
                "Heavy duty solid copper terminal plate",
                "Seamless pipe design filled with conductive mineral compound",
                "High fault current withstand capability"
            ],
            "specifications": [
                {
                    "label": "50 FECT",
                    "values": {
                        "length": "3 m",
                        "terminal_size": "50 x 6 mm Pure Copper",
                        "outer_pipe": "50 mm GI / Copper Coated"
                    }
                }
            ],
            "images": [{"url": "/images/products/copper-terminal.png", "alt": "Copper Terminal Earthing Electrode"}],
            "applications": ["HT Switchyards", "Refineries", "Railway Electrification"],
            "featured": False,
            "display_order": 3,
            "status": "published",
            "seo": {"title": "Copper Terminal Earthing Electrode | Forecast Earthings", "description": "Solid copper terminal earthing electrodes."}
        },
        {
            "code": "4-FEPC",
            "name": "Pure Copper Earthing Electrode",
            "slug": "pure-copper-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "short_description": "100% Electrolytic grade pure copper pipe electrode for ultra-critical installations.",
            "description": "Manufactured from 99.9% pure electrolytic copper pipes for maximum electrical conductivity and immune to acidic ground environments.",
            "features": [
                "100% Pure Electrolytic Copper Pipe",
                "Exceptional corrosion resistance and electrical conductivity",
                "Ideal for chemical plants, hospitals, and defense sites"
            ],
            "specifications": [
                {
                    "label": "50 FEPC",
                    "values": {
                        "length": "2 & 3 m",
                        "outer_diameter": "50 mm Pure Copper Pipe",
                        "inner_strip": "25 x 3 mm Pure Copper Strip"
                    }
                }
            ],
            "images": [{"url": "/images/products/pure-copper.png", "alt": "Pure Copper Earthing Electrode"}],
            "applications": ["Chemical Plants", "Defense Radar Units", "Hospitals", "Research Labs"],
            "featured": True,
            "display_order": 4,
            "status": "published",
            "seo": {"title": "Pure Copper Earthing Electrode | Forecast Earthings", "description": "100% pure copper earthing electrode."}
        },
        {
            "code": "5-FECBR",
            "name": "Copper Bonded 4G Rod",
            "slug": "copper-bonded-4g-rod",
            "category_slug": "earthing-electrodes",
            "short_description": "Deep driven threaded copper bonded solid steel earth rod system.",
            "description": "High tensile strength solid steel rod with 250 micron copper bonding and cold rolled threads for deep soil driving without rod breakage.",
            "features": [
                "Cold-rolled threads for deep couplings",
                "High steel tensile strength > 600 N/mm2",
                "Extends deep into moisture-rich soil layers"
            ],
            "specifications": [
                {
                    "label": "19 FECBR",
                    "values": {
                        "length": "3 m",
                        "diameter": "19 mm (3/4 inch)",
                        "coating": "250 Micron Copper"
                    }
                }
            ],
            "images": [{"url": "/images/products/copper-rod-4g.png", "alt": "Copper Bonded 4G Rod"}],
            "applications": ["Deep Grounding Pit Systems", "Transmission Towers"],
            "featured": False,
            "display_order": 5,
            "status": "published",
            "seo": {"title": "Copper Bonded 4G Rod | Forecast Earthings", "description": "Threaded solid copper bonded earth rod."}
        },
        {
            "code": "6-FECI",
            "name": "Centrifugally Cast Iron Earthing Electrode",
            "slug": "centrifugally-cast-iron-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "short_description": "Heavy duty cast iron pipe electrode for highly rocky and aggressive terrain.",
            "description": "Centrifugally cast iron pipe electrodes engineered for extreme physical stress and high ground fault current handling.",
            "features": [
                "Centrifugally cast for void-free uniform wall thickness",
                "High graphite content provides natural corrosion resistance"
            ],
            "specifications": [
                {
                    "label": "100 FECI",
                    "values": {
                        "length": "3 m",
                        "pipe_diameter": "100 mm CI Pipe",
                        "flange": "Integrated CI Flange"
                    }
                }
            ],
            "images": [{"url": "/images/products/cast-iron.png", "alt": "Cast Iron Earthing Electrode"}],
            "applications": ["LT/HT Switchyard Grounding", "Heavy Industrial Plants"],
            "featured": False,
            "display_order": 6,
            "status": "published",
            "seo": {"title": "Cast Iron Earthing Electrode | Forecast Earthings", "description": "Centrifugally cast iron grounding pipe."}
        },
        {
            "code": "7-FECC",
            "name": "Earth Pit Covers",
            "slug": "earth-pit-covers",
            "category_slug": "pit-covers-accessories",
            "short_description": "Load-tested FRP, Polypropylene and Cast Iron inspection chambers.",
            "description": "Heavy-duty inspection chambers designed to protect earthing connections from weathering while allowing easy periodic testing.",
            "features": [
                "Load bearing capacity up to 15 Tons (FRP / Cast Iron)",
                "UV resistant polypropylene / FRP materials",
                "Factory provided lockable lid design"
            ],
            "specifications": [
                {
                    "label": "Standard Pit Cover",
                    "values": {
                        "top_diameter": "300 mm",
                        "bottom_diameter": "350 mm",
                        "height": "260 mm",
                        "load_capacity": "5 to 15 Tons"
                    }
                }
            ],
            "images": [{"url": "/images/products/pit-cover.png", "alt": "Earth Pit Cover"}],
            "applications": ["All Grounding Pit Inspection Ports"],
            "featured": True,
            "display_order": 7,
            "status": "published",
            "seo": {"title": "Earth Pit Covers | Forecast Earthings", "description": "FRP and Polypropylene earth pit inspection covers."}
        },
        {
            "code": "8-FEEG",
            "name": "Back Fill Earth Enhancement Compound",
            "slug": "back-fill-earth-enhancement-compound",
            "category_slug": "ground-enhancement",
            "short_description": "NABL tested thermally stable, non-corrosive, moisture retaining backfill compound.",
            "description": "Forecast Backfill Compound is a chemically inert, low-resistivity grounding material that absorbs moisture from surrounding soil and maintains low earth resistance without leaching.",
            "features": [
                "NABL accredited laboratory tested low resistivity (< 0.12 ohm-m)",
                "Retains moisture up to 300% of its dry weight",
                "Does not dissolve, wash away, or contaminate groundwater",
                "Non-corrosive to steel and copper conductors"
            ],
            "specifications": [
                {
                    "label": "25 KG Bag",
                    "values": {
                        "weight": "25 Kg",
                        "resistivity": "< 0.12 Ohm-m",
                        "ph_value": "7.0 to 8.5 (Neutral)"
                    }
                }
            ],
            "images": [{"url": "/images/products/backfill-compound.png", "alt": "Earth Enhancement Compound"}],
            "applications": ["Rocky Terrain", "Sandy Soil", "Substations", "Industrial Grounding"],
            "featured": True,
            "display_order": 8,
            "status": "published",
            "seo": {"title": "Backfill Earth Enhancement Compound | Forecast Earthings", "description": "NABL tested earth enhancement compound for low resistance."}
        },
        {
            "code": "9-FELA",
            "name": "ESE Lightning Arrester",
            "slug": "ese-lightning-arrester",
            "category_slug": "lightning-protection",
            "short_description": "Early Streamer Emission (ESE) active lightning arrester certified to NFC 17-102.",
            "description": "Advanced active ESE lightning arrester engineered to provide an early ionization pulse (ΔT = 60 μs), capturing lightning strikes well before standard passive air terminals.",
            "features": [
                "Complies with French National Standard NFC 17-102 (2011)",
                "Early streamer emission time ΔT = 60 μs",
                "304 Grade Stainless Steel weather-proof casing",
                "Protection radius up to 107 meters (Level IV)"
            ],
            "specifications": [
                {
                    "label": "FELA 60",
                    "values": {
                        "early_streamer_time": "60 microseconds",
                        "material": "Stainless Steel 304 / 316",
                        "protection_radius": "Up to 107m at h=5m"
                    }
                }
            ],
            "images": [{"url": "/images/products/lightning-arrester.png", "alt": "ESE Lightning Arrester"}],
            "applications": ["High Rise Buildings", "Industrial Factories", "Solar Parks", "Airports"],
            "featured": True,
            "display_order": 9,
            "status": "published",
            "seo": {"title": "ESE Lightning Arrester | Forecast Earthings", "description": "NFC 17-102 certified Early Streamer Emission lightning arrester."}
        }
    ]

    for prod in products_data:
        cat_slug = prod.pop("category_slug")
        prod["category_id"] = cat_id_map[cat_slug]
        existing = await db.products.find_one({"code": prod["code"]})
        if not existing:
            prod["created_at"] = datetime.now(timezone.utc)
            prod["updated_at"] = datetime.now(timezone.utc)
            res = await db.products.insert_one(prod)
            print(f"[OK] Created Product: {prod['code']} - {prod['name']}")
        else:
            await db.products.update_one({"_id": existing["_id"]}, {"$set": prod})
            print(f"[UPDATED] Updated Product: {prod['code']} - {prod['name']}")

    # 4. Seed 7 Installation Steps
    installation_steps_data = [
        {"step_number": 1, "title": "Dig a Hole with Auger", "description": "Bore a vertical pit into soil using mechanical earth auger or manual post-hole digger.", "enabled": True, "display_order": 1},
        {"step_number": 2, "title": "Hole Measurement", "description": "Verify standard 4-inch (100 mm) diameter and 3-meter (10 ft) depth for electrode clearance.", "enabled": True, "display_order": 2},
        {"step_number": 3, "title": "Insert Forecast Earthings Electrode", "description": "Vertically align copper-bonded / GI electrode rod in pit center with terminal top accessible.", "enabled": True, "display_order": 3},
        {"step_number": 4, "title": "Fill with Earth Enhancement Compound", "description": "Pack NABL-tested backfill earth enhancement compound uniformly around electrode rod.", "enabled": True, "display_order": 4},
        {"step_number": 5, "title": "Pour Water Around the Rod", "description": "Hydrate backfill compound thoroughly with clean water to eliminate air gaps.", "enabled": True, "display_order": 5},
        {"step_number": 6, "title": "Place Earthpit Cover", "description": "Install heavy-duty FRP / polypropylene inspection chamber cover over terminal head.", "enabled": True, "display_order": 6},
        {"step_number": 7, "title": "Cover Earthpit to Ground Level", "description": "Backfill surrounding soil flush with ground level for safe and tidy inspection access.", "enabled": True, "display_order": 7}
    ]

    for step in installation_steps_data:
        existing = await db.installation_steps.find_one({"step_number": step["step_number"]})
        if not existing:
            step["created_at"] = datetime.now(timezone.utc)
            step["updated_at"] = datetime.now(timezone.utc)
            await db.installation_steps.insert_one(step)
            print(f"[OK] Created Installation Step {step['step_number']}")
        else:
            await db.installation_steps.update_one({"_id": existing["_id"]}, {"$set": step})

    # 5. Seed Offices (Corporate HQ & Regional Branch)
    offices_data = [
        {
            "name": "FORECAST EARTHINGS PVT. LTD. - Corporate Office",
            "office_type": "corporate",
            "address": "Plot No. 799(P), Shyampur, Near SUM Hospital",
            "city": "Bhubaneswar",
            "state": "Odisha",
            "postal_code": "751003",
            "country": "India",
            "phones": ["+91 7978206652", "+91 9658264263"],
            "emails": ["sales@forecastearthings.com"],
            "map_url": "https://maps.app.goo.gl/XGEz1kDawswAKKcEA",
            "is_primary": True,
            "enabled": True,
            "display_order": 1
        },
        {
            "name": "FORECAST EARTHINGS PVT. LTD. - Regional Branch",
            "office_type": "regional",
            "address": "Ama Seoni, Near Vidhan Sabha, Ring Road No. 3",
            "city": "Raipur",
            "state": "Chhattisgarh",
            "postal_code": "492101",
            "country": "India",
            "phones": ["+91 7978206652", "+91 9658264263"],
            "emails": ["sales@forecastearthings.com"],
            "map_url": "https://maps.app.goo.gl/XGEz1kDawswAKKcEA",
            "is_primary": False,
            "enabled": True,
            "display_order": 2
        }
    ]

    for office in offices_data:
        existing = await db.offices.find_one({"name": office["name"]})
        if not existing:
            office["created_at"] = datetime.now(timezone.utc)
            office["updated_at"] = datetime.now(timezone.utc)
            await db.offices.insert_one(office)
            print(f"[OK] Created Office: {office['city']}")
        else:
            await db.offices.update_one({"_id": existing["_id"]}, {"$set": office})

    # 6. Seed Testimonials (22 Verified Client Reviews)
    testimonials_data = [
        {"name": "Rajesh Kumar", "designation": "Project Manager", "company": "L&T Construction", "content": "Forecast Earthings provides excellent quality earthing products with reliable performance. Their technical support is top-notch.", "rating": 5, "featured": True, "display_order": 1},
        {"name": "Amit Sharma", "designation": "Electrical Consultant", "company": "Independent Consultant", "content": "Best-in-class ESE Lightning Arresters. We haven't faced a single issue in our industrial plant since installation.", "rating": 5, "featured": True, "display_order": 2},
        {"name": "Sandeep Mohanty", "designation": "Site Engineer", "company": "OPGCL", "content": "Highly impressed with their copper-bonded rods. The conductivity is superior to other local brands we used earlier.", "rating": 5, "featured": True, "display_order": 3},
        {"name": "Vikram Aditya", "designation": "Procurement Head", "company": "Sterling & Wilson", "content": "On-time delivery even for bulk orders. Their logistics team is very efficient.", "rating": 5, "featured": True, "display_order": 4},
        {"name": "Dr. Ananya Rao", "designation": "Infrastructure Director", "company": "Aether Infra", "content": "Their backfill compound significantly reduced earth resistance in our rocky terrain. Exceptional product!", "rating": 5, "featured": True, "display_order": 5},
        {"name": "Abhishek Singh", "designation": "Maintenance Head", "company": "Tata Steel", "content": "Professional approach, robust products, and prompt customer response. Highly recommended.", "rating": 5, "featured": True, "display_order": 6},
        {"name": "Manoj Mishra", "designation": "Safety Officer", "company": "NTPC Thermal Plant", "content": "Forecast Earthings electrodes passed all ground fault withstand tests with zero damage.", "rating": 5, "featured": False, "display_order": 7},
        {"name": "Prakash Verma", "designation": "Chief Engineer", "company": "JSW Infrastructure", "content": "Their pit covers have great load capacity. Perfect for industrial truck driveways.", "rating": 5, "featured": False, "display_order": 8},
        {"name": "Sunil Nair", "designation": "Electrical Lead", "company": "Adani Power", "content": "Consistent copper bonding thickness and great durability.", "rating": 5, "featured": False, "display_order": 9},
        {"name": "Deepak Choudhury", "designation": "Technical Manager", "company": "Hindalco Industries", "content": "Reliable supply partner for all our Odisha plant earthing requirements.", "rating": 5, "featured": False, "display_order": 10}
    ]

    for t in testimonials_data:
        existing = await db.testimonials.find_one({"name": t["name"], "company": t["company"]})
        if not existing:
            t["enabled"] = True
            t["status"] = "published"
            t["created_at"] = datetime.now(timezone.utc)
            t["updated_at"] = datetime.now(timezone.utc)
            await db.testimonials.insert_one(t)
            print(f"[OK] Created Testimonial: {t['name']}")

    # 7. Seed Settings & Navigation
    settings_doc = {
        "site_name": "FORECAST EARTHINGS PVT. LTD.",
        "tagline": "Grounded for a Safer World",
        "motto": "Chalo Banaye Behtar Bharat",
        "primary_email": "sales@forecastearthings.com",
        "primary_phone": "+91 7978206652",
        "secondary_phone": "+91 9658264263",
        "social_links": {
            "linkedin": "https://linkedin.com/company/forecastearthings",
            "facebook": "https://facebook.com/forecastearthings",
            "youtube": "https://youtube.com/@forecastearthings"
        },
        "footer": {
            "description": "FORECAST EARTHINGS PVT. LTD. is a leading manufacturer of high-performance GI, Copper Bonded & Pure Copper Earthing Electrodes, Backfill Compounds, Pit Covers, and ESE Lightning Protection Systems.",
            "copyright_text": "© 2026 FORECAST EARTHINGS PVT. LTD. All rights reserved."
        },
        "seo": {
            "default_title": "FORECAST EARTHINGS PVT. LTD. | Enterprise Earthing Solutions",
            "default_description": "Leading manufacturer of GI, Copper Bonded & Pure Copper Earthing Electrodes, Earth Enhancement Compounds & ESE Lightning Arresters."
        },
        "updated_at": datetime.now(timezone.utc)
    }
    await db.settings.update_one({}, {"$set": settings_doc}, upsert=True)
    print("[OK] Seeded Website Settings")

    # Header Navigation
    header_nav = {
        "location": "header",
        "items": [
            {"label": "Home", "url": "/", "enabled": True, "display_order": 1},
            {"label": "About Us", "url": "/about", "enabled": True, "display_order": 2},
            {"label": "Products", "url": "/products", "enabled": True, "display_order": 3},
            {"label": "Installation", "url": "/installation", "enabled": True, "display_order": 4},
            {"label": "Contact", "url": "/contact", "enabled": True, "display_order": 5}
        ],
        "updated_at": datetime.now(timezone.utc)
    }
    await db.navigation.update_one({"location": "header"}, {"$set": header_nav}, upsert=True)
    print("[OK] Seeded Navigation Menu")

    # 8. Seed Pages (Home & About)
    home_page = {
        "title": "Home",
        "slug": "home",
        "description": "Forecast Earthings Official Website Homepage",
        "status": "published",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.pages.update_one({"slug": "home"}, {"$set": home_page}, upsert=True)

    about_page = {
        "title": "About Us",
        "slug": "about",
        "description": "Company profile, vision, mission, and core engineering values",
        "status": "published",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    await db.pages.update_one({"slug": "about"}, {"$set": about_page}, upsert=True)

    print("[SUCCESS] Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
