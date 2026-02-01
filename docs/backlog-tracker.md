# Oratify - Backlog Tracker

> Last Updated: 2026-02-01

## Progress Overview

| Phase | Status | Progress | Completed | Total |
|-------|--------|----------|-----------|-------|
| Phase 1: Foundation | Done | 100% | 40 | 40 |
| Phase 2: Core Domain | Done | 100% | 43 | 43 |
| Phase 3: Live Features | In Progress | 60% | 49 | 82 |
| Phase 4: Intelligence | Not Started | 0% | 0 | 30 |
| Phase 5: Management | Not Started | 0% | 0 | 27 |
| Phase 6: Quality | Not Started | 0% | 0 | 44 |
| Phase 7: Release | Not Started | 0% | 0 | 25 |
| **Grand Total** | **In Progress** | **47%** | **132** | **281** |

---

## Phase 1: Foundation

### Epic 1: Project Setup & Infrastructure
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 1.1 | Initialize monorepo folder structure | Done | 2 |
| 1.2 | Create backend scaffolding with FastAPI | Done | 4 |
| 1.3 | Create frontend scaffolding with React and Vite | Done | 4 |
| 1.4 | Configure Redux Toolkit store | Done | 2 |
| 1.5 | Set up PostgreSQL with Docker | Done | 2 |
| 1.6 | Create Docker Compose for development environment | Done | 3 |
| 1.7 | Configure environment variables and .env handling | Done | 2 |
| 1.8 | Set up ESLint and Prettier for frontend | Done | 1 |
| 1.9 | Set up Ruff and Black for backend | Done | 1 |
| 1.10 | Configure pre-commit hooks | Done | 1 |
| 1.11 | Create GitHub Actions CI pipeline | Done | 3 |
| 1.12 | Set up health check endpoint | Done | 1 |
| | **Epic 1 Total** | **Done** | **26** |

### Epic 2: Database Schema & ORM
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 2.1 | Configure SQLAlchemy with async support | Done | 3 |
| 2.2 | Set up Alembic for migrations | Done | 2 |
| 2.3 | Create Speaker model | Done | 2 |
| 2.4 | Create Presentation model | Done | 2 |
| 2.5 | Create Slide model with JSONB content | Done | 3 |
| 2.6 | Create Session model | Done | 2 |
| 2.7 | Create Participant model | Done | 2 |
| 2.8 | Create Response model | Done | 2 |
| 2.9 | Create initial migration | Done | 1 |
| 2.10 | Create seed data script for development | Done | 2 |
| | **Epic 2 Total** | **Done** | **21** |

### Epic 3: Speaker Authentication
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 3.1 | Implement password hashing utility | Done | 1 |
| 3.2 | Implement JWT token generation service | Done | 2 |
| 3.3 | Implement JWT token validation middleware | Done | 2 |
| 3.4 | Create speaker registration endpoint | Done | 3 |
| 3.5 | Create speaker login endpoint | Done | 2 |
| 3.6 | Create token refresh endpoint | Done | 2 |
| 3.7 | Create get current speaker endpoint | Done | 1 |
| 3.8 | Create password reset request endpoint | Done | 3 |
| 3.9 | Create password reset confirmation endpoint | Done | 2 |
| 3.10 | Create auth context provider in frontend | Done | 3 |
| 3.11 | Create protected route wrapper component | Done | 2 |
| 3.12 | Build login page | Done | 4 |
| 3.13 | Build registration page | Done | 4 |
| 3.14 | Build password reset request page | Done | 2 |
| 3.15 | Build password reset confirmation page | Done | 2 |
| 3.16 | Implement auth state persistence in localStorage | Done | 1 |
| 3.17 | Implement logout functionality | Done | 1 |
| 3.18 | Add auth token to API request interceptor | Done | 2 |
| | **Epic 3 Total** | **Done** | **39** |

**Phase 1 Total: 86 hours**

---

## Phase 2: Core Domain

### Epic 4: Presentation Management
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 4.1 | Create presentation CRUD endpoints | Done | 4 |
| 4.2 | Implement slug generation and uniqueness validation | Done | 2 |
| 4.3 | Implement presentation status state machine | Done | 2 |
| 4.4 | Create speaker notes text field handling | Done | 1 |
| 4.5 | Build presentations list page | Done | 4 |
| 4.6 | Build presentation card component | Done | 2 |
| 4.7 | Build create presentation modal | Done | 3 |
| 4.8 | Build presentation settings page | Done | 4 |
| 4.9 | Implement presentation duplication | Done | 2 |
| 4.10 | Implement presentation deletion with confirmation | Done | 2 |
| 4.11 | Add presentation search and filtering | Done | 3 |
| | **Epic 4 Total** | **Done** | **29** |

### Epic 5: Slide Management Backend
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 5.1 | Create slide CRUD endpoints | Done | 4 |
| 5.2 | Implement slide ordering logic | Done | 2 |
| 5.3 | Create bulk reorder slides endpoint | Done | 2 |
| 5.4 | Define JSONB schema for content slide type | Done | 2 |
| 5.5 | Define JSONB schema for question slide type (text) | Done | 2 |
| 5.6 | Define JSONB schema for question slide type (multiple choice) | Done | 2 |
| 5.7 | Define JSONB schema for summary slide type | Done | 1 |
| 5.8 | Define JSONB schema for conclusion slide type | Done | 1 |
| 5.9 | Implement slide content validation per type | Done | 3 |
| 5.10 | Create image upload endpoint | Done | 4 |
| 5.11 | Implement image storage and serving | Done | 3 |
| | **Epic 5 Total** | **Done** | **26** |

### Epic 6: Presentation Composer UI
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 6.1 | Build composer page layout | Done | 4 |
| 6.2 | Build slide thumbnail component | Done | 2 |
| 6.3 | Build slide thumbnail list in sidebar | Done | 3 |
| 6.4 | Implement drag-and-drop slide reordering | Done | 4 |
| 6.5 | Build add slide dropdown menu | Done | 2 |
| 6.6 | Build delete slide with confirmation | Done | 2 |
| 6.7 | Build content slide editor | Done | 4 |
| 6.8 | Build image upload component with preview | Done | 4 |
| 6.9 | Build rich text editor for slide content | Done | 6 |
| 6.10 | Build question slide editor (text input type) | Done | 3 |
| 6.11 | Build question slide editor (multiple choice type) | Done | 4 |
| 6.12 | Build multiple choice options editor | Done | 3 |
| 6.13 | Build summary slide configuration panel | Done | 2 |
| 6.14 | Build conclusion slide configuration panel | Done | 2 |
| 6.15 | Build speaker notes editor in properties panel | Done | 3 |
| 6.16 | Implement auto-save with debounce | Done | 3 |
| 6.17 | Build save status indicator | Done | 1 |
| 6.18 | Implement unsaved changes warning on navigation | Done | 2 |
| 6.19 | Build preview mode toggle | Done | 2 |
| 6.20 | Build preview mode slide renderer | Done | 4 |
| 6.21 | Add keyboard shortcuts for composer actions | Done | 2 |
| | **Epic 6 Total** | **Done** | **62** |

**Phase 2 Total: 117 hours**

---

## Phase 3: Live Features

### Epic 7: Session Management
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 7.1 | Create session creation endpoint | Done | 3 |
| 7.2 | Implement 6-character join code generator | Done | 1 |
| 7.3 | Implement join code uniqueness validation | Done | 1 |
| 7.4 | Create get session by join code endpoint | Done | 2 |
| 7.5 | Create get session by slug endpoint | Done | 1 |
| 7.6 | Create start session endpoint | Done | 2 |
| 7.7 | Create end session endpoint | Done | 2 |
| 7.8 | Create pause/resume session endpoint | Done | 2 |
| 7.9 | Implement current slide tracking | Done | 2 |
| 7.10 | Create change current slide endpoint | Done | 2 |
| 7.11 | Implement session expiration handling | Done | 2 |
| 7.12 | Create session statistics endpoint | Done | 2 |
| | **Epic 7 Total** | **Done** | **22** |

### Epic 8: Join Flow
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 8.1 | Build join page with code input | Done | 3 |
| 8.2 | Build join page code validation and submission | Done | 2 |
| 8.3 | Create QR code generation utility | Done | 2 |
| 8.4 | Build QR code display component | Done | 2 |
| 8.5 | Build join URL with slug handling | Done | 2 |
| 8.6 | Build optional name entry screen | Done | 2 |
| 8.7 | Build session not found error screen | Done | 1 |
| 8.8 | Build session not started waiting screen | Done | 2 |
| 8.9 | Build session ended screen | Done | 2 |
| 8.10 | Implement join code input auto-formatting | Done | 1 |
| | **Epic 8 Total** | **Done** | **19** |

### Epic 9: WebSocket Infrastructure
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 9.1 | Set up FastAPI WebSocket endpoint | Done | 3 |
| 9.2 | Implement WebSocket connection manager | Done | 4 |
| 9.3 | Implement session-based room grouping | Done | 3 |
| 9.4 | Implement connection lifecycle handling | Done | 3 |
| 9.5 | Implement connection authentication for speakers | Done | 2 |
| 9.6 | Implement anonymous connection for audience | Done | 2 |
| 9.7 | Implement heartbeat ping-pong mechanism | Done | 2 |
| 9.8 | Define WebSocket message format schema | Done | 2 |
| 9.9 | Implement message serialization and deserialization | Done | 2 |
| 9.10 | Implement WebSocket error handling | Done | 2 |
| 9.11 | Build frontend WebSocket connection hook | Done | 4 |
| 9.12 | Implement frontend reconnection with exponential backoff | Done | 3 |
| 9.13 | Build connection status indicator component | Done | 2 |
| | **Epic 9 Total** | **Done** | **34** |

### Epic 10: WebSocket Events
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 10.1 | Implement slide changed event broadcast | Done | 2 |
| 10.2 | Implement participant joined event | Done | 2 |
| 10.3 | Implement participant left event | Done | 2 |
| 10.4 | Implement participant count update event | Done | 1 |
| 10.5 | Implement response submitted event | Done | 2 |
| 10.6 | Implement aggregated vote update event | Done | 3 |
| 10.7 | Implement question asked event | Done | 2 |
| 10.8 | Implement AI response event | Done | 2 |
| 10.9 | Implement session started event | Done | 1 |
| 10.10 | Implement session ended event | Done | 1 |
| 10.11 | Implement session paused/resumed event | Done | 1 |
| 10.12 | Create frontend event handlers for all events | Done | 4 |
| | **Epic 10 Total** | **Done** | **23** |

### Epic 11: Presenter View
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 11.1 | Build presenter view page layout | Pending | 4 |
| 11.2 | Build current slide display component | Pending | 3 |
| 11.3 | Build slide navigation controls | Pending | 2 |
| 11.4 | Build slide thumbnail strip for quick navigation | Pending | 3 |
| 11.5 | Build jump to slide modal | Pending | 2 |
| 11.6 | Build session start button and flow | Pending | 2 |
| 11.7 | Build session end button with confirmation | Pending | 2 |
| 11.8 | Build session pause/resume toggle | Pending | 2 |
| 11.9 | Build join code display panel | Pending | 2 |
| 11.10 | Build QR code display for projection | Pending | 2 |
| 11.11 | Build connected audience counter | Pending | 2 |
| 11.12 | Build session timer display | Pending | 2 |
| 11.13 | Build response counter for current slide | Pending | 2 |
| 11.14 | Build real-time response feed | Pending | 4 |
| 11.15 | Build response feed filtering options | Pending | 2 |
| 11.16 | Build full-screen presentation mode | Pending | 3 |
| 11.17 | Add keyboard shortcuts for presenter navigation | Pending | 2 |
| 11.18 | Build presenter view header with presentation info | Pending | 2 |
| | **Epic 11 Total** | | **43** |

### Epic 12: Audience View
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 12.1 | Build audience view page layout | Pending | 3 |
| 12.2 | Build audience header with session info | Pending | 2 |
| 12.3 | Build content slide display for audience | Pending | 3 |
| 12.4 | Build waiting for next slide state | Pending | 2 |
| 12.5 | Build text response input component | Pending | 2 |
| 12.6 | Build multiple choice voting buttons | Pending | 3 |
| 12.7 | Build response submission handler | Pending | 2 |
| 12.8 | Build response submitted confirmation state | Pending | 2 |
| 12.9 | Build already responded state display | Pending | 2 |
| 12.10 | Build ask question floating action button | Pending | 2 |
| 12.11 | Build question submission modal | Pending | 3 |
| 12.12 | Build AI response display area | Pending | 3 |
| 12.13 | Build AI response loading state | Pending | 2 |
| 12.14 | Build session ended screen for audience | Pending | 2 |
| 12.15 | Build summary slide display for audience | Pending | 2 |
| 12.16 | Build conclusion slide display for audience | Pending | 2 |
| 12.17 | Implement haptic feedback for mobile interactions | Pending | 2 |
| | **Epic 12 Total** | | **39** |

**Phase 3 Total: 180 hours**

---

## Phase 4: Intelligence

### Epic 13: Response Handling & Aggregation
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 13.1 | Create submit response endpoint | Pending | 3 |
| 13.2 | Implement response storage with participant tracking | Pending | 2 |
| 13.3 | Implement duplicate response prevention | Pending | 2 |
| 13.4 | Create get responses for slide endpoint | Pending | 2 |
| 13.5 | Implement multiple choice vote aggregation | Pending | 3 |
| 13.6 | Implement real-time vote count broadcasting | Pending | 3 |
| 13.7 | Build bar chart component for vote display | Pending | 4 |
| 13.8 | Build word cloud component for text responses | Pending | 6 |
| 13.9 | Build response statistics calculation | Pending | 2 |
| 13.10 | Create export responses endpoint | Pending | 3 |
| 13.11 | Build response moderation controls | Pending | 3 |
| | **Epic 13 Total** | | **33** |

### Epic 14: AI Integration
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 14.1 | Set up LiteLLM service | Pending | 3 |
| 14.2 | Create LLM provider configuration schema | Pending | 2 |
| 14.3 | Implement OpenAI provider adapter | Pending | 3 |
| 14.4 | Implement Ollama provider adapter | Pending | 3 |
| 14.5 | Implement provider switching logic | Pending | 2 |
| 14.6 | Implement token counting utility | Pending | 2 |
| 14.7 | Implement context truncation strategy | Pending | 2 |
| 14.8 | Create question answering prompt template | Pending | 2 |
| 14.9 | Create answer audience question endpoint | Pending | 4 |
| 14.10 | Create summary generation prompt template | Pending | 2 |
| 14.11 | Create generate summary endpoint | Pending | 3 |
| 14.12 | Create conclusion generation prompt template | Pending | 2 |
| 14.13 | Create generate conclusion endpoint | Pending | 3 |
| 14.14 | Implement streaming response support | Pending | 4 |
| 14.15 | Build streaming response display component | Pending | 3 |
| 14.16 | Implement AI response caching | Pending | 3 |
| 14.17 | Implement AI request rate limiting | Pending | 2 |
| 14.18 | Implement AI error handling and fallbacks | Pending | 2 |
| 14.19 | Add AI usage tracking per session | Pending | 2 |
| | **Epic 14 Total** | | **49** |

**Phase 4 Total: 82 hours**

---

## Phase 5: Management

### Epic 15: Admin Dashboard
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 15.1 | Build admin layout with navigation sidebar | Pending | 4 |
| 15.2 | Implement admin role authorization | Pending | 3 |
| 15.3 | Build admin login page | Pending | 2 |
| 15.4 | Build speakers list page | Pending | 4 |
| 15.5 | Build speaker detail page | Pending | 3 |
| 15.6 | Build create speaker form | Pending | 3 |
| 15.7 | Build edit speaker form | Pending | 2 |
| 15.8 | Implement speaker deactivation | Pending | 2 |
| 15.9 | Build LLM configuration page | Pending | 4 |
| 15.10 | Implement API key encrypted storage | Pending | 3 |
| 15.11 | Build API key management UI | Pending | 3 |
| 15.12 | Build LLM provider selection UI | Pending | 2 |
| 15.13 | Build model selection per provider UI | Pending | 2 |
| 15.14 | Build system health dashboard | Pending | 4 |
| 15.15 | Build active sessions list | Pending | 3 |
| 15.16 | Build session detail view (admin) | Pending | 3 |
| 15.17 | Build usage statistics page | Pending | 4 |
| 15.18 | Build session history with filtering | Pending | 3 |
| | **Epic 15 Total** | | **54** |

### Epic 16: Plans & Subscription Structure
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 16.1 | Create Plan model in database | Pending | 2 |
| 16.2 | Create speaker-plan association | Pending | 2 |
| 16.3 | Define plan limits schema | Pending | 2 |
| 16.4 | Create plan checking middleware | Pending | 3 |
| 16.5 | Implement usage tracking per speaker | Pending | 3 |
| 16.6 | Create get current usage endpoint | Pending | 2 |
| 16.7 | Build usage display in speaker dashboard | Pending | 3 |
| 16.8 | Create plan upgrade/downgrade endpoints | Pending | 2 |
| 16.9 | Build plan selection UI | Pending | 3 |
| | **Epic 16 Total** | | **22** |

**Phase 5 Total: 76 hours**

---

## Phase 6: Quality

### Epic 17: Error Handling & Resilience
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 17.1 | Define API error response format | Pending | 2 |
| 17.2 | Implement global exception handler (backend) | Pending | 3 |
| 17.3 | Implement validation error formatting | Pending | 2 |
| 17.4 | Build global error boundary (frontend) | Pending | 2 |
| 17.5 | Build error display component | Pending | 2 |
| 17.6 | Build toast notification system | Pending | 3 |
| 17.7 | Implement WebSocket error handling | Pending | 2 |
| 17.8 | Build connection lost overlay | Pending | 2 |
| 17.9 | Implement reconnection attempt UI | Pending | 2 |
| 17.10 | Implement rate limiting on API endpoints | Pending | 3 |
| 17.11 | Implement input sanitization utilities | Pending | 2 |
| 17.12 | Implement XSS prevention measures | Pending | 2 |
| 17.13 | Configure CORS properly for production | Pending | 1 |
| 17.14 | Implement request timeout handling | Pending | 2 |
| | **Epic 17 Total** | | **30** |

### Epic 18: Performance & Optimization
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 18.1 | Optimize database queries with proper indexes | Pending | 4 |
| 18.2 | Implement database connection pooling | Pending | 2 |
| 18.3 | Implement response pagination | Pending | 3 |
| 18.4 | Implement image compression on upload | Pending | 3 |
| 18.5 | Implement image lazy loading | Pending | 2 |
| 18.6 | Optimize frontend bundle with code splitting | Pending | 3 |
| 18.7 | Implement route-based lazy loading | Pending | 2 |
| 18.8 | Implement WebSocket message batching | Pending | 3 |
| 18.9 | Configure proper caching headers | Pending | 2 |
| 18.10 | Implement frontend asset caching strategy | Pending | 2 |
| 18.11 | Add loading skeletons for better perceived performance | Pending | 3 |
| | **Epic 18 Total** | | **29** |

### Epic 19: Testing
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 19.1 | Set up Pytest with async support | Pending | 2 |
| 19.2 | Create test database fixtures | Pending | 3 |
| 19.3 | Write authentication endpoint tests | Pending | 4 |
| 19.4 | Write presentation CRUD tests | Pending | 3 |
| 19.5 | Write slide CRUD tests | Pending | 3 |
| 19.6 | Write session flow tests | Pending | 4 |
| 19.7 | Write response submission tests | Pending | 3 |
| 19.8 | Write WebSocket connection tests | Pending | 4 |
| 19.9 | Write AI integration tests (mocked) | Pending | 3 |
| 19.10 | Set up Jest and React Testing Library | Pending | 2 |
| 19.11 | Write auth component tests | Pending | 3 |
| 19.12 | Write composer component tests | Pending | 4 |
| 19.13 | Write presenter view component tests | Pending | 3 |
| 19.14 | Write audience view component tests | Pending | 3 |
| 19.15 | Set up Playwright for E2E testing | Pending | 3 |
| 19.16 | Write E2E test for speaker registration and login | Pending | 3 |
| 19.17 | Write E2E test for presentation creation | Pending | 4 |
| 19.18 | Write E2E test for live session flow | Pending | 5 |
| 19.19 | Write E2E test for audience join and response | Pending | 4 |
| | **Epic 19 Total** | | **63** |

**Phase 6 Total: 122 hours**

---

## Phase 7: Release

### Epic 20: Documentation
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 20.1 | Configure Swagger/OpenAPI documentation | Pending | 2 |
| 20.2 | Write API endpoint descriptions | Pending | 4 |
| 20.3 | Create README with project overview | Pending | 2 |
| 20.4 | Document development setup instructions | Pending | 3 |
| 20.5 | Document environment variables | Pending | 2 |
| 20.6 | Create deployment guide | Pending | 4 |
| 20.7 | Document architecture decisions | Pending | 3 |
| 20.8 | Create contributing guidelines | Pending | 2 |
| 20.9 | Document WebSocket event specifications | Pending | 3 |
| 20.10 | Create user guide for speakers | Pending | 4 |
| 20.11 | Create admin guide | Pending | 3 |
| | **Epic 20 Total** | | **32** |

### Epic 21: Deployment & DevOps
| ID | Story | Status | Estimate (h) |
|----|-------|--------|--------------|
| 21.1 | Create production Dockerfile for backend | Pending | 3 |
| 21.2 | Create production Dockerfile for frontend | Pending | 3 |
| 21.3 | Create Docker Compose for production | Pending | 3 |
| 21.4 | Configure Gunicorn with Uvicorn workers | Pending | 2 |
| 21.5 | Configure nginx as reverse proxy | Pending | 3 |
| 21.6 | Set up SSL/TLS with Let's Encrypt | Pending | 2 |
| 21.7 | Configure logging for production | Pending | 2 |
| 21.8 | Set up log aggregation | Pending | 3 |
| 21.9 | Create database backup script | Pending | 2 |
| 21.10 | Create database restore script | Pending | 2 |
| 21.11 | Document manual deployment process | Pending | 3 |
| 21.12 | Create GitHub Actions CD pipeline | Pending | 4 |
| 21.13 | Set up staging environment | Pending | 4 |
| 21.14 | Configure environment-specific settings | Pending | 2 |
| | **Epic 21 Total** | | **38** |

**Phase 7 Total: 70 hours**

---

## Estimates Summary

| Phase | Hours |
|-------|-------|
| Phase 1: Foundation | 86 |
| Phase 2: Core Domain | 117 |
| Phase 3: Live Features | 180 |
| Phase 4: Intelligence | 82 |
| Phase 5: Management | 76 |
| Phase 6: Quality | 122 |
| Phase 7: Release | 70 |
| **Grand Total** | **733 hours** |

---

## Recently Completed

| Date | Epic | Story | Description |
|------|------|-------|-------------|
| 2026-01-31 | 1 | 1.1-1.12 | Epic 1: Project Setup & Infrastructure - Complete |
| 2026-01-31 | 2 | 2.1-2.10 | Epic 2: Database Schema & ORM - Complete |
| 2026-01-31 | 3 | 3.1-3.18 | Epic 3: Speaker Authentication - Complete |
| 2026-01-31 | 4 | 4.1-4.11 | Epic 4: Presentation Management - Complete |
| 2026-01-31 | 5 | 5.1-5.11 | Epic 5: Slide Management Backend - Complete |
| 2026-01-31 | 6 | 6.1-6.21 | Epic 6: Presentation Composer UI - Complete |
| 2026-01-31 | 7 | 7.1-7.12 | Epic 7: Session Management - Complete |
| 2026-02-01 | 8 | 8.1-8.10 | Epic 8: Join Flow - Complete (JoinPage, JoinBySlugPage, NameEntryPage, WaitingScreen, EndedScreen, NotFoundScreen, QRCode component) |
| 2026-02-01 | 9 | 9.1-9.12 | Epic 9: WebSocket Infrastructure - Complete (Connection manager, message schemas, WS endpoint, frontend hook) |
| 2026-02-01 | 9 | 9.13 | ConnectionStatus indicator component |
| 2026-02-01 | 10 | 10.6-10.8 | Vote aggregation, question asked, AI response events |

---

## In Progress

| Epic | Story | Description |
|------|-------|-------------|
| 11 | - | Presenter View (Next)

---

## Blocked

_No blocked items._

---

## Notes & Decisions

| Date | Note |
|------|------|
| 2026-01-31 | Initial backlog created with 281 stories across 21 epics |
| 2026-01-31 | MVP scope confirmed: skip presentation website, focus on core app |
| 2026-01-31 | LLM: OpenAI primary (GPT-4o-mini), Ollama secondary, via LiteLLM |
| 2026-01-31 | Target: ~100 concurrent users per session |
| 2026-01-31 | Folder structure: app/backend, app/frontend (not at root) |
| 2026-01-31 | Epic 1 complete - all infrastructure files created |
| 2026-01-31 | Updated all README.md and architecture.mmd files |
| 2026-01-31 | Epic 2 complete - all models and migrations created |
| 2026-01-31 | Epic 3 complete - full speaker authentication (backend + frontend) |
| 2026-01-31 | Epic 4 complete - presentation CRUD, dashboard UI, settings page |
| 2026-01-31 | Epic 5 complete - slide CRUD, JSONB schemas, image upload |
| 2026-01-31 | Epic 6 complete - full presentation composer UI with all 5 slide type editors |
| 2026-01-31 | Epic 7 complete - session management with join codes, status transitions, statistics |
| 2026-02-01 | Epic 8 complete - audience join flow with all screens (JoinPage, NameEntry, Waiting, Ended, NotFound) |
| 2026-02-01 | Epic 9 complete - WebSocket infrastructure with connection manager, message schemas, event broadcasting |
| 2026-02-01 | Added qrcode.react dependency for QR code generation |
| 2026-02-01 | Frontend useWebSocket hook with auto-reconnection (3 attempts) and ping/pong keepalive |
| 2026-02-01 | WebSocket endpoint at /ws/session/{join_code} supports both speaker and audience connections |
| 2026-02-01 | Epic 9 complete - added ConnectionStatus indicator component |
| 2026-02-01 | Epic 10 complete - vote aggregation broadcasts to all clients, question_asked goes to speaker only |
