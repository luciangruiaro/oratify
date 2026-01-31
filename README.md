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

## Project Structure

```
oratify/
├── app/
│   ├── backend/                 # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/             # API route handlers
│   │   │   ├── core/            # Config, security, database
│   │   │   │   └── config.py    # Pydantic Settings
│   │   │   ├── models/          # SQLAlchemy models
│   │   │   ├── schemas/         # Pydantic schemas
│   │   │   ├── services/        # Business logic
│   │   │   └── main.py          # FastAPI app entry
│   │   ├── alembic/             # Database migrations
│   │   ├── tests/               # Backend tests
│   │   ├── scripts/             # Utility scripts
│   │   ├── Dockerfile.dev       # Development container
│   │   ├── requirements.txt     # Production dependencies
│   │   ├── requirements-dev.txt # Dev dependencies
│   │   └── pyproject.toml       # Python project config
│   │
│   └── frontend/                # React frontend
│       ├── src/
│       │   ├── api/             # API client
│       │   ├── components/      # Shared components
│       │   ├── features/        # Feature modules
│       │   ├── hooks/           # Custom hooks
│       │   │   └── redux.ts     # Typed Redux hooks
│       │   ├── pages/           # Page components
│       │   ├── store/           # Redux store
│       │   │   ├── index.ts     # Store config
│       │   │   └── rootReducer.ts
│       │   ├── styles/          # Global styles
│       │   │   └── global.css   # CSS variables & reset
│       │   ├── types/           # TypeScript types
│       │   ├── utils/           # Utilities
│       │   ├── App.tsx          # Root component
│       │   └── main.tsx         # Entry point
│       ├── Dockerfile.dev       # Development container
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── .eslintrc.cjs
│       └── .prettierrc
│
├── docs/                        # Documentation
│   ├── raw/                     # Raw ideas & notes
│   ├── prd.md                   # Product Requirements
│   ├── backlog.md               # Full backlog
│   └── backlog-tracker.md       # Progress tracking
│
├── .github/
│   └── workflows/
│       └── ci.yml               # CI pipeline
│
├── .env.example                 # Environment template
├── .gitignore
├── .pre-commit-config.yaml      # Pre-commit hooks
├── docker-compose.yml           # Development environment
├── architecture.mmd             # System architecture
└── README.md
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Composer   │  │  Presenter   │  │  Audience View   │   │
│  │   (Desktop)  │  │   (Desktop)  │  │   (Mobile PWA)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    REST API + WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)                    │
│         Redux Toolkit │ React Router │ Axios │ WebSocket     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐     │
│  │  REST API  │  │  WebSocket │  │   LLM Service      │     │
│  │  Endpoints │  │   Manager  │  │   (LiteLLM)        │     │
│  └────────────┘  └────────────┘  └────────────────────┘     │
│  ┌────────────────────────────────────────────────────┐     │
│  │           SQLAlchemy ORM + Pydantic Schemas         │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

See `architecture.mmd` for detailed Mermaid diagram.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite 5, Redux Toolkit, React Router 6 |
| Backend | Python 3.11, FastAPI, SQLAlchemy 2.0, Alembic |
| Database | PostgreSQL 15 |
| LLM | LiteLLM (OpenAI GPT-4o-mini, Ollama) |
| Deployment | Docker, Docker Compose |
| CI/CD | GitHub Actions |

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
| `OPENAI_API_KEY` | OpenAI API key for LLM | (optional) |
| `VITE_API_URL` | Backend URL for frontend | `http://localhost:8000` |

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

## Development Status

See [backlog-tracker.md](docs/backlog-tracker.md) for current progress.

**Current Phase:** Foundation (Epic 1 Complete)

## License

Open source - see LICENSE file for details.

## Contributing

1. Install pre-commit hooks: `pre-commit install`
2. Follow code style (Black/Ruff for Python, ESLint/Prettier for TypeScript)
3. Write tests for new features
4. Update documentation as needed
