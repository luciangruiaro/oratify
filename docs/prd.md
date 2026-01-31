# Oratify - Product Requirements Document (PRD)

## 1. Executive Summary

Oratify is an open-source AI-powered platform for creating and delivering interactive presentations ("Augmented Talks"). It enables real-time audience participation through voting, Q&A, and dynamic content that adapts based on audience input. The platform leverages LLMs to provide AI-generated responses based on the speaker's pre-loaded notes.

**Unique Value Proposition:** Unlike traditional presentation tools (Google Slides) or simple polling tools (Mentimeter), Oratify combines presentation delivery with AI-powered real-time interaction, allowing speakers to dynamically steer discussions based on live audience feedback.

---

## 2. Problem Statement

Traditional presentations suffer from:
- One-way communication with limited audience engagement
- Inability to gauge real-time audience sentiment or understanding
- No mechanism to adapt content based on audience interests
- Q&A sessions are inefficient (limited time, few participants speak)
- No personalized follow-up or summaries for attendees

---

## 3. Goals & Objectives

### Primary Goals (MVP)
1. Enable speakers to create interactive presentations with multiple slide types
2. Allow audiences to join via simple code/QR and participate in real-time
3. Provide AI-powered responses to audience questions based on speaker notes
4. Display real-time aggregated responses and voting results

### Success Metrics
- Audience participation rate > 60% per session
- Average response latency < 2 seconds
- Support 100 concurrent participants per session
- Speaker setup time < 15 minutes for a basic presentation

---

## 4. User Personas

### Speaker
- Conference presenters, trainers, educators, webinar hosts
- Creates and delivers presentations
- Wants real-time feedback and engagement metrics
- Needs simple tools to build interactive content

### Audience Member
- Conference attendees, trainees, students, webinar participants
- Joins via phone/laptop using QR code or 6-digit code
- Wants to participate without friction (no app install)
- May be anonymous or registered

### Admin
- Platform administrator (for self-hosted or SaaS deployments)
- Manages users, plans, and system configuration
- Monitors usage and system health

---

## 5. User Stories

### Speaker Stories
| ID | Story | Priority |
|----|-------|----------|
| S1 | As a speaker, I can create a new presentation with a title and description | Must |
| S2 | As a speaker, I can add slides of different types (content, question, summary, conclusion) | Must |
| S3 | As a speaker, I can upload images for content slides | Must |
| S4 | As a speaker, I can add speaker notes (single text field) for AI context | Must |
| S5 | As a speaker, I can create questions (text input, multiple choice) | Must |
| S6 | As a speaker, I can reorder slides via drag-and-drop | Must |
| S7 | As a speaker, I can preview my presentation | Must |
| S8 | As a speaker, I can start/stop a live session | Must |
| S9 | As a speaker, I can navigate between slides during a live session | Must |
| S10 | As a speaker, I can see real-time responses and vote counts | Must |
| S11 | As a speaker, I can generate a unique join code and QR code | Must |
| S12 | As a speaker, I can set a custom URL slug for my presentation | Should |
| S13 | As a speaker, I can see attendance count and session duration | Should |
| S14 | As a speaker, I can export session results after the talk | Should |

### Audience Stories
| ID | Story | Priority |
|----|-------|----------|
| A1 | As an audience member, I can join a session via 6-digit code | Must |
| A2 | As an audience member, I can join a session via QR code scan | Must |
| A3 | As an audience member, I can see the current slide content | Must |
| A4 | As an audience member, I can submit answers to questions | Must |
| A5 | As an audience member, I can vote on multiple choice options | Must |
| A6 | As an audience member, I can see aggregated results (charts) | Must |
| A7 | As an audience member, I can ask questions to the speaker | Must |
| A8 | As an audience member, I can receive AI-generated answers based on speaker notes | Must |
| A9 | As an audience member, I can remain anonymous or provide my name | Should |
| A10 | As an audience member, I can see session summary/conclusions | Should |

### Admin Stories
| ID | Story | Priority |
|----|-------|----------|
| AD1 | As an admin, I can manage speaker accounts | Must |
| AD2 | As an admin, I can configure LLM provider settings | Must |
| AD3 | As an admin, I can view system health and usage stats | Should |
| AD4 | As an admin, I can configure subscription plans (per talk/per month) | Should |

---

## 6. Functional Requirements

### 6.1 Presentation Composer

**Slide Types:**

1. **Content Slide**
   - Image upload (JPG, PNG, GIF, WebP)
   - Text/markdown content area
   - Optional speaker notes (not shown to audience)

2. **Question Slide**
   - Question text
   - Response type: free text OR multiple choice (2-6 options)
   - Real-time chart display of responses
   - Chart types: bar chart (multiple choice), word cloud (text)

3. **Summary Slide**
   - Auto-generated summary of all discussions/responses so far
   - LLM-powered aggregation of audience inputs
   - Speaker can trigger regeneration

4. **Conclusion Slide**
   - Auto-generated or manual conclusions
   - Key takeaways extracted by LLM
   - Option for speaker to edit

**Composer Features:**
- Drag-and-drop slide reordering
- Slide duplication and deletion
- Preview mode (simulates audience view)
- Auto-save with manual save option
- Speaker notes field (single long text, used as LLM context)

### 6.2 Presenter View

- Current slide display (large)
- Slide navigation (prev/next, jump to slide)
- Thumbnail strip of all slides
- Live metrics panel:
  - Connected audience count
  - Response count for current question
  - Session timer
- Response feed (real-time incoming answers)
- Controls: Start session, End session, Pause responses
- QR code and join code display (for projection)

### 6.3 Audience View

- Mobile-first responsive design
- Join screen: enter 6-digit code OR land via URL
- Optional name entry (or stay anonymous)
- Current slide content display
- Response input (text field or choice buttons)
- "Waiting for next slide" state
- Ask a question button (free-form Q&A)
- AI response display area
- Session ended state with optional summary

### 6.4 Join Mechanism

- 6-digit alphanumeric code (e.g., "ABC123")
- Custom URL: `https://domain.com/join/{slug}`
- QR code generation (encodes join URL)
- No account required for audience
- Session state validation (active, ended, not started)

### 6.5 Real-Time Communication

- WebSocket for bidirectional communication
- Events:
  - Slide change (speaker -> audience)
  - Response submission (audience -> speaker)
  - Vote update (speaker -> all)
  - Question asked (audience -> speaker)
  - AI response (server -> audience member)
  - Participant joined/left
  - Session start/end

### 6.6 AI Integration

**LLM Provider Support:**
- Primary: OpenAI API (GPT-4o-mini)
- Secondary: Local models via Ollama/LMStudio
- Abstraction: LiteLLM or OpenRouter for provider switching

**AI Features:**
- Answer audience questions using speaker notes as context
- Generate summary of all responses
- Generate conclusions/key takeaways
- Response style mimics speaker's tone (based on notes)

**Context Handling:**
- Single text field for speaker notes (no vector DB for MVP)
- Full notes sent as system context with each query
- Token limit handling (truncation strategy)

### 6.7 Authentication & Authorization

**Speaker Authentication:**
- Email + password registration/login
- JWT tokens for session management
- Password reset via email

**Audience:**
- No authentication required
- Optional name collection
- Session-based identification (WebSocket connection ID)

**Roles:**
- Admin: full system access
- Speaker: own presentations only
- Audience: session participation only

### 6.8 Admin Dashboard

- User management (CRUD speakers)
- LLM configuration (API keys, provider selection, model selection)
- Plan management (future: per-talk, monthly subscription)
- System health monitoring
- Usage statistics (sessions, participants, API calls)

---

## 7. Non-Functional Requirements

### Performance
- WebSocket message latency < 200ms
- AI response time < 5 seconds (dependent on LLM)
- Support 100 concurrent audience members per session
- Support 10 concurrent active sessions per deployment

### Scalability
- Horizontal scaling via container orchestration
- Stateless backend (session state in Redis/memory)
- Database connection pooling

### Security
- HTTPS only in production
- JWT token expiration and refresh
- Input sanitization (XSS, SQL injection prevention)
- Rate limiting on API endpoints
- Secure storage of API keys (encrypted)

### Reliability
- Health check endpoints
- Graceful WebSocket reconnection
- Auto-save presentation drafts
- Session recovery on connection drop

### Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (using defined palette)

---

## 8. Technical Architecture

### Stack
| Component | Technology |
|-----------|------------|
| Frontend | React 18+ with Vite |
| State Management | Redux Toolkit |
| Styling | CSS Modules / Tailwind (responsive) |
| Backend | Python 3.11+ with FastAPI |
| Server | Gunicorn with Uvicorn workers |
| Database | PostgreSQL 15+ |
| ORM | SQLAlchemy 2.0 |
| Cache | In-memory (Python dicts) for MVP |
| WebSocket | FastAPI WebSockets |
| LLM Abstraction | LiteLLM |
| Containerization | Docker + Docker Compose |
| Testing | Pytest (BE), Jest + React Testing Library (FE) |

### System Components
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Composer   │  │  Presenter   │  │  Audience View   │   │
│  │     View     │  │     View     │  │   (Mobile PWA)   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Admin Dashboard                     │   │
│  └──────────────────────────────────────────────────────┘   │
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
│  ┌────────────────────────────────────────────────────┐     │
│  │              Session State Manager                  │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                     SQLAlchemy ORM
                              │
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

### Data Models (Core)

```
Speaker
├── id (UUID)
├── email
├── password_hash
├── name
├── created_at
└── plan_type

Presentation
├── id (UUID)
├── speaker_id (FK)
├── title
├── description
├── slug (unique)
├── speaker_notes (TEXT)
├── created_at
├── updated_at
└── status (draft, active, ended)

Slide
├── id (UUID)
├── presentation_id (FK)
├── order_index
├── type (content, question, summary, conclusion)
├── content (JSONB)
└── created_at

Session
├── id (UUID)
├── presentation_id (FK)
├── join_code (6 chars)
├── started_at
├── ended_at
└── current_slide_id (FK)

Participant
├── id (UUID)
├── session_id (FK)
├── display_name (nullable)
├── joined_at
└── connection_id

Response
├── id (UUID)
├── session_id (FK)
├── slide_id (FK)
├── participant_id (FK)
├── content (JSONB)
├── created_at
└── is_ai_response
```

---

## 9. UI/UX Requirements

### Color Palette
**Primary:**
- Dark: `#2c2d2f`
- Cyan (accent): `#0de7e7`
- Red (secondary accent): `#c73a52`
- Light: `#eeeeee`

**Secondary (use sparingly):**
- `#1cb9c8`, `#001240`, `#ed6a5a`, `#292f36`, `#e4c02e`

### Design Principles
- Mobile-first for audience view
- Desktop-optimized for composer and presenter views
- Minimal friction to join (2 taps max)
- Real-time feedback with visual indicators
- Accessible contrast ratios
- Consistent component library

### Key Screens

1. **Join Screen** - Code entry, minimal UI
2. **Audience Slide View** - Current content, response area
3. **Composer** - Left sidebar (slides), center (editor), right (properties)
4. **Presenter View** - Main slide, controls, metrics panel
5. **Admin Dashboard** - Standard data table layouts

---

## 10. Out of Scope (MVP)

The following features are explicitly excluded from MVP:

- Presentation website / marketing site
- Real-time translation
- Video/audio streaming integration
- Native mobile apps (web/PWA only)
- Collaborative editing (multi-speaker)
- Vector database / advanced RAG
- Branching logic (conditional slides based on votes)
- Google Slides import
- Export to PDF/PPT
- Social login (Google, GitHub, etc.)
- Payment processing / billing system
- Advanced analytics and reporting
- Webhooks / API for integrations
- White-labeling

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM API latency affects UX | High | Show loading states, use streaming responses, consider caching common answers |
| WebSocket scalability at 100 users | Medium | Load testing early, implement connection pooling, prepare Redis fallback |
| Speaker notes exceed token limits | Medium | Implement truncation with user warning, show character count |
| Open-source security vulnerabilities | High | Dependency scanning, security-focused code review, rate limiting |
| Scope creep during development | Medium | Strict MVP adherence, backlog prioritization |

---

## 12. Development Phases

### Phase 1: Foundation
- Project setup (Docker, FE, BE scaffolding)
- Database schema and migrations
- Basic authentication (speaker login/register)
- CI/CD pipeline setup

### Phase 2: Core Composer
- Presentation CRUD
- Slide types implementation
- Drag-and-drop ordering
- Speaker notes field
- Preview mode

### Phase 3: Live Session
- Session creation and join codes
- WebSocket infrastructure
- Presenter view with navigation
- Audience view with responses
- Real-time response aggregation

### Phase 4: AI Integration
- LiteLLM integration
- Question answering with speaker notes
- Summary generation
- Conclusion generation

### Phase 5: Polish & Admin
- Admin dashboard
- Error handling and edge cases
- Performance optimization
- Documentation

---

## 13. Open Questions

1. Should session recordings/replays be considered for future versions?
2. What's the data retention policy for responses?
3. Should speakers be able to moderate/hide inappropriate responses?
4. Maximum presentation size (number of slides, image sizes)?

---

## Appendix: Inspiration References

- **Google Slides** - Slide creation UX
- **Twine** - Branching narrative concept (future)
- **Mentimeter** - Real-time audience interaction patterns
