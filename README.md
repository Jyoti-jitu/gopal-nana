# FORECAST EARTHINGS PVT. LTD. — Official Enterprise Web Platform

Official B2B enterprise web application for **Forecast Earthings Pvt. Ltd.**, a leading manufacturer of Chemical Earthing Systems, ESE Lightning Arresters, GI & Copper Grounding Strips, and NABL-tested Earth Enhancement Compounds under the **Make in India** initiative.

- **National Motto**: *"Chalo Banaye Behtar Bharat"* 🇮🇳
- **Brand Slogan**: *"Grounded for a Safer World"*
- **GitHub Repository**: [https://github.com/Jyoti-jitu/gopal-nana.git](https://github.com/Jyoti-jitu/gopal-nana.git)

---

## 🏢 Corporate Contact & Offices

### 1. Corporate Office (Headquarters)
- **Company**: FORECAST EARTHINGS PVT. LTD.
- **Address**: Plot No. 799(P), Shyampur, Near SUM Hospital, Bhubaneswar – 751003, Odisha, India
- **Phones**: [+91 7978206652](tel:+917978206652), [+91 9658264263](tel:+919658264263)
- **Email**: `sales@forecastearthings.com`
- **Location Map**: [Google Maps Embed & Directions](https://maps.app.goo.gl/XGEz1kDawswAKKcEA)

### 2. Regional Branch Office
- **Company**: FORECAST EARTHINGS PVT. LTD.
- **Address**: Ama Seoni, Near Vidhan Sabha, Ring Road No. 3, Raipur – 492101, Chhattisgarh, India
- **Phones**: [+91 7978206652](tel:+917978206652), [+91 9658264263](tel:+919658264263)
- **Email**: `sales@forecastearthings.com`

---

## 📂 Repository Directory Structure

```text
c:/Users/ASUS/Desktop/PROJECT/
├── frontend/                     # Next.js 14 Web Application
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Home page
│   │   ├── about/page.tsx        # About Us page
│   │   ├── products/
│   │   │   ├── page.tsx          # Industrial Catalogue & Filters
│   │   │   └── [slug]/page.tsx   # Dynamic Product Detail page
│   │   ├── installation/page.tsx # 7-Step Installation Workflow & 22 Client Reviews
│   │   ├── contact/page.tsx      # Get in Touch (Corporate & Branch Office details)
│   │   ├── layout.tsx            # Global Layout with Header & Footer
│   │   ├── globals.css           # Tailwind CSS & Global Styles
│   │   └── not-found.tsx         # Custom 404 page
│   ├── components/
│   │   ├── home/                 # Hero, TrustStrip, ProductRange, WhyChooseUs, ContactCTA
│   │   ├── layout/               # Header, Footer, Mobile Navigation
│   │   ├── products/             # ProductCard
│   │   └── ui/                   # Container, SectionHeading
│   ├── lib/
│   │   ├── types.ts              # TypeScript interfaces (Product, Category, EnquiryPayload)
│   │   ├── products.ts           # Authoritative 9-product industrial dataset
│   │   └── api.ts                # REST API Service Abstraction (FastAPI & Mock Data)
│   ├── public/
│   │   └── images/               # High-resolution SVG product renders & earthing photography
│   ├── package.json              # Frontend scripts & dependencies
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
├── .gitignore                    # Git ignore rules for root & frontend
└── README.md                     # Project Master Reference Document
```

---

## 🛠️ Industrial Product Catalogue

| Code | Product Name | Category | Primary Feature / Standard |
| :--- | :--- | :--- | :--- |
| `1-FEGI` | **GI Earthing Electrode** | Earthing Electrodes | Hot-Dip Galvanized Pipe-in-Pipe |
| `2-FECB` | **Copper Bonded Earthing Electrode** | Earthing Electrodes | 250 Micron Molecular Copper Bonding |
| `3-FECT` | **Copper Terminal Earthing Electrode** | Earthing Electrodes | Heavy Duty Copper Terminal Busbar Plate |
| `4-FEPC` | **Pure Copper Earthing Electrode** | Earthing Electrodes | 99.9% Electrolytic Grade Copper |
| `5-FECBR` | **Copper Bonded 4G Rod** | Earthing Electrodes | Telecom 4G/5G Tower Grounding Rod |
| `6-FECI` | **Centrifugally Cast Iron Electrode** | Earthing Electrodes | LT/HT Switchyard Grounding Pipe |
| `7-FECC` | **Earth Pit Covers** | Pit Covers & Accessories | FRP / Poly / Cast Iron Load Rated Covers |
| `8-FEEG` | **Back Fill Earth Enhancement Compound** | Ground Enhancement | NABL-Tested Ultra Conductive Compound |
| `9-FELA` | **ESE Lightning Arrester** | Lightning Protection | NFC 17-102 (2011) Certified ΔT=60μs |

---

## ⚡ 7-Step Installation Workflow

1. **Step 01: Dig a Hole with Auger** — Bore vertical pit into soil using mechanical earth auger.
2. **Step 02: Hole Measurement** — Verify standard 4-inch diameter and 3-meter (10 ft) depth.
3. **Step 03: Insert Forecast Earthings Electrode** — Vertically align copper-bonded / GI rod in pit center.
4. **Step 04: Fill with Earth Enhancement Compound** — Pack NABL-tested compound around electrode rod.
5. **Step 05: Pour Water Around the Rod** — Hydrate backfill compound to eliminate air gaps.
6. **Step 06: Place Earthpit Cover** — Install heavy-duty inspection chamber cover over terminal head.
7. **Step 07: Cover Earthpit to Ground Level** — Backfill flush with ground level for safe inspection access.

---

## 💬 What Our Clients Say (22 Verified Reviews)

Positioned on the **Installation Page** (`/installation`) and **Product Page** (`/products`):
- **Rajesh Kumar** (*Project Manager, L&T Construction*)
- **Amit Sharma** (*Electrical Consultant*)
- **Sandeep Mohanty** (*Site Engineer, OPGCL*)
- **Vikram Aditya** (*Procurement Head, Sterling & Wilson*)
- **Dr. Ananya Rao** (*Infrastructure Director*)
- **Abhishek Singh** (*Maintenance Head, Tata Steel*)
- **Manoj Mishra** (*Safety Officer, NTPC*)
- ... and **150+ verified engineering reviews**.

---

## 💻 Quick Start & Development

### 1. Change to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build & Production Verification
```bash
# Typecheck
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm start
```

---

## 🔄 Connecting to FastAPI & MongoDB Backend

To switch from mock data to a live FastAPI REST backend:

1. Open `frontend/lib/api.ts`.
2. Set `const USE_MOCK_DATA = false;`.
3. Set environment variable in `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
