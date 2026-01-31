#!/bin/bash
set -e

echo "=== Oratify Backend Startup ==="

# Wait for database to be ready
echo "Waiting for database..."
while ! pg_isready -h db -U ${POSTGRES_USER:-oratify} -q; do
    sleep 1
done
echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Run seed script if SEED_DB is set
if [ "${SEED_DB:-false}" = "true" ]; then
    echo "Seeding database..."
    python -m scripts.seed
fi

# Start the server
echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
