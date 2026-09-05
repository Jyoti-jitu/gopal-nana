#!/bin/sh
set -e

# Default environment variables
PORT="${PORT:-8000}"
WORKERS="${WORKERS:-4}"
TIMEOUT="${TIMEOUT:-120}"

echo "=== Forecast Earthings Backend Container Starting ==="
echo "Port: $PORT | Mode: ${APP_ENV:-production} | Storage: ${MEDIA_STORAGE_TYPE:-cloudinary}"

# Optional automatic database seeding on container start
if [ "$RUN_SEEDING" = "true" ]; then
    echo "Running automatic database seeding..."
    python scripts/seed_initial_data.py || echo "Seeding completed or skipped."
fi

# Execute command based on arguments or environment
if [ "$1" = "dev" ] || [ "$APP_ENV" = "development" ]; then
    echo "Starting Development server with auto-reload..."
    exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT" --reload
elif [ "$1" = "prod" ] || [ -z "$1" ]; then
    echo "Starting Production Gunicorn server with $WORKERS Uvicorn workers..."
    exec gunicorn app.main:app \
        --workers "$WORKERS" \
        --worker-class uvicorn.workers.UvicornWorker \
        --bind "0.0.0.0:$PORT" \
        --timeout "$TIMEOUT" \
        --access-logfile - \
        --error-logfile -
else
    exec "$@"
fi
