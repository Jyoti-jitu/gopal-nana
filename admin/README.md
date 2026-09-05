# FORECAST EARTHINGS PVT. LTD. - ADMIN MANAGEMENT PANEL

Enterprise Administration Management Panel built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query v5**, and **JWT Authentication**.

Powering full Content Management System (CMS) control over products, pages, categories, installation steps, media library, enquiries CRM, offices, testimonials, and global site settings for the public website.

---

## 🏗️ System Architecture

```
                                NEXT.JS PUBLIC WEBSITE
                                     (Port 3000)
                                          │
                                       REST API
                                          │
                                 ┌────────▼────────┐
                                 │   FASTAPI API   │ ◄──── (Port 8000)
                                 └────────▲────────┘
                                          │
                                      JWT Bearer
                                          │
                               NEXT.JS ADMIN PANEL
                                     (Port 3001)
```

- **Authentication**: JWT Bearer Tokens targeting `POST /api/v1/auth/login`.
- **Role-Based Access Control (RBAC)**:
  - `super_admin`: Full access to all modules including User Account management.
  - `admin`: Full access to Products, Categories, Pages, Installation, Media, Enquiries, Testimonials, Offices, Navigation, Settings.
  - `editor`: Access to Products, Categories, Pages, Installation, Media, Testimonials.

---

## 🚀 Quick Start (Development)

```bash
# Navigate to admin directory
cd admin

# Install dependencies
npm install

# Start development server on port 3001
npm run dev
```

The Admin Management Panel will be accessible at:
[http://localhost:3001](http://localhost:3001)

Default Credentials:
- **Email**: `admin@forecastearthings.com`
- **Password**: `Admin@Forecast2026!`

---

## 🔑 Environment Variables (`.env`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📂 Project Structure

```
admin/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/
│   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── pages/
│   │   │   ├── page.tsx
│   │   │   ├── home/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── installation/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── installation/page.tsx
│   │   ├── offices/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── media/page.tsx
│   │   ├── enquiries/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── navigation/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── users/page.tsx
│   │   └── audit-logs/page.tsx
│   └── not-found.tsx
├── components/
│   ├── layout/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── MobileSidebar.tsx
│   │   └── Breadcrumbs.tsx
│   ├── dashboard/
│   ├── products/
│   ├── pages/
│   ├── media/
│   ├── enquiries/
│   └── ui/
├── lib/
│   ├── api/
│   ├── auth/
│   └── types/
├── hooks/
└── README.md
```

---

## ⚙️ Production Build & Typecheck

```bash
# Type check without emitting files
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```
