# Dockerization Guide - Forecast Earthings Backend

This guide outlines the production-ready Docker setup for the **Forecast Earthings FastAPI Backend**.

---

## Architecture Overview

The backend container utilizes an **enterprise multi-stage build**:
1. **Builder Stage (`builder`)**:
   - Compiles wheels and builds C/C++ dependencies (`build-essential`, `libffi-dev`).
   - Creates an isolated virtual environment at `/opt/venv`.
2. **Runner Stage (`runner`)**:
   - Uses minimal runtime footprint (`python:3.10-slim`).
   - Runs under a dedicated unprivileged user (`appuser`, UID 1001) for strict security compliance.
   - Includes `curl` for container health checks (`/health` endpoint).
   - Driven by `docker-entrypoint.sh` supporting both **Production (Gunicorn + Uvicorn Workers)** and **Development (Uvicorn `--reload`)**.

---

## File Structure

- `Dockerfile` - Multi-stage production container definition.
- `docker-compose.yml` - Production container orchestration with healthchecks and volumes.
- `docker-compose.dev.yml` - Hot-reload development configuration with volume bind mounts.
- `docker-entrypoint.sh` - Container lifecycle entrypoint script.
- `.dockerignore` - Excludes `.venv`, caches, test files, and local artifacts.
- `.env.docker` - Example environment configuration for Docker runs.

---

## Quick Start

### 1. Build & Run with Docker Compose (Production)
```bash
# From backend directory
docker compose up -d --build

# Or from project root
docker compose -f docker-compose.yml up -d --build
```
The API will be live at `http://localhost:8000`.

### 2. View Container Logs
```bash
docker compose logs -f backend
```

### 3. Check Container Health Status
```bash
docker ps --filter name=forecast-earthings-backend
```
The status will display `(healthy)` once the `/health` endpoint succeeds.

---

## Development Mode (Live Code Hot-Reload)

To edit code on your host machine while running inside the container:
```bash
docker compose -f docker-compose.dev.yml up --build
```
Changes in `./app` will automatically trigger Uvicorn reload inside the container.

---

## Running with Local MongoDB (Optional)

If you wish to test in an offline environment without MongoDB Atlas:
```bash
docker compose --profile local-db up -d
```
Then update `MONGODB_URI` in `.env` to:
```env
MONGODB_URI=mongodb://mongodb:27017
```

---

## Direct Docker CLI Usage

### Build the Image
```bash
docker build -t forecast-backend:latest .
```

### Run the Container
```bash
docker run -d \
  --name forecast-backend \
  -p 8000:8000 \
  --env-file .env \
  forecast-backend:latest
```

### Execute Database Seeding inside Container
```bash
docker exec -it forecast-earthings-backend python scripts/seed_initial_data.py
```
