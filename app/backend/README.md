# Oratify Backend

FastAPI-based backend for the Oratify platform providing REST API and WebSocket endpoints for interactive presentations.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime |
| FastAPI | 0.109+ | Web framework |
| SQLAlchemy | 2.0+ | ORM (async) |
| Alembic | 1.13+ | Migrations |
| Pydantic | 2.5+ | Validation & settings |
| LiteLLM | 1.17+ | LLM abstraction |
| Pytest | 7.4+ | Testing |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   │                        # - Creates app instance
│   │                        # - Configures CORS middleware
│   │                        # - Mounts API routers
│   │                        # - Defines /health endpoint
│   │
│   ├── api/                 # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py          # POST /api/auth/login, /register, /refresh
│   │   ├── presentations.py # CRUD /api/presentations
│   │   ├── slides.py        # CRUD /api/slides
│   │   ├── sessions.py      # /api/sessions (live session control)
│   │   ├── responses.py     # /api/responses (audience responses)
│   │   ├── admin.py         # /api/admin (admin operations)
│   │   └── websocket.py     # /ws/{session_id} WebSocket handler
│   │
│   ├── core/                # Core configuration & utilities
│   │   ├── __init__.py
│   │   ├── config.py        # Pydantic Settings (env vars)
│   │   │                    # - DATABASE_URL, JWT_SECRET_KEY
│   │   │                    # - CORS_ORIGINS, LLM settings
│   │   ├── security.py      # Password hashing, JWT tokens
│   │   └── database.py      # Async SQLAlchemy engine & session
│   │
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── __init__.py      # Exports all models
│   │   ├── base.py          # Declarative base class
│   │   ├── speaker.py       # Speaker (user) model
│   │   ├── presentation.py  # Presentation model
│   │   ├── slide.py         # Slide model (JSONB content)
│   │   ├── session.py       # Live session model
│   │   ├── participant.py   # Audience participant model
│   │   └── response.py      # Audience response model
│   │
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py          # LoginRequest, TokenResponse, etc.
│   │   ├── presentation.py  # PresentationCreate, PresentationResponse
│   │   ├── slide.py         # SlideCreate, SlideUpdate, content schemas
│   │   ├── session.py       # SessionCreate, SessionResponse
│   │   └── response.py      # ResponseSubmit, ResponseAggregate
│   │
│   └── services/            # Business logic layer
│       ├── __init__.py
│       ├── auth.py          # Authentication logic
│       ├── presentation.py  # Presentation CRUD operations
│       ├── session.py       # Session management
│       ├── llm.py           # LLM integration (LiteLLM)
│       └── websocket.py     # WebSocket connection manager
│
├── alembic/                 # Database migrations
│   ├── versions/            # Migration files
│   ├── env.py               # Alembic environment config
│   └── script.py.mako       # Migration template
│
├── tests/                   # Test suite
│   ├── conftest.py          # Pytest fixtures
│   ├── test_auth.py
│   ├── test_presentations.py
│   └── test_sessions.py
│
├── scripts/                 # Utility scripts
│   └── seed.py              # Development seed data
│
├── Dockerfile.dev           # Development container
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── pyproject.toml           # Python project config (Black, Ruff, Pytest)
├── architecture.mmd         # Backend architecture diagram
└── README.md
```

## API Endpoints

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with DB status |
| GET | `/` | API info |
| GET | `/docs` | Swagger UI |
| GET | `/redoc` | ReDoc |

### Authentication (Epic 3)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register speaker |
| POST | `/api/auth/login` | Login, get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current speaker |
| POST | `/api/auth/password-reset` | Request reset |
| POST | `/api/auth/password-reset/confirm` | Confirm reset |

### Presentations (Epic 4)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presentations` | List speaker's presentations |
| POST | `/api/presentations` | Create presentation |
| GET | `/api/presentations/{id}` | Get presentation |
| PUT | `/api/presentations/{id}` | Update presentation |
| DELETE | `/api/presentations/{id}` | Delete presentation |
| POST | `/api/presentations/{id}/duplicate` | Duplicate |

### Slides (Epic 5)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/presentations/{id}/slides` | List slides |
| POST | `/api/presentations/{id}/slides` | Add slide |
| PUT | `/api/slides/{id}` | Update slide |
| DELETE | `/api/slides/{id}` | Delete slide |
| PUT | `/api/presentations/{id}/slides/reorder` | Reorder |
| POST | `/api/upload/image` | Upload image |

### Sessions (Epic 7)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create session |
| GET | `/api/sessions/{id}` | Get session |
| GET | `/api/sessions/code/{code}` | Get by join code |
| POST | `/api/sessions/{id}/start` | Start session |
| POST | `/api/sessions/{id}/end` | End session |
| POST | `/api/sessions/{id}/slide` | Change slide |

### WebSocket (Epic 9-10)
| Endpoint | Description |
|----------|-------------|
| `/ws/{session_id}` | Real-time session events |

## Configuration

Settings loaded from environment variables via Pydantic Settings (`app/core/config.py`):

```python
# Required
DATABASE_URL      # PostgreSQL connection string
JWT_SECRET_KEY    # Secret for JWT signing

# Optional with defaults
DEBUG             # Enable debug mode (default: false)
BACKEND_PORT      # Server port (default: 8000)
CORS_ORIGINS      # Allowed origins (default: localhost:3000)
LLM_PROVIDER      # openai or ollama (default: openai)
OPENAI_API_KEY    # OpenAI API key
OLLAMA_BASE_URL   # Ollama server URL
```

See `.env.example` in project root for full list.

## Development

### Local Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-dev.txt

# Set environment variables
export DATABASE_URL="postgresql+asyncpg://oratify:oratify@localhost:5432/oratify"
export JWT_SECRET_KEY="dev-secret-key"

# Run migrations (after Epic 2)
alembic upgrade head

# Start dev server with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
# From project root
docker-compose up backend

# Or build standalone
docker build -f Dockerfile.dev -t oratify-backend .
docker run -p 8000:8000 --env-file ../../.env oratify-backend
```

### Code Quality

```bash
# Format code
black .

# Lint code
ruff check .
ruff check . --fix  # Auto-fix

# Type check
mypy app

# Run tests
pytest
pytest --cov=app  # With coverage
```

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current
```

## WebSocket Protocol

### Connection
```
ws://localhost:8000/ws/{session_id}?token={jwt_token}
```

### Message Format
```json
{
  "type": "event_type",
  "payload": { },
  "timestamp": "2026-01-31T12:00:00Z"
}
```

### Events
| Type | Direction | Description |
|------|-----------|-------------|
| `slide_changed` | Server → Client | Current slide updated |
| `participant_joined` | Server → All | New participant |
| `participant_left` | Server → All | Participant disconnected |
| `response_submitted` | Client → Server | Audience response |
| `vote_update` | Server → All | Aggregated votes |
| `question_asked` | Client → Server | Audience question |
| `ai_response` | Server → Client | AI answer |
| `session_started` | Server → All | Session began |
| `session_ended` | Server → All | Session ended |

## Testing

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run with verbose output
pytest -v
```

Test fixtures in `tests/conftest.py` provide:
- Async test client
- Test database session
- Mock authentication
- Sample data factories
