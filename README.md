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

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Composer   │  │  Presenter   │  │  Audience View   │   │
│  │     View     │  │     View     │  │   (Mobile PWA)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    REST API + WebSocket
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐     │
│  │    REST    │  │  WebSocket │  │   LLM Service      │     │
│  │    API     │  │   Manager  │  │   (LiteLLM)        │     │
│  └────────────┘  └────────────┘  └────────────────────┘     │
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
| Frontend | React 18+, Vite, Redux Toolkit |
| Backend | Python 3.11+, FastAPI, SQLAlchemy |
| Database | PostgreSQL 15+ |
| LLM | LiteLLM (OpenAI, Ollama) |
| Deployment | Docker, Docker Compose |

## Project Structure

```
oratify/
├── app/
│   ├── backend/       # FastAPI backend
│   └── frontend/      # React frontend
├── docs/              # Documentation
│   ├── prd.md         # Product Requirements
│   ├── backlog.md     # Full backlog
│   └── backlog-tracker.md
├── docker-compose.yml # Development environment
└── architecture.mmd   # System architecture diagram
```

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/oratify.git
cd oratify

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Documentation

- [Product Requirements (PRD)](docs/prd.md)
- [Backlog](docs/backlog.md)
- [Backlog Tracker](docs/backlog-tracker.md)

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark | `#2c2d2f` | Backgrounds |
| Cyan | `#0de7e7` | Primary accent |
| Red | `#c73a52` | Secondary accent |
| Light | `#eeeeee` | Text, light backgrounds |

## License

Open source - see LICENSE file for details.

## Contributing

See CONTRIBUTING.md for guidelines.
