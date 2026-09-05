# 🚀 Forecast Earthings — Production Deployment Guide

**Stack:** FastAPI backend on **Render** · Frontend + Admin on **Vercel** · MongoDB **Atlas** · Cloudinary CDN

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Prepare the Repository](#2-prepare-the-repository)
3. [Deploy Backend on Render](#3-deploy-backend-on-render)
4. [Deploy Frontend on Vercel](#4-deploy-frontend-on-vercel)
5. [Deploy Admin on Vercel](#5-deploy-admin-on-vercel)
6. [Connect Everything (CORS + URLs)](#6-connect-everything-cors--urls)
7. [Seed the Database](#7-seed-the-database)
8. [Post-Deployment Checks](#8-post-deployment-checks)
9. [Custom Domains (Optional)](#9-custom-domains-optional)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

- [ ] **GitHub account** — push this repo to GitHub (private or public)
- [ ] **Render account** — [render.com](https://render.com) (free tier works)
- [ ] **Vercel account** — [vercel.com](https://vercel.com) (free tier works)
- [ ] **MongoDB Atlas** — cluster already set up ✅
- [ ] **Cloudinary** — account already set up ✅

---

## 2. Prepare the Repository

### 2a. Push to GitHub

```bash
# From the PROJECT root
git init                          # if not already a git repo
git add .
git commit -m "chore: production-ready deployment config"
git remote add origin https://github.com/<your-username>/forecast-earthings.git
git push -u origin main
```

> **Verify .gitignore is working:**
> ```bash
> git status
> ```
> You should NOT see any `.env` files, `node_modules/`, `.next/`, `.venv/`, or `backend/.env.docker` in the output.

---

## 3. Deploy Backend on Render

### 3a. Create the Web Service

1. Go to [render.com/dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set the **Root Directory** to: `backend`
4. Render will auto-detect the `render.yaml` — or set manually:

| Setting | Value |
|---------|-------|
| **Name** | `forecast-earthings-backend` |
| **Region** | Singapore (closest to India) |
| **Runtime** | Python 3 |
| **Build Command** | `pip install --upgrade pip && pip install -r requirements.txt` |
| **Start Command** | `gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120 --access-logfile - --error-logfile -` |
| **Plan** | Free (or Starter for no cold starts) |

### 3b. Set Environment Variables on Render

Go to your service → **Environment** → Add the following variables:

| Key | Value |
|-----|-------|
| `APP_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://jitu:jitu@cluster0.41ukonu.mongodb.net/?appName=Cluster0` |
| `MONGODB_DATABASE` | `forecast_earthings` |
| `JWT_SECRET_KEY` | *(your JWT secret from `.env`)* |
| `JWT_ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `600` |
| `CORS_ORIGINS` | `["https://your-frontend.vercel.app","https://your-admin.vercel.app"]` *(update after Vercel deploy)* |
| `MEDIA_STORAGE_TYPE` | `cloudinary` |
| `CLOUDINARY_CLOUD_NAME` | `bctl2gxd` |
| `CLOUDINARY_API_KEY` | `214629581935829` |
| `CLOUDINARY_API_SECRET` | *(your Cloudinary secret)* |
| `CLOUDINARY_URL` | *(your full Cloudinary URL)* |
| `CLOUDINARY_FOLDER` | `forecast_earthings` |
| `ADMIN_EMAIL` | `admin@forecastearthings.com` |
| `ADMIN_PASSWORD` | *(your admin password)* |
| `REVALIDATION_SECRET` | `forecast_revalidate_secret_2026` |
| `NEXT_PUBLIC_REVALIDATION_URL` | `https://your-frontend.vercel.app/api/revalidate` *(update after deploy)* |
| `MEDIA_UPLOAD_DIR` | `uploads` |
| `MAX_UPLOAD_SIZE_MB` | `10` |

> **Tip:** Reference file → `backend/.env.render.example`

### 3c. Deploy and Verify

1. Click **Create Web Service** → wait for the build (~3 min)
2. Once deployed, your backend URL is: `https://forecast-earthings-backend.onrender.com`
3. Test the health check:
   ```
   https://forecast-earthings-backend.onrender.com/health
   ```
   Expected response:
   ```json
   {"status":"ok","database":"connected","version":"1.0.0","media_storage":"cloudinary"}
   ```
4. Browse the API docs:
   ```
   https://forecast-earthings-backend.onrender.com/docs
   ```

> **Note on Free Tier:** Render free services spin down after 15 min of inactivity. First request after sleep takes ~30s. Upgrade to **Starter ($7/mo)** to eliminate cold starts.

---

## 4. Deploy Frontend on Vercel

### 4a. Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select your GitHub repo
3. Set **Root Directory** to: `frontend`
4. Vercel auto-detects Next.js ✅

### 4b. Set Environment Variables

Before clicking **Deploy**, add these environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://forecast-earthings-backend.onrender.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-frontend.vercel.app` *(update after deploy)* |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `bctl2gxd` |
| `REVALIDATION_SECRET` | `forecast_revalidate_secret_2026` *(must match backend)* |

> **Reference file:** `frontend/.env.production.example`

### 4c. Deploy Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

Click **Deploy** → wait ~2 min.

Your frontend URL: `https://forecast-earthings-web.vercel.app` (or similar)

### 4d. Update NEXT_PUBLIC_SITE_URL

After deploy, update the `NEXT_PUBLIC_SITE_URL` env var in Vercel with your actual URL, then redeploy (Vercel → Deployments → Redeploy).

---

## 5. Deploy Admin on Vercel

The admin panel is a **separate Vercel project** pointing to the same GitHub repo but with a different root directory.

### 5a. Import Project (again)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **same** GitHub repo
3. Set **Root Directory** to: `admin`

### 5b. Set Environment Variables

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://forecast-earthings-backend.onrender.com/api/v1` |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | `https://your-frontend.vercel.app` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `bctl2gxd` |

> **Reference file:** `admin/.env.production.example`

### 5c. Deploy

Click **Deploy** → your admin URL: `https://forecast-earthings-admin.vercel.app` (or similar)

---

## 6. Connect Everything (CORS + URLs)

Once both Vercel apps are deployed, go back to **Render** and update:

### Update CORS_ORIGINS on Render

```json
["https://forecast-earthings-web.vercel.app","https://forecast-earthings-admin.vercel.app"]
```

> **Where:** Render Dashboard → Backend Service → Environment → `CORS_ORIGINS`

### Update NEXT_PUBLIC_REVALIDATION_URL on Render

```
https://forecast-earthings-web.vercel.app/api/revalidate
```

> **Where:** Render Dashboard → Backend Service → Environment → `NEXT_PUBLIC_REVALIDATION_URL`

After updating Render env vars, the service **restarts automatically**.

---

## 7. Seed the Database

The database needs initial data (admin user, settings, etc.).

### Option A — Via Render Shell (One-time)

1. Render Dashboard → Backend Service → **Shell** tab
2. Run:
   ```bash
   python scripts/seed_initial_data.py
   ```

### Option B — Via Render Environment Variable (Auto-seed on deploy)

Add to Render env vars:
```
RUN_SEEDING=true
```

Then redeploy. Remove after seeding to avoid re-seeding on every restart.

### Verify Admin Login

1. Go to your admin Vercel URL
2. Login with:
   - Email: `admin@forecastearthings.com`
   - Password: *(your `ADMIN_PASSWORD` env var)*

---

## 8. Post-Deployment Checks

Run through this checklist after everything is live:

### Backend
- [ ] `GET /health` → `{"status":"ok","database":"connected"}`
- [ ] `GET /api/v1/products` → returns products list
- [ ] `GET /docs` → Swagger UI loads
- [ ] `POST /api/v1/auth/login` with admin credentials → returns JWT token

### Frontend
- [ ] Homepage loads with products from the API
- [ ] Products page loads and filters work
- [ ] Contact form submission works (check admin enquiries)
- [ ] No CORS errors in browser DevTools console

### Admin
- [ ] Login page loads
- [ ] Login works with admin credentials
- [ ] Dashboard shows data
- [ ] Can create/edit a product
- [ ] New enquiry from frontend appears in admin

---

## 9. Custom Domains (Optional)

### Vercel Custom Domains
1. Vercel → Project → Settings → Domains
2. Add your domain (e.g., `forecastearthings.com` for frontend, `admin.forecastearthings.com` for admin)
3. Update your DNS records as instructed

### Update CORS after Custom Domain

After adding custom domains, update Render `CORS_ORIGINS`:
```json
["https://forecastearthings.com","https://www.forecastearthings.com","https://admin.forecastearthings.com"]
```

---

## 10. Troubleshooting

### ❌ CORS Error in Browser

**Symptom:** Frontend shows `Access-Control-Allow-Origin` error

**Fix:** Check `CORS_ORIGINS` on Render — it must exactly match your Vercel URL (no trailing slash).

```json
["https://forecast-earthings-web.vercel.app"]
```

### ❌ Backend Returns 502 / Timeout

**Symptom:** API calls fail immediately

**Cause:** Free tier Render service is sleeping (cold start)

**Fix:** Wait 30s and retry. Upgrade to Starter plan to eliminate.

### ❌ Environment Variable Not Picked Up

**Symptom:** API URL still shows `localhost`

**Fix:** In Vercel → Settings → Environment Variables, make sure all 3 environments are checked (Production, Preview, Development). Then redeploy.

### ❌ Build Fails on Vercel

**Symptom:** TypeScript or lint errors during `npm run build`

**Fix:** Run `npm run build` locally first, fix all errors, then push again.

### ❌ Admin Login Fails (401)

**Symptom:** Login returns 401 even with correct credentials

**Fix:** 
1. Verify `NEXT_PUBLIC_API_URL` in Vercel admin env vars points to the Render backend
2. Run database seeding on Render (Step 7)
3. Check the admin password matches `ADMIN_PASSWORD` env var on Render

---

## Environment Variables Quick Reference

| Variable | Backend (Render) | Frontend (Vercel) | Admin (Vercel) |
|----------|:---:|:---:|:---:|
| `MONGODB_URI` | ✅ | ❌ | ❌ |
| `JWT_SECRET_KEY` | ✅ | ❌ | ❌ |
| `CLOUDINARY_API_SECRET` | ✅ | ❌ | ❌ |
| `CORS_ORIGINS` | ✅ | ❌ | ❌ |
| `NEXT_PUBLIC_API_URL` | ❌ | ✅ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | ❌ | ✅ | ❌ |
| `NEXT_PUBLIC_PUBLIC_SITE_URL` | ❌ | ❌ | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ❌ | ✅ | ✅ |
| `REVALIDATION_SECRET` | ✅ | ✅ | ❌ |

---

*Generated by Antigravity — Forecast Earthings Production Deployment Guide*
