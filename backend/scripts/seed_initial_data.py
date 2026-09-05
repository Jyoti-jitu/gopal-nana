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
        {"name": "Pit Covers & Accessories", "slug": "pit-covers", "description": "Heavy duty FRP, Polypropylene & Cast Iron Earth Pit Covers", "display_order": 2},
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
            "tag": "High Durability",
            "short_description": "Hot dip galvanized pipe-in-pipe earthing electrode designed for rapid fault current dissipation and long service life.",
            "description": "Forecast Earthings GI Earthing Electrodes are manufactured using prime quality steel pipes treated with heavy hot-dip galvanization. The dual-pipe (pipe-in-pipe) technology filled with primary conductive crystalline mixture ensures ultra-fast fault current dissipation into the earth, preventing electrical hazards in residential, commercial, and industrial facilities.",
            "features": [
                "Hot dip galvanized for maximum corrosion protection",
                "Fast fault current dissipation capability",
                "Low maintenance with long-lasting ground stability",
                "Easy and fast installation in diverse soil conditions",
                "Customized moisture booster chemical bag included",
                "Engineered per Bureau of Indian Standards (BIS) norms"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "1-FEGI"}},
                {"label": "Material", "values": {"value": "Hot Dip Galvanized Steel"}},
                {"label": "Electrode Design", "values": {"value": "Pipe-in-Pipe Crystalline Technology"}},
                {"label": "Standard Lengths", "values": {"value": "1.0m, 2.0m, 3.0m"}},
                {"label": "Outer Pipe Diameter", "values": {"value": "48mm / 50mm / 80mm"}},
                {"label": "Inner Strip / Pipe Size", "values": {"value": "25x3 mm / 32x6 mm"}},
                {"label": "Coating Thickness", "values": {"value": "80-100 Microns (Hot Dip)"}},
                {"label": "Soil Suitability", "values": {"value": "All Normal, Sandy & Rocky Soils"}}
            ],
            "images": [{"url": "/images/products/gi-earthing-electrode.svg", "alt": "GI Earthing Electrode"}],
            "applications": [
                "Substation and transformer earthing",
                "Residential & commercial building safety",
                "Industrial machinery and LT/HT panels",
                "Telecommunication towers and data centers"
            ],
            "featured": True,
            "display_order": 1,
            "status": "published",
            "seo": {"title": "GI Earthing Electrode | Forecast Earthings", "description": "Hot dip galvanized pipe-in-pipe earthing electrode."}
        },
        {
            "code": "2-FECB",
            "name": "Copper Bonded Earthing Electrode",
            "slug": "copper-bonded-earthing-electrode",
            "category_slug": "earthing-electrodes",
            "tag": "Popular Choice",
            "short_description": "Molecularly bonded copper earthing electrode delivering superior conductivity, mechanical strength, and extended operational lifespan.",
            "description": "Engineered with high tensile low carbon steel core molecularly bonded with 99.9% pure electrolytic copper, the Forecast Earthings Copper Bonded Earthing Electrode offers exceptional current dissipation and anti-corrosive performance. Perfect for environments demanding low soil resistance and high reliability.",
            "features": [
                "Molecular copper bonding guarantees no slipping or peeling",
                "High tensile strength steel core allows deep driving",
                "Enhanced electrical conductivity for lightning & fault currents",
                "Exceptional longevity in acidic and alkaline soils",
                "Maintenance-free design suitable for critical infrastructure"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "2-FECB"}},
                {"label": "Core Material", "values": {"value": "High Tensile Low Carbon Steel"}},
                {"label": "Bonding Material", "values": {"value": "99.9% Pure Electrolytic Copper"}},
                {"label": "Copper Layer Thickness", "values": {"value": "250 Microns (0.254mm)"}},
                {"label": "Outer Diameter", "values": {"value": "14.2mm, 17.2mm, 25mm, 48mm, 50mm"}},
                {"label": "Standard Lengths", "values": {"value": "2.0m, 3.0m"}},
                {"label": "Current Capacity", "values": {"value": "High Fault Current Withstanding"}},
                {"label": "Service Life", "values": {"value": "Designed for 30+ Years"}}
            ],
            "images": [{"url": "/images/products/copper-bonded-electrode.svg", "alt": "Copper Bonded Earthing Electrode"}],
            "applications": [
                "Solar PV power plants and wind farms",
                "Heavy industrial manufacturing units",
                "Oil & gas refineries",
                "Railways and metro transit grounding"
            ],
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
            "tag": "Heavy Duty",
            "short_description": "Specially designed earthing electrode featuring a heavy-duty copper terminal plate for robust busbar connection.",
            "description": "The Forecast Earthings Copper Terminal Earthing Electrode combines a high-performance grounding rod with a precision welded or cold-formed pure copper terminal top plate. This design simplifies conductor clamping and ensures minimum resistance at the connection point.",
            "features": [
                "Heavy-duty solid copper terminal head for direct busbar attachment",
                "High electrical conductivity and minimal contact resistance",
                "Corrosion-resistant terminal plate for harsh environments",
                "Factory-filled high conductive crystalline compound",
                "Simplified connection for multi-strip earthing grid networks"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "3-FECT"}},
                {"label": "Terminal Material", "values": {"value": "Heavy Duty Electrolytic Copper Plate"}},
                {"label": "Terminal Hole Size", "values": {"value": "12mm / 14mm Dual Bolt Hole"}},
                {"label": "Rod Diameter", "values": {"value": "50mm / 80mm Pipe Design"}},
                {"label": "Length", "values": {"value": "2.0m, 3.0m"}},
                {"label": "Internal Filling", "values": {"value": "High Conduction Crystalline Powder"}},
                {"label": "Fault Current Rate", "values": {"value": "Up to 50kA for 1 sec"}}
            ],
            "images": [{"url": "/images/products/copper-terminal-electrode.svg", "alt": "Copper Terminal Earthing Electrode"}],
            "applications": [
                "Power generation and transmission substations",
                "Heavy industrial motor control centers",
                "Captive power plants and switchyards"
            ],
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
            "tag": "Premium Grade",
            "short_description": "Manufactured from 99.9% pure electrolytic grade copper pipe-in-pipe structure for ultimate electrical conductivity and permanent protection.",
            "description": "For maximum mission-critical applications where failure is not an option, Forecast Earthings Pure Copper Earthing Electrodes provide unmatched conductivity and lifetime stability. Constructed completely from 99.9% electrolytic grade copper pipes and filled with anti-corrosive chemical matrix, it is the highest tier earthing solution.",
            "features": [
                "Constructed from 99.9% pure electrolytic grade copper",
                "Supreme electrical conductivity and zero rust formation",
                "Ultra-fast fault current dissipation to prevent equipment damage",
                "Zero periodic maintenance required over decades",
                "Superior performance in high-resistivity and corrosive soils"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "4-FEPC"}},
                {"label": "Material Composition", "values": {"value": "99.9% Pure Electrolytic Grade Copper"}},
                {"label": "Outer Pipe Size", "values": {"value": "40mm / 50mm / 75mm OD"}},
                {"label": "Inner Strip Material", "values": {"value": "Pure Copper Strip (25x3mm / 32x6mm)"}},
                {"label": "Standard Lengths", "values": {"value": "1.0m, 2.0m, 3.0m"}},
                {"label": "Conductivity", "values": {"value": "100% IACS Standard"}},
                {"label": "Service Life", "values": {"value": "Permanent / Lifelong"}}
            ],
            "images": [{"url": "/images/products/pure-copper-electrode.svg", "alt": "Pure Copper Earthing Electrode"}],
            "applications": [
                "Hospital ICU & medical diagnostic equipment earthing",
                "Defense, aerospace & radar stations",
                "Data centers & telecom hubs",
                "Nuclear & thermal power facilities"
            ],
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
            "tag": "Telecom Specialized",
            "short_description": "High-tensile copper-bonded solid rod engineered specifically for telecom 4G/5G towers, distribution poles, and compact pits.",
            "description": "Designed to meet the stringent grounding standards of telecommunication providers, the Forecast Earthings Copper Bonded 4G Rod offers deep soil penetration with cold-rolled steel core and uniform molecular copper jacket. Comes with precision-threaded ends or unthreaded options for deep driving.",
            "features": [
                "Solid high-carbon steel core for hard ground driving without bending",
                "Uniform 250 micron copper bonding per IEC/UL standards",
                "Multiple model variants (Threaded / Pointed / Flat ends)",
                "High weather and chemical resistance in soil",
                "Optimized length and diameter for telecom earth pits"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "5-FECBR"}},
                {"label": "Core Metal", "values": {"value": "Cold Drawn Carbon Steel"}},
                {"label": "Copper Coating", "values": {"value": "250 Micron Molecular Copper"}},
                {"label": "Rod Diameters", "values": {"value": "14.2mm (5/8\"), 17.2mm (3/4\"), 20mm"}},
                {"label": "Length Variants", "values": {"value": "1.2m, 2.4m, 3.0m"}},
                {"label": "Terminal Size", "values": {"value": "M14 / M16 Threaded or Clamp Mount"}},
                {"label": "Compliance", "values": {"value": "NABL & BIS Tested Standards"}}
            ],
            "images": [{"url": "/images/products/copper-bonded-4g-rod.svg", "alt": "Copper Bonded 4G Rod"}],
            "applications": [
                "4G / 5G Mobile Base Stations & Telecom Towers",
                "Distribution transformers & utility poles",
                "CCTV & Traffic monitoring network grounding"
            ],
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
            "tag": "Heavy Industry",
            "short_description": "Robust centrifugally cast iron pipe earthing electrode built for LT & HT power system grounding in tough terrain.",
            "description": "Forecast Earthings Centrifugally Cast Iron Earthing Electrodes are manufactured using centrifugal casting technology, ensuring dense, pore-free grain structure and exceptional resistance against chemical corrosion. Ideal for heavy electrical installations, LT/HT switchyards, and rocky or saline soils.",
            "features": [
                "Centrifugally cast iron construction with pore-free structure",
                "Available for both LT (Low Tension) & HT (High Tension) earthing",
                "Superior resistance against aggressive chemical and saline soils",
                "High mechanical durability and high current dissipation capacity",
                "Complete with top terminal flange and watering funnel attachment"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "6-FECI"}},
                {"label": "Type / Grade", "values": {"value": "LT Earthing & HT Earthing Grade"}},
                {"label": "Manufacturing Process", "values": {"value": "Centrifugal Casting Method"}},
                {"label": "Pipe Diameter", "values": {"value": "100mm (4\") / 150mm (6\") ID"}},
                {"label": "Flange Dimension", "values": {"value": "Integrated Cast Iron Top Flange"}},
                {"label": "Wall Thickness", "values": {"value": "7.5mm - 10mm Heavy Duty Wall"}},
                {"label": "Standard Length", "values": {"value": "2.5m, 3.0m"}}
            ],
            "images": [{"url": "/images/products/cast-iron-electrode.svg", "alt": "Centrifugally Cast Iron Earthing Electrode"}],
            "applications": [
                "HT/LT switchyards & sub-station grids",
                "Heavy engineering factories and steel plants",
                "Saline coastal zone grounding systems"
            ],
            "featured": False,
            "display_order": 6,
            "status": "published",
            "seo": {"title": "Cast Iron Earthing Electrode | Forecast Earthings", "description": "Centrifugally cast iron grounding pipe."}
        },
        {
            "code": "7-FECC",
            "name": "Earth Pit Covers (FRP / Poly / Cast Iron)",
            "slug": "pit-covers",
            "category_slug": "pit-covers",
            "tag": "Protection Enclosure",
            "short_description": "Heavy-load rated protective earth pit enclosures available in FRP, High-Density Polypropylene, and Cast Iron variants.",
            "description": "Forecast Earthings Earth Pit Covers provide secure, weatherproof, and traffic-rated protection for earthing electrode termination points. Designed for convenient periodic testing and inspection, these covers prevent debris accumulation while withstanding heavy vehicle wheel loads.",
            "features": [
                "Available in FRP (Fiber Reinforced Plastic), Heavy Poly, and Cast Iron (CI)",
                "High load-bearing capacity suitable for industrial roadways",
                "UV resistant and weatherproof material composition",
                "Removable top lid with secure locking options for easy testing access",
                "Standard dimensions designed for easy installation over 4\" to 8\" holes"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "7-FECC"}},
                {"label": "Material Options", "values": {"value": "FRP / High-Density Poly / Cast Iron"}},
                {"label": "Load Capacity", "values": {"value": "5 Ton to 15 Ton Rating Options"}},
                {"label": "Top Diameter", "values": {"value": "250mm - 350mm"}},
                {"label": "Bottom Diameter", "values": {"value": "330mm - 450mm"}},
                {"label": "Overall Height", "values": {"value": "260mm - 300mm"}},
                {"label": "Color Options", "values": {"value": "Industrial Green / Black / Gray"}}
            ],
            "images": [{"url": "/images/products/pit-cover.svg", "alt": "Earth Pit Covers"}],
            "applications": [
                "Industrial driveway earth pit protection",
                "Commercial building perimeter earth inspection chambers",
                "Substation grid test link enclosures"
            ],
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
            "tag": "NABL Tested",
            "short_description": "NABL-tested ultra-conductive non-toxic ground enhancement material designed to permanently reduce soil resistivity around electrodes.",
            "description": "Forecast Earthings Advanced Back Fill Earth Enhancement Compound is a specially formulated conductive material designed to lower earth resistance and improve grounding effectiveness in high-resistivity soils. Tested at NABL-accredited laboratories, it expands when hydrated and maintains low resistance over decades without washing away.",
            "features": [
                "Tested and certified at NABL-accredited testing laboratories",
                "Highly conductive material dramatically reduces soil resistivity",
                "Non-toxic, environmentally friendly and non-polluting to groundwater",
                "Maintenance-free — retains moisture naturally without periodic watering",
                "Does not dissolve, leach, or wash away over time",
                "Protects earthing rod against soil corrosion"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "8-FEEG"}},
                {"label": "Certification", "values": {"value": "NABL Laboratory Tested & Approved"}},
                {"label": "Resistivity Value", "values": {"value": "< 0.12 ohm-meter"}},
                {"label": "Standard Packing", "values": {"value": "25 kg Heavy Duty Moisture-Proof Bags"}},
                {"label": "pH Range", "values": {"value": "6.8 - 7.5 (Neutral / Non-Corrosive)"}},
                {"label": "Environmental Safety", "values": {"value": "100% Non-Toxic & Lead/Heavy Metal Free"}},
                {"label": "Watering Requirement", "values": {"value": "No periodic watering required after initial set"}}
            ],
            "images": [{"url": "/images/products/backfill-compound.svg", "alt": "Back Fill Earth Enhancement Compound"}],
            "applications": [
                "High resistivity soils (rocky, sandy, dry terrain)",
                "Substation earth pits and lightning protection grids",
                "Solar & Wind power project grounding"
            ],
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
            "tag": "NFC 17-102 Tested",
            "short_description": "Non-electronic Early Streamer Emission (ESE) lightning arrester crafted from 304L stainless steel per NFC 17-102 (2011) standards.",
            "description": "The Forecast Earthings ESE Lightning Arrester (Early Streamer Emission) delivers advanced, long-range external lightning protection for large structures, commercial complexes, and industrial plants. Built from premium 304L stainless steel, it triggers an early upward streamer (ΔT = 60 μs) to safely intercept lightning discharges before they hit the structure.",
            "features": [
                "Non-electronic ESE technology — fully autonomous operation",
                "Tested in compliance with NFC 17-102 (2011) international standards",
                "Emission advance time: ΔT = 60 μs for wide protection radius",
                "High lightning current tested capability (100kA+ 10/350 μs curve)",
                "Requires no battery, external electrical power, or solar panel",
                "Constructed from corrosion-resistant 304L grade stainless steel",
                "Compatible with standard copper/GI down-conductor tapes and cables"
            ],
            "specifications": [
                {"label": "Product Code", "values": {"value": "9-FELA"}},
                {"label": "Technology", "values": {"value": "Early Streamer Emission (ESE) Non-Electronic"}},
                {"label": "Standard Reference", "values": {"value": "NFC 17-102 (2011) & IEC 62305"}},
                {"label": "Advance Trigger Time (ΔT)", "values": {"value": "60 Microseconds (60 μs)"}},
                {"label": "Material Construction", "values": {"value": "Grade 304L Stainless Steel"}},
                {"label": "Power Source", "values": {"value": "Self-Energizing (Atmosphere Electric Field)"}},
                {"label": "Protection Radius", "values": {"value": "Up to 107 Meters (Level IV @ h=5m)"}},
                {"label": "Down Conductor Connection", "values": {"value": "Suitable for M16 / 30x3mm Conductor Tape"}}
            ],
            "images": [{"url": "/images/products/ese-lightning-arrester.svg", "alt": "ESE Lightning Arrester"}],
            "applications": [
                "High-rise commercial and residential towers",
                "Industrial manufacturing plants and warehouses",
                "Airports, stadiums, and educational campuses",
                "Solar power parks and hazardous storage facilities"
            ],
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
