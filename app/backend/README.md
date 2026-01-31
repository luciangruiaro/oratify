# Oratify Backend

FastAPI-based backend for Oratify platform.

## Tech Stack

- **Framework**: FastAPI
- **Server**: Gunicorn + Uvicorn workers
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **Auth**: JWT (python-jose)
- **LLM**: LiteLLM (OpenAI, Ollama adapters)
- **Testing**: Pytest

## Project Structure

```
backend/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── presentations.py # Presentation CRUD
│   │   ├── slides.py        # Slide management
│   │   ├── sessions.py      # Live session control
│   │   ├── responses.py     # Response handling
│   │   ├── admin.py         # Admin endpoints
│   │   └── websocket.py     # WebSocket handler
│   ├── core/                # Core configuration
│   │   ├── config.py        # Settings (env vars)
│   │   ├── security.py      # Password hashing, JWT
│   │   └── database.py      # DB connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   └── main.py              # FastAPI app entry
├── alembic/                 # Database migrations
├── tests/                   # Test suite
├── scripts/                 # Utility scripts
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
└── README.md
```

## Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements-dev.txt

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

See `.env.example` in the project root for all required variables.

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
