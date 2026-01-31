# Oratify - Product Backlog

## Epic 1: Project Setup & Infrastructure

- 1.1 Initialize monorepo folder structure
- 1.2 Create backend scaffolding with FastAPI
- 1.3 Create frontend scaffolding with React and Vite
- 1.4 Configure Redux Toolkit store
- 1.5 Set up PostgreSQL with Docker
- 1.6 Create Docker Compose for development environment
- 1.7 Configure environment variables and .env handling
- 1.8 Set up ESLint and Prettier for frontend
- 1.9 Set up Ruff and Black for backend
- 1.10 Configure pre-commit hooks
- 1.11 Create GitHub Actions CI pipeline
- 1.12 Set up health check endpoint

---

## Epic 2: Database Schema & ORM

- 2.1 Configure SQLAlchemy with async support
- 2.2 Set up Alembic for migrations
- 2.3 Create Speaker model
- 2.4 Create Presentation model
- 2.5 Create Slide model with JSONB content
- 2.6 Create Session model
- 2.7 Create Participant model
- 2.8 Create Response model
- 2.9 Create initial migration
- 2.10 Create seed data script for development

---

## Epic 3: Speaker Authentication

- 3.1 Implement password hashing utility
- 3.2 Implement JWT token generation service
- 3.3 Implement JWT token validation middleware
- 3.4 Create speaker registration endpoint
- 3.5 Create speaker login endpoint
- 3.6 Create token refresh endpoint
- 3.7 Create get current speaker endpoint
- 3.8 Create password reset request endpoint
- 3.9 Create password reset confirmation endpoint
- 3.10 Create auth context provider in frontend
- 3.11 Create protected route wrapper component
- 3.12 Build login page
- 3.13 Build registration page
- 3.14 Build password reset request page
- 3.15 Build password reset confirmation page
- 3.16 Implement auth state persistence in localStorage
- 3.17 Implement logout functionality
- 3.18 Add auth token to API request interceptor

---

## Epic 4: Presentation Management

- 4.1 Create presentation CRUD endpoints
- 4.2 Implement slug generation and uniqueness validation
- 4.3 Implement presentation status state machine (draft/active/ended)
- 4.4 Create speaker notes text field handling
- 4.5 Build presentations list page
- 4.6 Build presentation card component
- 4.7 Build create presentation modal
- 4.8 Build presentation settings page
- 4.9 Implement presentation duplication
- 4.10 Implement presentation deletion with confirmation
- 4.11 Add presentation search and filtering

---

## Epic 5: Slide Management Backend

- 5.1 Create slide CRUD endpoints
- 5.2 Implement slide ordering logic
- 5.3 Create bulk reorder slides endpoint
- 5.4 Define JSONB schema for content slide type
- 5.5 Define JSONB schema for question slide type (text)
- 5.6 Define JSONB schema for question slide type (multiple choice)
- 5.7 Define JSONB schema for summary slide type
- 5.8 Define JSONB schema for conclusion slide type
- 5.9 Implement slide content validation per type
- 5.10 Create image upload endpoint
- 5.11 Implement image storage and serving

---

## Epic 6: Presentation Composer UI

- 6.1 Build composer page layout (sidebar, main editor, properties panel)
- 6.2 Build slide thumbnail component
- 6.3 Build slide thumbnail list in sidebar
- 6.4 Implement drag-and-drop slide reordering
- 6.5 Build add slide dropdown menu
- 6.6 Build delete slide with confirmation
- 6.7 Build content slide editor
- 6.8 Build image upload component with preview
- 6.9 Build rich text editor for slide content
- 6.10 Build question slide editor (text input type)
- 6.11 Build question slide editor (multiple choice type)
- 6.12 Build multiple choice options editor
- 6.13 Build summary slide configuration panel
- 6.14 Build conclusion slide configuration panel
- 6.15 Build speaker notes editor in properties panel
- 6.16 Implement auto-save with debounce
- 6.17 Build save status indicator
- 6.18 Implement unsaved changes warning on navigation
- 6.19 Build preview mode toggle
- 6.20 Build preview mode slide renderer
- 6.21 Add keyboard shortcuts for composer actions

---

## Epic 7: Session Management

- 7.1 Create session creation endpoint
- 7.2 Implement 6-character join code generator
- 7.3 Implement join code uniqueness validation
- 7.4 Create get session by join code endpoint
- 7.5 Create get session by slug endpoint
- 7.6 Create start session endpoint
- 7.7 Create end session endpoint
- 7.8 Create pause/resume session endpoint
- 7.9 Implement current slide tracking
- 7.10 Create change current slide endpoint
- 7.11 Implement session expiration handling
- 7.12 Create session statistics endpoint

---

## Epic 8: Join Flow

- 8.1 Build join page with code input
- 8.2 Build join page code validation and submission
- 8.3 Create QR code generation utility
- 8.4 Build QR code display component
- 8.5 Build join URL with slug handling
- 8.6 Build optional name entry screen
- 8.7 Build session not found error screen
- 8.8 Build session not started waiting screen
- 8.9 Build session ended screen
- 8.10 Implement join code input auto-formatting

---

## Epic 9: WebSocket Infrastructure

- 9.1 Set up FastAPI WebSocket endpoint
- 9.2 Implement WebSocket connection manager
- 9.3 Implement session-based room grouping
- 9.4 Implement connection lifecycle handling (connect/disconnect)
- 9.5 Implement connection authentication for speakers
- 9.6 Implement anonymous connection for audience
- 9.7 Implement heartbeat ping-pong mechanism
- 9.8 Define WebSocket message format schema
- 9.9 Implement message serialization and deserialization
- 9.10 Implement WebSocket error handling
- 9.11 Build frontend WebSocket connection hook
- 9.12 Implement frontend reconnection with exponential backoff
- 9.13 Build connection status indicator component

---

## Epic 10: WebSocket Events

- 10.1 Implement slide changed event broadcast
- 10.2 Implement participant joined event
- 10.3 Implement participant left event
- 10.4 Implement participant count update event
- 10.5 Implement response submitted event
- 10.6 Implement aggregated vote update event
- 10.7 Implement question asked event
- 10.8 Implement AI response event
- 10.9 Implement session started event
- 10.10 Implement session ended event
- 10.11 Implement session paused/resumed event
- 10.12 Create frontend event handlers for all events

---

## Epic 11: Presenter View

- 11.1 Build presenter view page layout
- 11.2 Build current slide display component (large view)
- 11.3 Build slide navigation controls (prev/next)
- 11.4 Build slide thumbnail strip for quick navigation
- 11.5 Build jump to slide modal
- 11.6 Build session start button and flow
- 11.7 Build session end button with confirmation
- 11.8 Build session pause/resume toggle
- 11.9 Build join code display panel
- 11.10 Build QR code display for projection
- 11.11 Build connected audience counter
- 11.12 Build session timer display
- 11.13 Build response counter for current slide
- 11.14 Build real-time response feed
- 11.15 Build response feed filtering options
- 11.16 Build full-screen presentation mode
- 11.17 Add keyboard shortcuts for presenter navigation
- 11.18 Build presenter view header with presentation info

---

## Epic 12: Audience View

- 12.1 Build audience view page layout (mobile-first)
- 12.2 Build audience header with session info
- 12.3 Build content slide display for audience
- 12.4 Build waiting for next slide state
- 12.5 Build text response input component
- 12.6 Build multiple choice voting buttons
- 12.7 Build response submission handler
- 12.8 Build response submitted confirmation state
- 12.9 Build already responded state display
- 12.10 Build ask question floating action button
- 12.11 Build question submission modal
- 12.12 Build AI response display area
- 12.13 Build AI response loading state
- 12.14 Build session ended screen for audience
- 12.15 Build summary slide display for audience
- 12.16 Build conclusion slide display for audience
- 12.17 Implement haptic feedback for mobile interactions

---

## Epic 13: Response Handling & Aggregation

- 13.1 Create submit response endpoint
- 13.2 Implement response storage with participant tracking
- 13.3 Implement duplicate response prevention
- 13.4 Create get responses for slide endpoint
- 13.5 Implement multiple choice vote aggregation
- 13.6 Implement real-time vote count broadcasting
- 13.7 Build bar chart component for vote display
- 13.8 Build word cloud component for text responses
- 13.9 Build response statistics calculation
- 13.10 Create export responses endpoint (CSV/JSON)
- 13.11 Build response moderation controls (hide/show)

---

## Epic 14: AI Integration

- 14.1 Set up LiteLLM service
- 14.2 Create LLM provider configuration schema
- 14.3 Implement OpenAI provider adapter
- 14.4 Implement Ollama provider adapter
- 14.5 Implement provider switching logic
- 14.6 Implement token counting utility
- 14.7 Implement context truncation strategy
- 14.8 Create question answering prompt template
- 14.9 Create answer audience question endpoint
- 14.10 Create summary generation prompt template
- 14.11 Create generate summary endpoint
- 14.12 Create conclusion generation prompt template
- 14.13 Create generate conclusion endpoint
- 14.14 Implement streaming response support
- 14.15 Build streaming response display component
- 14.16 Implement AI response caching
- 14.17 Implement AI request rate limiting
- 14.18 Implement AI error handling and fallbacks
- 14.19 Add AI usage tracking per session

---

## Epic 15: Admin Dashboard

- 15.1 Build admin layout with navigation sidebar
- 15.2 Implement admin role authorization
- 15.3 Build admin login page
- 15.4 Build speakers list page
- 15.5 Build speaker detail page
- 15.6 Build create speaker form
- 15.7 Build edit speaker form
- 15.8 Implement speaker deactivation
- 15.9 Build LLM configuration page
- 15.10 Implement API key encrypted storage
- 15.11 Build API key management UI
- 15.12 Build LLM provider selection UI
- 15.13 Build model selection per provider UI
- 15.14 Build system health dashboard
- 15.15 Build active sessions list
- 15.16 Build session detail view (admin)
- 15.17 Build usage statistics page
- 15.18 Build session history with filtering

---

## Epic 16: Plans & Subscription Structure

- 16.1 Create Plan model in database
- 16.2 Create speaker-plan association
- 16.3 Define plan limits schema (talks per month, audience size)
- 16.4 Create plan checking middleware
- 16.5 Implement usage tracking per speaker
- 16.6 Create get current usage endpoint
- 16.7 Build usage display in speaker dashboard
- 16.8 Create plan upgrade/downgrade endpoints
- 16.9 Build plan selection UI (no payment for MVP)

---

## Epic 17: Error Handling & Resilience

- 17.1 Define API error response format
- 17.2 Implement global exception handler (backend)
- 17.3 Implement validation error formatting
- 17.4 Build global error boundary (frontend)
- 17.5 Build error display component
- 17.6 Build toast notification system
- 17.7 Implement WebSocket error handling
- 17.8 Build connection lost overlay
- 17.9 Implement reconnection attempt UI
- 17.10 Implement rate limiting on API endpoints
- 17.11 Implement input sanitization utilities
- 17.12 Implement XSS prevention measures
- 17.13 Configure CORS properly for production
- 17.14 Implement request timeout handling

---

## Epic 18: Performance & Optimization

- 18.1 Optimize database queries with proper indexes
- 18.2 Implement database connection pooling
- 18.3 Implement response pagination
- 18.4 Implement image compression on upload
- 18.5 Implement image lazy loading
- 18.6 Optimize frontend bundle with code splitting
- 18.7 Implement route-based lazy loading
- 18.8 Implement WebSocket message batching
- 18.9 Configure proper caching headers
- 18.10 Implement frontend asset caching strategy
- 18.11 Add loading skeletons for better perceived performance

---

## Epic 19: Testing

- 19.1 Set up Pytest with async support
- 19.2 Create test database fixtures
- 19.3 Write authentication endpoint tests
- 19.4 Write presentation CRUD tests
- 19.5 Write slide CRUD tests
- 19.6 Write session flow tests
- 19.7 Write response submission tests
- 19.8 Write WebSocket connection tests
- 19.9 Write AI integration tests (mocked)
- 19.10 Set up Jest and React Testing Library
- 19.11 Write auth component tests
- 19.12 Write composer component tests
- 19.13 Write presenter view component tests
- 19.14 Write audience view component tests
- 19.15 Set up Playwright for E2E testing
- 19.16 Write E2E test for speaker registration and login
- 19.17 Write E2E test for presentation creation
- 19.18 Write E2E test for live session flow
- 19.19 Write E2E test for audience join and response

---

## Epic 20: Documentation

- 20.1 Configure Swagger/OpenAPI documentation
- 20.2 Write API endpoint descriptions
- 20.3 Create README with project overview
- 20.4 Document development setup instructions
- 20.5 Document environment variables
- 20.6 Create deployment guide
- 20.7 Document architecture decisions
- 20.8 Create contributing guidelines
- 20.9 Document WebSocket event specifications
- 20.10 Create user guide for speakers
- 20.11 Create admin guide

---

## Epic 21: Deployment & DevOps

- 21.1 Create production Dockerfile for backend
- 21.2 Create production Dockerfile for frontend
- 21.3 Create Docker Compose for production
- 21.4 Configure Gunicorn with Uvicorn workers
- 21.5 Configure nginx as reverse proxy
- 21.6 Set up SSL/TLS with Let's Encrypt
- 21.7 Configure logging for production
- 21.8 Set up log aggregation
- 21.9 Create database backup script
- 21.10 Create database restore script
- 21.11 Document manual deployment process
- 21.12 Create GitHub Actions CD pipeline
- 21.13 Set up staging environment
- 21.14 Configure environment-specific settings

---

## Summary

| Epic | Title | Stories |
|------|-------|---------|
| 1 | Project Setup & Infrastructure | 12 |
| 2 | Database Schema & ORM | 10 |
| 3 | Speaker Authentication | 18 |
| 4 | Presentation Management | 11 |
| 5 | Slide Management Backend | 11 |
| 6 | Presentation Composer UI | 21 |
| 7 | Session Management | 12 |
| 8 | Join Flow | 10 |
| 9 | WebSocket Infrastructure | 13 |
| 10 | WebSocket Events | 12 |
| 11 | Presenter View | 18 |
| 12 | Audience View | 17 |
| 13 | Response Handling & Aggregation | 11 |
| 14 | AI Integration | 19 |
| 15 | Admin Dashboard | 18 |
| 16 | Plans & Subscription Structure | 9 |
| 17 | Error Handling & Resilience | 14 |
| 18 | Performance & Optimization | 11 |
| 19 | Testing | 19 |
| 20 | Documentation | 11 |
| 21 | Deployment & DevOps | 14 |
| **Total** | | **281** |
