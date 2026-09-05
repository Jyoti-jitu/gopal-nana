# Forecast Earthings Pvt. Ltd. — Production Website

A modern, responsive, B2B industrial website for **Forecast Earthings Pvt. Ltd.** built with Next.js 14 App Router, TypeScript, Tailwind CSS, and Lucide React icons.

Tagline: *"Chalo Banaye Behtar Bharat"*

---

## Features & Highlights

- **Corporate Identity**: Deep navy blue, dark slate, and Forecast crimson red accents with clear industrial engineering aesthetics.
- **Authoritative Catalog**: Includes all 9 flagship products with exact codes, features, technical specification tables, and application areas:
  1. `1-FEGI` — GI Earthing Electrode
  2. `2-FECB` — Copper Bonded Earthing Electrode
  3. `3-FECT` — Copper Terminal Earthing Electrode
  4. `4-FEPC` — Pure Copper Earthing Electrode
  5. `5-FECBR` — Copper Bonded 4G Rod
  6. `6-FECI` — Centrifugally Cast Iron Earthing Electrode
  7. `7-FECC` — Earth Pit Covers (FRP / Poly / Cast Iron)
  8. `8-FEEG` — Back Fill Earth Enhancement Compound (NABL Tested)
  9. `9-FELA` — ESE Lightning Arrester (NFC 17-102:2011)
- **7-Step Installation Workflow**: Interactive vertical timeline outlining the installation process.
- **FastAPI & MongoDB Ready**: API abstraction layer in `lib/api.ts` ready to connect to a FastAPI backend.
- **Client Form Validation**: Interactive enquiry form with pre-filled product selection and feedback states.
- **Mobile Responsive**: Fully optimized across 320px to 1920px viewports with custom horizontal scroll for technical specification tables.

---

## Getting Started

### Prerequisites

- Node.js `v18.x` or higher
- npm `v9.x` or higher

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## Production Build & Verification

To verify TypeScript compliance and compile the optimized production build:

```bash
# Typecheck
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

---

## Project Structure

```text
├── app/
│   ├── layout.tsx                # Root layout with metadata & fonts
│   ├── globals.css               # Design system & scrollbar styles
│   ├── page.tsx                  # Home page
│   ├── about/page.tsx            # About Us page
│   ├── products/
│   │   ├── page.tsx              # Products Catalogue page with filters
│   │   └── [slug]/page.tsx       # Dynamic Product Detail page
│   ├── installation/page.tsx     # 7-Step Installation process page
│   ├── contact/page.tsx          # Contact & Enquiry form page
│   └── not-found.tsx             # 404 page
├── components/
│   ├── layout/                   # Header, Footer, MobileMenu
│   ├── home/                     # Hero, TrustStrip, ProductRange, WhyChooseUs, EarthingIntro, InstallationPreview, ContactCTA
│   ├── products/                 # ProductCard
│   └── ui/                       # Container, SectionHeading
├── lib/
│   ├── types.ts                  # TypeScript interfaces (Product, Specification, Category, EnquiryPayload)
│   ├── products.ts               # Authoritative catalog data for all 9 products
│   └── api.ts                    # REST API service abstraction layer
├── public/
│   └── images/                   # High-resolution SVG product visuals, logo, and hero backgrounds
├── .env.example
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## How to Add a New Product

To add a new product to the catalog:

1. Open `lib/products.ts`.
2. Add a new product object to the `PRODUCTS` array following the `Product` type definition:

```typescript
{
  slug: "custom-electrode-slug",
  code: "10-[#FE]",
  name: "Custom Earthing Electrode",
  category: "Earthing Electrodes",
  categorySlug: "earthing-electrodes",
  tag: "New Release",
  shortDescription: "Short overview of the product.",
  description: "Detailed description of product construction and benefits.",
  features: [
    "Feature item 1",
    "Feature item 2"
  ],
  specifications: [
    { label: "Product Code", value: "10-[#FE]" },
    { label: "Material", value: "Grade A Material" }
  ],
  applications: [
    "Industrial Substations"
  ],
  images: ["/images/products/custom-electrode.svg"],
  brochureAvailable: true
}
```

---

## How to Connect to FastAPI & MongoDB Backend

The project includes an API abstraction layer located in `lib/api.ts`.

To connect to a live FastAPI backend:

1. Set `USE_MOCK_DATA = false` inside `lib/api.ts`.
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Ensure your FastAPI endpoints match these route signatures:
   - `GET /api/products` — Returns `Product[]`
   - `GET /api/products/{slug}` — Returns single `Product`
   - `GET /api/categories` — Returns `Category[]`
   - `POST /api/enquiries` — Accepts `EnquiryPayload`, returns `EnquiryResponse`

---

## Brand & Trademark Context

Company: **Forecast Earthings Pvt. Ltd.**  
National Motto: *"Chalo Banaye Behtar Bharat"*
