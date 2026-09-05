# FORECAST EARTHINGS PVT. LTD. - HEADLESS CMS / ADMIN BACKEND

Enterprise Headless CMS REST API built with **Python 3.10+**, **FastAPI**, **MongoDB**, **Pydantic v2**, and **JWT Authentication**. Powering the Next.js public website for Forecast Earthings Pvt. Ltd.

---

## 🏗️ Architecture

```
                    ┌──────────────────────────┐
                    │       NEXT.JS             │
                    │      PUBLIC WEBSITE       │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                    ┌────────────▼─────────────┐
                    │        FASTAPI             │
                    │     HEADLESS CMS API      │
                    └────────────┬─────────────┘
                                 │
                         ┌───────▼───────┐
                         │    MONGODB    │
                         └───────────────┘
                                 │
                         ┌───────▼───────┐
                         │ MEDIA STORAGE  │
                         └───────────────┘
```

---

## 🚀 Quick Start

### Windows

```powershell
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
copy .env.example .env

# Seed initial database records (Admin, Products, Categories, Installation, Offices, Settings)
python scripts/seed_initial_data.py

# Start development server
uvicorn app.main:app --reload --port 8000
```

### Linux / macOS

```bash
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env

# Seed initial database records
python scripts/seed_initial_data.py

# Start development server
uvicorn app.main:app --reload --port 8000
```

---

## 🛠️ Technology Stack

- **Framework**: FastAPI (Async REST API)
- **Database**: MongoDB with Motor (AsyncIO MongoDB Driver)
- **Validation**: Pydantic v2 & Pydantic Settings
- **Authentication**: Passlib (Argon2id password hashing) + PyJWT (JSON Web Tokens)
- **Media Engine**: Pillow (Image processing & WebP conversion)
- **Server**: Uvicorn ASGI Server

---

## 🔑 Environment Variables (`.env`)

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB Connection String | `mongodb://localhost:27017` |
| `MONGODB_DATABASE` | Database Name | `forecast_earthings` |
| `JWT_SECRET_KEY` | Secret Key for Signing JWT Tokens | `forecast_earthings_jwt_secret_2026...` |
| `JWT_ALGORITHM` | Encryption Algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token Expiry Duration | `600` |
| `CORS_ORIGINS` | Allowed Frontend Origins | `http://localhost:3000` |
| `MEDIA_STORAGE_TYPE` | Media Provider (`local` / `s3`) | `local` |
| `MEDIA_BASE_URL` | Base URL for Media Serving | `http://localhost:8000/media` |
| `ADMIN_EMAIL` | Super Admin Seed Email | `admin@forecastearthings.com` |
| `ADMIN_PASSWORD` | Super Admin Seed Password | `Admin@Forecast2026!` |

---

## 📚 API Documentation

Once the server is running, interactive API docs are available at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 📦 Key Collections & Endpoints

### Public Endpoints (Returns ONLY `published` content)

- `GET /api/v1/products` - List published products with category/search/pagination
- `GET /api/v1/products/{slug}` - Get product details by slug
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/categories` - List product categories
- `GET /api/v1/pages/home` - Home page CMS sections
- `GET /api/v1/pages/about` - About page CMS content
- `GET /api/v1/installation` - 7-step installation workflow
- `GET /api/v1/settings` - Global site name, phone numbers, footer & SEO metadata
- `GET /api/v1/navigation` - Dynamic header/footer menus
- `GET /api/v1/testimonials` - Client reviews
- `POST /api/v1/enquiries` - Submit customer contact form

### Admin Endpoints (Requires `Authorization: Bearer <token>`)

- `POST /api/v1/auth/login` - Admin login token generator
- `GET /api/v1/admin/dashboard` - Realtime CMS analytics
- `POST /api/v1/admin/products` - Create product
- `POST /api/v1/admin/products/{id}/publish` - Publish draft product
- `POST /api/v1/admin/media/upload` - Upload media file
- `GET /api/v1/admin/enquiries` - Manage customer enquiries
- `GET /api/v1/admin/audit-logs` - System audit log history

---

## 🐳 Docker Support

The backend includes a production-ready, multi-stage Docker setup with health checks, unprivileged user security, and Gunicorn concurrency.

### Run with Docker Compose (Production)
```bash
docker compose up -d --build
```

### Run with Live Code Reload (Development)
```bash
docker compose -f docker-compose.dev.yml up --build
```

### Direct Docker Commands
```bash
# Build production image
docker build -t forecast-earthings-backend .

# Run container with environment file
docker run -d \
  --name forecast-backend \
  -p 8000:8000 \
  --env-file .env \
  forecast-earthings-backend
```

For complete instructions, refer to the [DOCKER.md](file:///c:/Users/ASUS/Desktop/PROJECT/backend/DOCKER.md) guide.
