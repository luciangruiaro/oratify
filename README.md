# Oratify

An open-source AI-powered platform for interactive presentations and augmented talks.

## Overview

Oratify enables speakers to create and deliver interactive presentations where audiences can participate in real-time through voting, Q&A, and dynamic content. The platform leverages LLMs to provide AI-generated responses based on the speaker's pre-loaded notes.

## Key Features

- **Interactive Presentations**: Create slides with content, questions, summaries, and conclusions
- **Real-time Audience Participation**: Audience joins via 6-digit code or QR code
- **Live Voting & Responses**: Multiple choice voting with real-time charts
- **AI-Powered Q&A**: Audience questions answered using speaker's notes as context
- **Auto-generated Summaries**: LLM-powered session summaries and conclusions

## Development Status

> **Last updated: 2026-02-07**

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation | Done | 40/40 stories |
| Phase 2: Core Domain | Done | 43/43 stories |
| Phase 3: Live Features | Done | 82/82 stories |
| Phase 4: Intelligence | Not Started | 0/30 stories |
| Phase 5: Management | Not Started | 0/27 stories |
| Phase 6: Quality | Not Started | 0/44 stories |
| Phase 7: Release | Not Started | 0/25 stories |
| **Overall** | **57%** | **165/291 stories** |

### What's Working (Epics 1-12)

- Full project infrastructure (Docker, CI/CD, linting, pre-commit hooks)
- PostgreSQL database with all 6 models and Alembic migrations
- Speaker authentication (register, login, JWT tokens, password reset)
- Presentation CRUD with slug generation, duplication, search/filter
- Slide management with 5 slide types (content, question-text, question-choice, summary, conclusion)
- Image upload and serving
- Full presentation composer UI with drag-and-drop, auto-save, preview mode
- Session management (create, start/end/pause, join codes, slide tracking)
- Audience join flow (code entry, QR code, slug URL, name entry, waiting/ended screens)
- WebSocket infrastructure (connection manager, room grouping, reconnection, all event types)
- Full presenter view (slide display, navigation, session controls, response feed, keyboard shortcuts)
- Full audience view (slide display, text responses, voting, question FAB, AI responses, haptic feedback)

### Next Up

- **Epic 13**: Response Handling - Backend API for response submission and aggregation
- **Epic 14**: AI Integration - LiteLLM service for Q&A, summaries, conclusions

See [backlog-tracker.md](docs/backlog-tracker.md) for detailed progress.

## Project Structure

```
oratify/
├── app/
│   ├── backend/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/             # API route handlers
│   │   │   │   ├── auth.py      # Authentication endpoints
│   │   │   │   ├── presentations.py
│   │   │   │   ├── slides.py
│   │   │   │   ├── sessions.py
│   │   │   │   ├── uploads.py
│   │   │   │   ├── websocket.py # WS endpoint
│   │   │   │   └── deps.py      # Dependencies (auth, db)
│   │   │   ├── core/            # Config, security, database, WS manager
│   │   │   ├── models/          # SQLAlchemy models (6 models)
│   │   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── services/        # Business logic + WS events
│   │   │   └── main.py          # FastAPI app entry
│   │   ├── alembic/             # Database migrations
│   │   ├── tests/               # Backend tests
│   │   ├── scripts/             # Utility scripts (seed data)
│   │   └── Dockerfile.dev
│   │
│   └── frontend/                # React frontend
│       ├── src/
│       │   ├── api/             # API client (Axios + WS)
│       │   ├── components/
│       │   │   ├── common/      # ProtectedRoute, ConnectionStatus, QRCode
│       │   │   ├── composer/    # Slide editors (5 types) + supporting
│       │   │   └── presentations/
│       │   ├── features/        # Redux slices (auth, presentations, slides)
│       │   ├── hooks/           # useAuth, useWebSocket, redux hooks
│       │   ├── pages/
│       │   │   ├── auth/        # Login, Register, ResetPassword
│       │   │   ├── speaker/     # Dashboard, Composer, Settings
│       │   │   ├── presenter/   # PresenterPage + 11 components
│       │   │   └── audience/    # Join flow (6 screens) + audience view (13 components)
│       │   ├── store/           # Redux store config
│       │   └── styles/          # Global CSS
│       └── Dockerfile.dev
│
├── docs/                        # Documentation
│   ├── raw/                     # Raw ideas & notes
│   ├── prd.md                   # Product Requirements
│   ├── backlog.md               # Full backlog (291 stories)
│   └── backlog-tracker.md       # Progress tracking
│
├── .github/workflows/ci.yml    # CI pipeline
├── architecture.mmd             # System architecture (Mermaid)
├── docker-compose.yml           # Development environment
├── .env.example                 # Environment template
├── .pre-commit-config.yaml      # Pre-commit hooks
└── .gitignore
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Composer   │  │  Presenter   │  │  Audience View   │   │
│  │   ✅ Done    │  │   ✅ Done    │  │   ✅ Done        │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    REST API + WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                     │
│         Redux Toolkit │ React Router │ Axios │ WebSocket      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐     │
│  │  REST API  │  │  WebSocket │  │   LLM Service      │     │
│  │  ✅ Done   │  │  ✅ Done   │  │   🔲 Not Started   │     │
│  └────────────┘  └────────────┘  └────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │           SQLAlchemy ORM + Pydantic Schemas ✅      │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database ✅                       │
└─────────────────────────────────────────────────────────────┘
```

See `architecture.mmd` for detailed Mermaid diagram with implementation status.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Redux Toolkit, React Router 6 |
| Backend | Python 3.11, FastAPI, SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL 15 |
| Real-time | FastAPI WebSockets |
| LLM (planned) | LiteLLM (OpenAI GPT-4o-mini, Ollama) |
| Deployment | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Testing | Pytest (BE), Vitest + RTL (FE) |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Development with Docker

```bash
# Clone the repository
git clone https://github.com/your-org/oratify.git
cd oratify

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up

# Access:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Local Development

**Backend:**
```bash
cd app/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd app/frontend
npm install
npm run dev
```

### Running Tests

**Backend:**
```bash
cd app/backend
pytest
```

**Frontend:**
```bash
cd app/frontend
npm test
```

### Pre-commit Hooks

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://...` |
| `JWT_SECRET_KEY` | Secret for JWT signing | (required) |
| `OPENAI_API_KEY` | OpenAI API key for LLM | (optional - not used yet) |
| `VITE_API_URL` | Backend URL for frontend | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket URL for frontend | `ws://localhost:8000` |

See `.env.example` for full list.

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark | `#2c2d2f` | Backgrounds |
| Cyan | `#0de7e7` | Primary accent |
| Red | `#c73a52` | Secondary accent |
| Light | `#eeeeee` | Text, light backgrounds |

## Documentation

- [Product Requirements (PRD)](docs/prd.md)
- [Backlog](docs/backlog.md)
- [Backlog Tracker](docs/backlog-tracker.md)

## License

Open source - see LICENSE file for details.

## Contributing

1. Install pre-commit hooks: `pre-commit install`
2. Follow code style (Black/Ruff for Python, ESLint/Prettier for TypeScript)
3. Write tests for new features
4. Update documentation as needed
