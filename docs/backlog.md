# Oratify - Product Backlog

> This backlog contains all epics and stories for Oratify MVP. Each story includes detailed descriptions and acceptance criteria designed to be self-contained, allowing any developer or AI agent to implement them without additional context.

---

# Phase 1: Foundation

**Description:** Set up the development environment, project structure, database schema, and authentication system. This phase establishes the technical foundation upon which all features will be built.

**Phase Total: 86 hours**

---

## Epic 1: Project Setup & Infrastructure

**Description:** Initialize the monorepo with backend (FastAPI/Python) and frontend (React/Vite) projects, configure Docker for local development, set up linting/formatting tools, and establish CI/CD pipeline.

**Epic Total: 26 hours**

---

### 1.1 Initialize monorepo folder structure

**Estimate:** 2 hours

**Description:**
Create the root project directory structure with separate folders for backend, frontend, and documentation. Include configuration files for the monorepo setup.

**Acceptance Criteria:**
- [ ] Root directory contains: `backend/`, `frontend/`, `docs/`, `docker-compose.yml`, `.gitignore`, `README.md`
- [ ] `backend/` contains empty `app/` directory and `requirements.txt`
- [ ] `frontend/` contains empty `src/` directory and `package.json`
- [ ] `.gitignore` excludes: `node_modules/`, `venv/`, `__pycache__/`, `.env`, `*.pyc`, `dist/`, `build/`
- [ ] `.env.example` file exists with placeholder values for all required environment variables
- [ ] Running `ls` in root shows expected structure

---

### 1.2 Create backend scaffolding with FastAPI

**Estimate:** 4 hours

**Description:**
Set up the FastAPI application structure with proper module organization, including core configuration, API router setup, and application entry point.

**Acceptance Criteria:**
- [ ] `backend/app/main.py` creates FastAPI app instance with title "Oratify API"
- [ ] `backend/app/api/` directory exists with `__init__.py` and empty route files
- [ ] `backend/app/core/` directory contains `config.py` with Pydantic Settings class
- [ ] `backend/app/core/config.py` loads environment variables: `DATABASE_URL`, `JWT_SECRET_KEY`, `DEBUG`
- [ ] `backend/requirements.txt` includes: `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `python-dotenv`
- [ ] Running `uvicorn app.main:app --reload` starts server on port 8000
- [ ] GET `/` returns `{"message": "Oratify API"}`
- [ ] OpenAPI docs available at `/docs`

---

### 1.3 Create frontend scaffolding with React and Vite

**Estimate:** 4 hours

**Description:**
Initialize React project using Vite with TypeScript, set up folder structure, and configure path aliases.

**Acceptance Criteria:**
- [ ] `frontend/` initialized with Vite React-TS template
- [ ] `frontend/src/` contains: `pages/`, `components/`, `features/`, `hooks/`, `api/`, `store/`, `types/`, `utils/`, `styles/`
- [ ] Path alias `@/` configured in `vite.config.ts` and `tsconfig.json` pointing to `src/`
- [ ] `src/App.tsx` renders "Oratify" heading
- [ ] `src/main.tsx` properly mounts App to DOM
- [ ] Running `npm run dev` starts dev server on port 3000
- [ ] Browser shows "Oratify" heading at `http://localhost:3000`
- [ ] No TypeScript or ESLint errors

---

### 1.4 Configure Redux Toolkit store

**Estimate:** 2 hours

**Description:**
Set up Redux Toolkit with store configuration, root reducer, and provider integration in the React app.

**Acceptance Criteria:**
- [ ] `frontend/src/store/index.ts` exports configured Redux store
- [ ] `frontend/src/store/rootReducer.ts` combines all slices (initially empty)
- [ ] Store includes Redux DevTools extension support when `import.meta.env.DEV` is true
- [ ] `src/main.tsx` wraps App with Redux `Provider`
- [ ] Typed hooks `useAppDispatch` and `useAppSelector` exported from `src/hooks/redux.ts`
- [ ] Redux DevTools shows store in browser (when extension installed)
- [ ] No TypeScript errors with strict typing

---

### 1.5 Set up PostgreSQL with Docker

**Estimate:** 2 hours

**Description:**
Create Docker configuration for PostgreSQL database with persistent volume and proper initialization.

**Acceptance Criteria:**
- [ ] `docker-compose.yml` defines `db` service using `postgres:15-alpine` image
- [ ] PostgreSQL port 5432 exposed to host
- [ ] Environment variables for `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` loaded from `.env`
- [ ] Named volume `postgres_data` for data persistence
- [ ] Running `docker-compose up db` starts PostgreSQL container
- [ ] Can connect to database using `psql` or any DB client
- [ ] Data persists after container restart

---

### 1.6 Create Docker Compose for development environment

**Estimate:** 3 hours

**Description:**
Configure Docker Compose to run all services (backend, frontend, database) together with hot-reload support for development.

**Acceptance Criteria:**
- [ ] `docker-compose.yml` defines services: `db`, `backend`, `frontend`
- [ ] Backend service builds from `backend/Dockerfile.dev` with live reload (uvicorn --reload)
- [ ] Frontend service builds from `frontend/Dockerfile.dev` with Vite dev server
- [ ] Backend depends on `db` service
- [ ] Frontend can reach backend at `http://backend:8000`
- [ ] Source directories mounted as volumes for hot-reload
- [ ] Running `docker-compose up` starts all services
- [ ] Code changes in backend/frontend trigger automatic reload
- [ ] `docker-compose down -v` cleanly stops and removes all containers

---

### 1.7 Configure environment variables and .env handling

**Estimate:** 2 hours

**Description:**
Establish environment variable management with `.env` file loading in both backend and frontend, with clear separation of development and production configs.

**Acceptance Criteria:**
- [ ] `.env.example` documents all required variables with descriptions
- [ ] Backend `config.py` uses `pydantic-settings` to load and validate env vars
- [ ] Frontend uses `VITE_` prefixed variables accessible via `import.meta.env`
- [ ] `.env` file is gitignored
- [ ] Docker Compose loads `.env` file automatically
- [ ] Missing required env vars cause clear error messages on startup
- [ ] Variables include: `DATABASE_URL`, `JWT_SECRET_KEY`, `VITE_API_URL`, `VITE_WS_URL`

---

### 1.8 Set up ESLint and Prettier for frontend

**Estimate:** 1 hour

**Description:**
Configure ESLint with Airbnb style guide and Prettier for consistent code formatting in the frontend project.

**Acceptance Criteria:**
- [ ] `.eslintrc.cjs` configured with Airbnb TypeScript rules
- [ ] `.prettierrc` configured with: single quotes, no semicolons (or preferred style)
- [ ] ESLint and Prettier configs are compatible (no conflicts)
- [ ] `package.json` includes scripts: `lint`, `lint:fix`, `format`
- [ ] Running `npm run lint` reports any issues
- [ ] Running `npm run format` formats all files
- [ ] VS Code settings file recommends ESLint and Prettier extensions

---

### 1.9 Set up Ruff and Black for backend

**Estimate:** 1 hour

**Description:**
Configure Ruff (linting) and Black (formatting) for the Python backend to ensure consistent code style.

**Acceptance Criteria:**
- [ ] `pyproject.toml` or `ruff.toml` configures Ruff with reasonable defaults
- [ ] `pyproject.toml` configures Black with line length 88
- [ ] `requirements-dev.txt` includes `ruff` and `black`
- [ ] Running `ruff check app/` reports any issues
- [ ] Running `black app/` formats all Python files
- [ ] Ruff and Black configurations are compatible
- [ ] VS Code settings file recommends Ruff and Black extensions

---

### 1.10 Configure pre-commit hooks

**Estimate:** 1 hour

**Description:**
Set up pre-commit hooks to automatically run linters and formatters before each commit.

**Acceptance Criteria:**
- [ ] `.pre-commit-config.yaml` exists in root directory
- [ ] Hooks include: Black, Ruff (for backend), ESLint, Prettier (for frontend)
- [ ] Running `pre-commit install` sets up git hooks
- [ ] Attempting to commit poorly formatted code triggers hook and fails
- [ ] `pre-commit run --all-files` checks entire codebase
- [ ] README documents how to install pre-commit hooks

---

### 1.11 Create GitHub Actions CI pipeline

**Estimate:** 3 hours

**Description:**
Set up continuous integration workflow that runs tests and linting on every push and pull request.

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` defines CI workflow
- [ ] Workflow triggers on push to `main` and all pull requests
- [ ] Backend job: install dependencies, run Ruff, run Black check, run Pytest
- [ ] Frontend job: install dependencies, run ESLint, run tests
- [ ] Jobs run in parallel where possible
- [ ] Workflow uses caching for pip and npm dependencies
- [ ] Failed checks block PR merge
- [ ] Badge in README shows CI status

---

### 1.12 Set up health check endpoint

**Estimate:** 1 hour

**Description:**
Create a health check endpoint for the backend that verifies service and database connectivity.

**Acceptance Criteria:**
- [ ] GET `/health` returns status 200 with body `{"status": "healthy", "database": "connected"}`
- [ ] If database is unreachable, returns status 503 with `{"status": "unhealthy", "database": "disconnected"}`
- [ ] Response includes `version` field from environment or package
- [ ] Docker Compose can use this endpoint for container health checks
- [ ] Endpoint does not require authentication
- [ ] Response time is under 100ms for healthy state

---

## Epic 2: Database Schema & ORM

**Description:** Configure SQLAlchemy ORM with async support, set up Alembic for database migrations, and create all core data models required for the application.

**Epic Total: 21 hours**

---

### 2.1 Configure SQLAlchemy with async support

**Estimate:** 3 hours

**Description:**
Set up SQLAlchemy 2.0 with async session support for PostgreSQL, including connection pooling and session dependency injection.

**Acceptance Criteria:**
- [ ] `backend/app/core/database.py` creates async engine using `create_async_engine`
- [ ] Connection string uses `postgresql+asyncpg://` protocol
- [ ] `AsyncSessionLocal` session maker configured with `expire_on_commit=False`
- [ ] `get_db` dependency function yields async session and handles cleanup
- [ ] Connection pooling configured with reasonable defaults (pool_size=5, max_overflow=10)
- [ ] `requirements.txt` includes `sqlalchemy[asyncio]`, `asyncpg`
- [ ] Base declarative class created in `backend/app/models/base.py`
- [ ] Test query `SELECT 1` executes successfully

---

### 2.2 Set up Alembic for migrations

**Estimate:** 2 hours

**Description:**
Configure Alembic for database schema migrations with async support and proper environment configuration.

**Acceptance Criteria:**
- [ ] `alembic init alembic` creates migration directory structure
- [ ] `alembic.ini` configured with `sqlalchemy.url` placeholder
- [ ] `alembic/env.py` modified to use async engine and load URL from environment
- [ ] `alembic/env.py` imports all models to detect schema changes
- [ ] Running `alembic revision --autogenerate -m "message"` creates migration file
- [ ] Running `alembic upgrade head` applies all migrations
- [ ] Running `alembic downgrade -1` reverts last migration
- [ ] `alembic current` shows current revision

---

### 2.3 Create Speaker model

**Estimate:** 2 hours

**Description:**
Create the Speaker database model representing users who create and deliver presentations.

**Acceptance Criteria:**
- [ ] `backend/app/models/speaker.py` defines `Speaker` class inheriting from Base
- [ ] Table name is `speakers`
- [ ] Columns: `id` (UUID, primary key, default uuid4), `email` (String, unique, not null, indexed)
- [ ] Columns: `password_hash` (String, not null), `name` (String, not null)
- [ ] Columns: `plan_type` (String, default "free"), `is_active` (Boolean, default True)
- [ ] Columns: `created_at` (DateTime, default utcnow), `updated_at` (DateTime, onupdate utcnow)
- [ ] Relationship: `presentations` (one-to-many with Presentation)
- [ ] Model exported from `backend/app/models/__init__.py`

---

### 2.4 Create Presentation model

**Estimate:** 2 hours

**Description:**
Create the Presentation database model representing a speaker's presentation/talk.

**Acceptance Criteria:**
- [ ] `backend/app/models/presentation.py` defines `Presentation` class
- [ ] Table name is `presentations`
- [ ] Columns: `id` (UUID, primary key), `speaker_id` (UUID, foreign key to speakers.id, not null)
- [ ] Columns: `title` (String(255), not null), `description` (Text, nullable)
- [ ] Columns: `slug` (String(100), unique, indexed), `speaker_notes` (Text, nullable)
- [ ] Columns: `status` (String, default "draft", one of: draft, active, ended)
- [ ] Columns: `created_at` (DateTime), `updated_at` (DateTime)
- [ ] Relationship: `speaker` (many-to-one), `slides` (one-to-many), `sessions` (one-to-many)
- [ ] Cascade delete for slides when presentation deleted

---

### 2.5 Create Slide model with JSONB content

**Estimate:** 3 hours

**Description:**
Create the Slide database model with JSONB content field to store different slide type configurations.

**Acceptance Criteria:**
- [ ] `backend/app/models/slide.py` defines `Slide` class
- [ ] Table name is `slides`
- [ ] Columns: `id` (UUID, primary key), `presentation_id` (UUID, foreign key, not null)
- [ ] Columns: `order_index` (Integer, not null), `type` (String, not null)
- [ ] Column `type` validates against: "content", "question_text", "question_choice", "summary", "conclusion"
- [ ] Column `content` uses PostgreSQL JSONB type for flexible schema
- [ ] Columns: `created_at` (DateTime), `updated_at` (DateTime)
- [ ] Composite index on (presentation_id, order_index)
- [ ] Relationship: `presentation` (many-to-one), `responses` (one-to-many)

---

### 2.6 Create Session model

**Estimate:** 2 hours

**Description:**
Create the Session database model representing a live presentation session that audiences can join.

**Acceptance Criteria:**
- [ ] `backend/app/models/session.py` defines `Session` class
- [ ] Table name is `sessions`
- [ ] Columns: `id` (UUID, primary key), `presentation_id` (UUID, foreign key, not null)
- [ ] Columns: `join_code` (String(6), unique, indexed), `current_slide_id` (UUID, foreign key, nullable)
- [ ] Columns: `status` (String, default "pending", one of: pending, active, paused, ended)
- [ ] Columns: `started_at` (DateTime, nullable), `ended_at` (DateTime, nullable)
- [ ] Columns: `created_at` (DateTime)
- [ ] Relationships: `presentation` (many-to-one), `participants` (one-to-many), `responses` (one-to-many)
- [ ] Index on `join_code` for fast lookup

---

### 2.7 Create Participant model

**Estimate:** 2 hours

**Description:**
Create the Participant database model representing an audience member who has joined a session.

**Acceptance Criteria:**
- [ ] `backend/app/models/participant.py` defines `Participant` class
- [ ] Table name is `participants`
- [ ] Columns: `id` (UUID, primary key), `session_id` (UUID, foreign key, not null)
- [ ] Columns: `display_name` (String(100), nullable), `connection_id` (String, nullable)
- [ ] Columns: `joined_at` (DateTime, default utcnow), `left_at` (DateTime, nullable)
- [ ] Columns: `is_anonymous` (Boolean, default True)
- [ ] Relationship: `session` (many-to-one), `responses` (one-to-many)
- [ ] Index on session_id for counting participants

---

### 2.8 Create Response model

**Estimate:** 2 hours

**Description:**
Create the Response database model storing audience answers to slide questions and AI-generated responses.

**Acceptance Criteria:**
- [ ] `backend/app/models/response.py` defines `Response` class
- [ ] Table name is `responses`
- [ ] Columns: `id` (UUID, primary key), `session_id` (UUID, foreign key, not null)
- [ ] Columns: `slide_id` (UUID, foreign key, not null), `participant_id` (UUID, foreign key, nullable)
- [ ] Column `content` uses PostgreSQL JSONB for flexible response data
- [ ] Columns: `is_ai_response` (Boolean, default False), `created_at` (DateTime)
- [ ] Composite unique constraint on (session_id, slide_id, participant_id) to prevent duplicates
- [ ] Relationships: `session`, `slide`, `participant` (many-to-one each)
- [ ] Index on (session_id, slide_id) for aggregation queries

---

### 2.9 Create initial migration

**Estimate:** 1 hour

**Description:**
Generate and apply the initial Alembic migration containing all defined models.

**Acceptance Criteria:**
- [ ] Running `alembic revision --autogenerate -m "initial schema"` generates migration
- [ ] Migration file creates all tables: speakers, presentations, slides, sessions, participants, responses
- [ ] All foreign keys, indexes, and constraints properly defined
- [ ] Running `alembic upgrade head` successfully creates all tables
- [ ] Database inspection shows all tables with correct columns
- [ ] Running `alembic downgrade base` removes all tables cleanly

---

### 2.10 Create seed data script for development

**Estimate:** 2 hours

**Description:**
Create a script to populate the database with sample data for development and testing purposes.

**Acceptance Criteria:**
- [ ] `backend/scripts/seed.py` creates sample data when executed
- [ ] Creates 2 sample speakers with known test credentials (e.g., `test@example.com` / `password123`)
- [ ] Creates 2 presentations per speaker with 5 slides each (mix of all slide types)
- [ ] Creates 1 active session with sample participants and responses
- [ ] Script is idempotent (safe to run multiple times, clears existing seed data first)
- [ ] Can run via `python -m scripts.seed` from backend directory
- [ ] Outputs summary of created records

---

## Epic 3: Speaker Authentication

**Description:** Implement complete authentication system for speakers including registration, login, JWT token management, and password reset functionality for both backend API and frontend UI.

**Epic Total: 39 hours**

---

### 3.1 Implement password hashing utility

**Estimate:** 1 hour

**Description:**
Create secure password hashing and verification utilities using bcrypt.

**Acceptance Criteria:**
- [ ] `backend/app/core/security.py` contains `hash_password(plain: str) -> str` function
- [ ] `backend/app/core/security.py` contains `verify_password(plain: str, hashed: str) -> bool` function
- [ ] Uses `bcrypt` or `passlib[bcrypt]` for hashing
- [ ] Hash includes salt (handled automatically by bcrypt)
- [ ] `requirements.txt` includes `passlib[bcrypt]`
- [ ] Unit test verifies correct password validates
- [ ] Unit test verifies incorrect password fails validation
- [ ] Hashing same password twice produces different hashes

---

### 3.2 Implement JWT token generation service

**Estimate:** 2 hours

**Description:**
Create JWT token generation for access and refresh tokens with configurable expiration.

**Acceptance Criteria:**
- [ ] `backend/app/core/security.py` contains `create_access_token(data: dict) -> str`
- [ ] `backend/app/core/security.py` contains `create_refresh_token(data: dict) -> str`
- [ ] Access token expires based on `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` (default 30)
- [ ] Refresh token expires based on `JWT_REFRESH_TOKEN_EXPIRE_DAYS` (default 7)
- [ ] Tokens include `sub` (subject/user id), `exp` (expiration), `type` (access/refresh)
- [ ] Uses `python-jose[cryptography]` for JWT handling
- [ ] `requirements.txt` includes `python-jose[cryptography]`
- [ ] Generated tokens can be decoded and verified

---

### 3.3 Implement JWT token validation middleware

**Estimate:** 2 hours

**Description:**
Create FastAPI dependency for validating JWT tokens and extracting current user from protected endpoints.

**Acceptance Criteria:**
- [ ] `backend/app/api/deps.py` contains `get_current_speaker` dependency
- [ ] Dependency extracts token from `Authorization: Bearer <token>` header
- [ ] Invalid or expired tokens raise `HTTPException` with 401 status
- [ ] Valid tokens return Speaker object from database
- [ ] Inactive speakers (is_active=False) raise 401
- [ ] Missing token raises 401 with message "Not authenticated"
- [ ] `get_current_active_speaker` variant enforces is_active=True
- [ ] Dependency can be used on any endpoint: `speaker: Speaker = Depends(get_current_speaker)`

---

### 3.4 Create speaker registration endpoint

**Estimate:** 3 hours

**Description:**
Create API endpoint for new speaker registration with validation and duplicate checking.

**Acceptance Criteria:**
- [ ] POST `/api/auth/register` accepts JSON: `{email, password, name}`
- [ ] Email validated as proper email format
- [ ] Password minimum length 8 characters
- [ ] Duplicate email returns 400 with message "Email already registered"
- [ ] Success creates speaker with hashed password, returns 201
- [ ] Response body: `{id, email, name, created_at}` (no password)
- [ ] Automatically generates access and refresh tokens in response
- [ ] Response includes `access_token` and `refresh_token` fields
- [ ] Pydantic schema `SpeakerCreate` validates input

---

### 3.5 Create speaker login endpoint

**Estimate:** 2 hours

**Description:**
Create API endpoint for speaker authentication with email and password.

**Acceptance Criteria:**
- [ ] POST `/api/auth/login` accepts JSON: `{email, password}`
- [ ] Invalid email returns 401 "Invalid credentials"
- [ ] Invalid password returns 401 "Invalid credentials" (same message for security)
- [ ] Inactive speaker returns 401 "Account is deactivated"
- [ ] Success returns 200 with `{access_token, refresh_token, token_type: "bearer"}`
- [ ] Access token contains speaker ID as subject
- [ ] Login timestamp optionally recorded on speaker record
- [ ] Pydantic schema `LoginRequest` validates input

---

### 3.6 Create token refresh endpoint

**Estimate:** 2 hours

**Description:**
Create API endpoint to obtain new access token using refresh token.

**Acceptance Criteria:**
- [ ] POST `/api/auth/refresh` accepts JSON: `{refresh_token}`
- [ ] Invalid refresh token returns 401
- [ ] Expired refresh token returns 401 with "Refresh token expired"
- [ ] Token type must be "refresh", not "access"
- [ ] Success returns 200 with new `{access_token, refresh_token}`
- [ ] Old refresh token should ideally be invalidated (or implement token rotation)
- [ ] Speaker must exist and be active

---

### 3.7 Create get current speaker endpoint

**Estimate:** 1 hour

**Description:**
Create API endpoint to retrieve the currently authenticated speaker's profile.

**Acceptance Criteria:**
- [ ] GET `/api/auth/me` requires authentication (access token)
- [ ] Returns 200 with speaker data: `{id, email, name, plan_type, created_at}`
- [ ] Does not return password_hash
- [ ] Returns 401 if not authenticated
- [ ] Returns 401 if speaker no longer active
- [ ] Pydantic schema `SpeakerResponse` defines output format

---

### 3.8 Create password reset request endpoint

**Estimate:** 3 hours

**Description:**
Create API endpoint to initiate password reset by sending reset token (simulated for MVP, actual email later).

**Acceptance Criteria:**
- [ ] POST `/api/auth/password-reset` accepts JSON: `{email}`
- [ ] Always returns 200 with `{message: "If email exists, reset link sent"}` (security)
- [ ] If email exists, generates reset token with 1-hour expiration
- [ ] Reset token stored in database or cache (linked to speaker)
- [ ] For MVP: log the reset token/link to console (no actual email)
- [ ] Reset token is random, at least 32 characters
- [ ] Multiple requests invalidate previous tokens

---

### 3.9 Create password reset confirmation endpoint

**Estimate:** 2 hours

**Description:**
Create API endpoint to complete password reset using the reset token.

**Acceptance Criteria:**
- [ ] POST `/api/auth/password-reset/confirm` accepts JSON: `{token, new_password}`
- [ ] Invalid token returns 400 "Invalid or expired reset token"
- [ ] Expired token (>1 hour) returns 400 with expiration message
- [ ] New password validated (minimum 8 characters)
- [ ] Success updates speaker password_hash, invalidates token
- [ ] Returns 200 with `{message: "Password reset successful"}`
- [ ] Speaker can login with new password

---

### 3.10 Create auth context provider in frontend

**Estimate:** 3 hours

**Description:**
Create React context for managing authentication state and providing auth methods throughout the application.

**Acceptance Criteria:**
- [ ] `frontend/src/features/auth/AuthContext.tsx` exports `AuthProvider` and `useAuth` hook
- [ ] Context provides: `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, `register`
- [ ] `login(email, password)` calls API and stores tokens
- [ ] `register(email, password, name)` calls API and stores tokens
- [ ] `logout()` clears tokens and user state
- [ ] On mount, checks localStorage for existing tokens and validates
- [ ] Expired tokens trigger automatic logout
- [ ] Context wrapped around app in `main.tsx` or `App.tsx`

---

### 3.11 Create protected route wrapper component

**Estimate:** 2 hours

**Description:**
Create a route wrapper component that redirects unauthenticated users to login page.

**Acceptance Criteria:**
- [ ] `frontend/src/components/common/ProtectedRoute.tsx` component created
- [ ] Wraps children and checks `useAuth().isAuthenticated`
- [ ] If not authenticated and not loading, redirects to `/login`
- [ ] Preserves intended destination in redirect (e.g., `/login?redirect=/dashboard`)
- [ ] Shows loading spinner while auth state is being determined
- [ ] Can be used: `<ProtectedRoute><DashboardPage /></ProtectedRoute>`
- [ ] Optionally accepts `requiredRole` prop for admin routes

---

### 3.12 Build login page

**Estimate:** 4 hours

**Description:**
Create the login page UI with email/password form, validation, error handling, and links to register/reset password.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/auth/LoginPage.tsx` renders login form
- [ ] Form fields: email (type="email"), password (type="password")
- [ ] Client-side validation: email format, password not empty
- [ ] Submit button disabled while submitting (shows loading state)
- [ ] API errors displayed below form (e.g., "Invalid credentials")
- [ ] Success redirects to `/dashboard` or original destination
- [ ] Link to "Create an account" -> `/register`
- [ ] Link to "Forgot password?" -> `/reset-password`
- [ ] Page uses app color palette, mobile responsive
- [ ] Route configured at `/login`

---

### 3.13 Build registration page

**Estimate:** 4 hours

**Description:**
Create the registration page UI with form for new speaker sign up.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/auth/RegisterPage.tsx` renders registration form
- [ ] Form fields: name, email, password, confirm password
- [ ] Client-side validation: name required, email format, password min 8 chars, passwords match
- [ ] Submit button disabled while submitting
- [ ] API errors displayed (e.g., "Email already registered")
- [ ] Success redirects to `/dashboard`
- [ ] Link to "Already have an account?" -> `/login`
- [ ] Page uses app color palette, mobile responsive
- [ ] Route configured at `/register`

---

### 3.14 Build password reset request page

**Estimate:** 2 hours

**Description:**
Create the password reset request page where users enter their email to receive reset instructions.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/auth/ResetPasswordPage.tsx` renders email form
- [ ] Form field: email (type="email")
- [ ] Client-side validation: valid email format
- [ ] Submit shows success message: "If an account exists, you'll receive reset instructions"
- [ ] No indication whether email exists (security)
- [ ] Link back to "Return to login" -> `/login`
- [ ] Route configured at `/reset-password`

---

### 3.15 Build password reset confirmation page

**Estimate:** 2 hours

**Description:**
Create the password reset confirmation page where users enter their new password using the reset token.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/auth/ResetPasswordConfirmPage.tsx` renders new password form
- [ ] Reads `token` from URL query parameter
- [ ] Form fields: new password, confirm new password
- [ ] Client-side validation: min 8 chars, passwords match
- [ ] Invalid/expired token shows error with link to request new reset
- [ ] Success shows confirmation and link to login
- [ ] Route configured at `/reset-password/confirm?token=...`

---

### 3.16 Implement auth state persistence in localStorage

**Estimate:** 1 hour

**Description:**
Persist authentication tokens in localStorage so users remain logged in across browser sessions.

**Acceptance Criteria:**
- [ ] On successful login/register, tokens saved to localStorage
- [ ] Keys: `oratify_access_token`, `oratify_refresh_token`
- [ ] On app load, tokens retrieved and validated
- [ ] If access token expired but refresh token valid, auto-refresh
- [ ] If both tokens expired/invalid, clear localStorage and set unauthenticated
- [ ] Logout clears both tokens from localStorage
- [ ] No sensitive data stored (user object rebuilt from /auth/me endpoint)

---

### 3.17 Implement logout functionality

**Estimate:** 1 hour

**Description:**
Implement complete logout flow clearing all auth state and redirecting to login.

**Acceptance Criteria:**
- [ ] `useAuth().logout()` function available
- [ ] Clears tokens from localStorage
- [ ] Clears user state from context/Redux
- [ ] Redirects to `/login`
- [ ] Any pending API requests are cancelled or ignored
- [ ] Logout button available in app header/menu for authenticated users
- [ ] Works even if backend is unreachable (client-side only)

---

### 3.18 Add auth token to API request interceptor

**Estimate:** 2 hours

**Description:**
Configure Axios interceptor to automatically attach access token to all API requests and handle token refresh on 401 responses.

**Acceptance Criteria:**
- [ ] `frontend/src/api/client.ts` creates Axios instance with base URL from env
- [ ] Request interceptor adds `Authorization: Bearer <token>` header if token exists
- [ ] Response interceptor catches 401 errors
- [ ] On 401, attempts token refresh using refresh token
- [ ] If refresh succeeds, retries original request with new token
- [ ] If refresh fails, triggers logout
- [ ] Prevents infinite refresh loops (max 1 retry)
- [ ] Other errors passed through normally

---

# Phase 2: Core Domain

**Description:** Build the core presentation and slide management functionality including CRUD operations, slide type handling, and the visual composer interface for creating presentations.

**Phase Total: 117 hours**

---

## Epic 4: Presentation Management

**Description:** Create complete presentation lifecycle management including CRUD API endpoints and frontend pages for listing, creating, editing, and deleting presentations.

**Epic Total: 29 hours**

---

### 4.1 Create presentation CRUD endpoints

**Estimate:** 4 hours

**Description:**
Create REST API endpoints for creating, reading, updating, and deleting presentations.

**Acceptance Criteria:**
- [ ] POST `/api/presentations` creates new presentation, requires auth
- [ ] Request body: `{title, description?, slug?}`, returns created presentation with 201
- [ ] GET `/api/presentations` returns list of current speaker's presentations
- [ ] List supports query params: `?status=draft`, `?search=term`
- [ ] GET `/api/presentations/{id}` returns single presentation with slides
- [ ] Returns 404 if presentation not found or not owned by speaker
- [ ] PUT `/api/presentations/{id}` updates presentation fields
- [ ] Only owner can update, returns 403 for others
- [ ] DELETE `/api/presentations/{id}` soft-deletes or hard-deletes presentation
- [ ] All endpoints require authentication

---

### 4.2 Implement slug generation and uniqueness validation

**Estimate:** 2 hours

**Description:**
Auto-generate URL-friendly slugs from presentation titles and ensure uniqueness.

**Acceptance Criteria:**
- [ ] Slug auto-generated from title if not provided (e.g., "My Talk" -> "my-talk")
- [ ] Slugs are lowercase, alphanumeric with hyphens only
- [ ] Duplicate slugs get numeric suffix (my-talk, my-talk-1, my-talk-2)
- [ ] Maximum slug length: 100 characters
- [ ] Slug can be manually set/overridden
- [ ] Updating title does not change existing slug
- [ ] Validation error returned if manually set slug already exists
- [ ] Slug used for audience join URL: `/s/{slug}`

---

### 4.3 Implement presentation status state machine

**Estimate:** 2 hours

**Description:**
Enforce valid status transitions for presentations (draft -> active -> ended).

**Acceptance Criteria:**
- [ ] Valid statuses: "draft", "active", "ended"
- [ ] New presentations default to "draft"
- [ ] Draft can transition to: active
- [ ] Active can transition to: ended, paused (if paused is added)
- [ ] Ended is terminal state (or can return to draft for reuse)
- [ ] Invalid transitions return 400 with clear error message
- [ ] Status changes logged with timestamp
- [ ] Only presentation owner can change status

---

### 4.4 Create speaker notes text field handling

**Estimate:** 1 hour

**Description:**
Implement speaker notes storage and retrieval for AI context.

**Acceptance Criteria:**
- [ ] Presentation model has `speaker_notes` TEXT field (unlimited length)
- [ ] Notes saved via PUT `/api/presentations/{id}` with `{speaker_notes: "..."}`
- [ ] Notes included in presentation GET response
- [ ] Notes can be null/empty
- [ ] Frontend can display character count
- [ ] Notes used by AI service for context (tested in AI epic)

---

### 4.5 Build presentations list page

**Estimate:** 4 hours

**Description:**
Create the speaker dashboard page showing all their presentations in a grid or list view.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/speaker/DashboardPage.tsx` shows presentations
- [ ] Page fetches presentations on mount via API
- [ ] Shows loading skeleton while fetching
- [ ] Displays presentation cards in responsive grid (3 columns desktop, 1 mobile)
- [ ] Empty state: "No presentations yet. Create your first one!"
- [ ] Each card shows: title, status badge, created date, slide count
- [ ] Click card navigates to composer: `/presentations/{id}/edit`
- [ ] Page includes "Create Presentation" button
- [ ] Route configured at `/dashboard`, requires auth

---

### 4.6 Build presentation card component

**Estimate:** 2 hours

**Description:**
Create reusable presentation card component for the dashboard grid.

**Acceptance Criteria:**
- [ ] `frontend/src/components/PresentationCard/PresentationCard.tsx` component
- [ ] Displays: title (truncated if long), status badge, created date
- [ ] Status badge color-coded: draft=gray, active=cyan, ended=red
- [ ] Shows slide count icon with number
- [ ] Hover state with subtle elevation/shadow
- [ ] Click handler for navigation
- [ ] Dropdown menu (three dots) with: Edit, Duplicate, Delete
- [ ] Uses app color palette

---

### 4.7 Build create presentation modal

**Estimate:** 3 hours

**Description:**
Create modal dialog for creating a new presentation with title input.

**Acceptance Criteria:**
- [ ] Modal component with backdrop, closes on outside click or ESC
- [ ] Form fields: title (required), description (optional textarea)
- [ ] Title validation: required, max 255 characters
- [ ] Submit button "Create" with loading state
- [ ] Cancel button closes modal without action
- [ ] On success: closes modal, navigates to `/presentations/{new-id}/edit`
- [ ] On error: shows error message in modal
- [ ] Modal accessible (focus trap, aria labels)

---

### 4.8 Build presentation settings page

**Estimate:** 4 hours

**Description:**
Create settings page for editing presentation metadata and speaker notes.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/speaker/PresentationSettingsPage.tsx` component
- [ ] Accessible from composer via settings icon/menu
- [ ] Editable fields: title, description, slug, speaker notes
- [ ] Slug field shows preview: "Audience join URL: domain.com/s/{slug}"
- [ ] Speaker notes: large textarea with character count
- [ ] Auto-save with debounce (500ms) or manual save button
- [ ] Save indicator: "Saved" / "Saving..." / "Unsaved changes"
- [ ] Delete presentation button with confirmation modal
- [ ] Route: `/presentations/{id}/settings`

---

### 4.9 Implement presentation duplication

**Estimate:** 2 hours

**Description:**
Allow speakers to duplicate an existing presentation with all its slides.

**Acceptance Criteria:**
- [ ] POST `/api/presentations/{id}/duplicate` creates copy
- [ ] New presentation titled "{original title} (Copy)"
- [ ] New presentation has status "draft"
- [ ] All slides copied with new IDs, maintaining order
- [ ] New slug generated based on new title
- [ ] Speaker notes copied
- [ ] Returns new presentation object with 201
- [ ] Frontend: duplicate option in card dropdown
- [ ] After duplicate, navigate to new presentation composer

---

### 4.10 Implement presentation deletion with confirmation

**Estimate:** 2 hours

**Description:**
Implement safe presentation deletion with confirmation dialog and cascade handling.

**Acceptance Criteria:**
- [ ] DELETE `/api/presentations/{id}` removes presentation
- [ ] Cascade deletes all associated slides
- [ ] Sessions are preserved for historical data but marked as orphaned
- [ ] Only owner can delete
- [ ] Frontend: delete option in card dropdown
- [ ] Confirmation modal: "Are you sure? This cannot be undone."
- [ ] Modal shows presentation title for verification
- [ ] After deletion, return to dashboard with success toast

---

### 4.11 Add presentation search and filtering

**Estimate:** 3 hours

**Description:**
Add search and filter controls to the presentations dashboard.

**Acceptance Criteria:**
- [ ] Search input filters presentations by title (client-side for MVP)
- [ ] Status filter dropdown: All, Draft, Active, Ended
- [ ] Filters combinable (search + status)
- [ ] Results update as user types (debounced 300ms)
- [ ] Clear filters button when any filter active
- [ ] Empty results: "No presentations match your filters"
- [ ] Filters preserved in URL query params for shareability
- [ ] Loading state during filter API calls (if server-side)

---

## Epic 5: Slide Management Backend

**Description:** Create the backend API for managing slides within presentations, including CRUD operations, ordering logic, image uploads, and JSON schema validation for different slide types.

**Epic Total: 26 hours**

---

### 5.1 Create slide CRUD endpoints

**Estimate:** 4 hours

**Description:**
Create REST API endpoints for managing slides within a presentation.

**Acceptance Criteria:**
- [ ] GET `/api/presentations/{id}/slides` returns ordered list of slides
- [ ] POST `/api/presentations/{id}/slides` creates new slide, requires auth
- [ ] Request body: `{type, content, order_index?}`, returns created slide
- [ ] If order_index not provided, appends to end
- [ ] GET `/api/slides/{id}` returns single slide
- [ ] PUT `/api/slides/{id}` updates slide content/type
- [ ] DELETE `/api/slides/{id}` removes slide and reorders remaining
- [ ] All endpoints validate presentation ownership
- [ ] Pydantic schemas: `SlideCreate`, `SlideUpdate`, `SlideResponse`

---

### 5.2 Implement slide ordering logic

**Estimate:** 2 hours

**Description:**
Manage slide order_index values to maintain consistent ordering within presentations.

**Acceptance Criteria:**
- [ ] New slides appended with order_index = max + 1
- [ ] Deleting slide reindexes remaining slides (close gaps)
- [ ] Order indices are always contiguous: 0, 1, 2, 3...
- [ ] No duplicate order_index within same presentation
- [ ] Database constraint or application logic enforces uniqueness
- [ ] Slides returned ordered by order_index ascending

---

### 5.3 Create bulk reorder slides endpoint

**Estimate:** 2 hours

**Description:**
Create endpoint to reorder multiple slides at once via drag-and-drop.

**Acceptance Criteria:**
- [ ] PUT `/api/presentations/{id}/slides/reorder` accepts slide order array
- [ ] Request body: `{slide_ids: ["uuid1", "uuid2", "uuid3"]}` in desired order
- [ ] All slide IDs must belong to the presentation
- [ ] Missing or extra IDs return 400 error
- [ ] Updates order_index for all slides in single transaction
- [ ] Returns 200 with updated slides array
- [ ] Frontend receives confirmation before updating local state

---

### 5.4 Define JSONB schema for content slide type

**Estimate:** 2 hours

**Description:**
Define and document the JSON structure for content slides (image + text).

**Acceptance Criteria:**
- [ ] Content slide `content` JSONB structure:
  ```json
  {
    "image_url": "string | null",
    "text": "string (markdown)",
    "layout": "image-left | image-right | image-top | text-only"
  }
  ```
- [ ] Pydantic model `ContentSlideContent` validates structure
- [ ] Default layout: "image-left"
- [ ] Text supports markdown formatting
- [ ] Image URL can be internal (uploaded) or external
- [ ] Schema documented in code comments

---

### 5.5 Define JSONB schema for question slide type (text)

**Estimate:** 2 hours

**Description:**
Define JSON structure for free-text question slides.

**Acceptance Criteria:**
- [ ] Question text slide `content` JSONB structure:
  ```json
  {
    "question": "string (the question text)",
    "placeholder": "string | null",
    "max_length": "number | null",
    "required": "boolean"
  }
  ```
- [ ] Pydantic model `QuestionTextSlideContent` validates structure
- [ ] Placeholder shown in input field
- [ ] max_length enforced on responses (default 500)
- [ ] Required field indicates if response is mandatory

---

### 5.6 Define JSONB schema for question slide type (multiple choice)

**Estimate:** 2 hours

**Description:**
Define JSON structure for multiple choice question slides.

**Acceptance Criteria:**
- [ ] Question choice slide `content` JSONB structure:
  ```json
  {
    "question": "string",
    "options": [
      {"id": "uuid", "text": "string", "order": 0},
      {"id": "uuid", "text": "string", "order": 1}
    ],
    "allow_multiple": "boolean",
    "show_results": "boolean"
  }
  ```
- [ ] Minimum 2 options, maximum 6 options
- [ ] Each option has unique ID for tracking votes
- [ ] allow_multiple enables multi-select
- [ ] show_results controls if audience sees live results

---

### 5.7 Define JSONB schema for summary slide type

**Estimate:** 1 hour

**Description:**
Define JSON structure for AI-generated summary slides.

**Acceptance Criteria:**
- [ ] Summary slide `content` JSONB structure:
  ```json
  {
    "title": "string",
    "summary_text": "string | null",
    "auto_generate": "boolean",
    "include_slides": ["uuid"] | "all"
  }
  ```
- [ ] auto_generate triggers AI summary during presentation
- [ ] include_slides specifies which slides to summarize
- [ ] summary_text populated by AI or manually entered

---

### 5.8 Define JSONB schema for conclusion slide type

**Estimate:** 1 hour

**Description:**
Define JSON structure for conclusion/key takeaways slides.

**Acceptance Criteria:**
- [ ] Conclusion slide `content` JSONB structure:
  ```json
  {
    "title": "string",
    "conclusions": ["string", "string"],
    "auto_generate": "boolean",
    "thank_you_message": "string | null"
  }
  ```
- [ ] conclusions array for bullet points
- [ ] auto_generate triggers AI conclusion generation
- [ ] thank_you_message shown at end

---

### 5.9 Implement slide content validation per type

**Estimate:** 3 hours

**Description:**
Validate slide content against the appropriate schema based on slide type.

**Acceptance Criteria:**
- [ ] Validation runs on slide create and update
- [ ] Each slide type has corresponding Pydantic model
- [ ] Invalid content returns 422 with detailed field errors
- [ ] Discriminated union pattern: type field determines content schema
- [ ] Unknown slide types rejected
- [ ] Empty content uses default values for type
- [ ] Validation errors include path to invalid field

---

### 5.10 Create image upload endpoint

**Estimate:** 4 hours

**Description:**
Create endpoint for uploading images for content slides.

**Acceptance Criteria:**
- [ ] POST `/api/upload/image` accepts multipart/form-data
- [ ] Accepts image files: JPEG, PNG, GIF, WebP
- [ ] Maximum file size: 5MB (configurable)
- [ ] Returns `{url: "/uploads/images/{filename}"}` on success
- [ ] Filename includes hash to prevent collisions
- [ ] Invalid file type returns 400
- [ ] File too large returns 413
- [ ] Requires authentication

---

### 5.11 Implement image storage and serving

**Estimate:** 3 hours

**Description:**
Set up file storage for uploaded images and configure serving.

**Acceptance Criteria:**
- [ ] Images stored in `backend/uploads/images/` directory
- [ ] Directory created if not exists
- [ ] Unique filenames: `{uuid}_{original_name}`
- [ ] Static file serving configured: GET `/uploads/images/{filename}`
- [ ] Content-Type header set correctly
- [ ] Cache headers configured (1 year for static assets)
- [ ] In production: recommend moving to S3/CDN (documented)
- [ ] Uploads directory gitignored, persisted in Docker volume

---

## Epic 6: Presentation Composer UI

**Description:** Build the visual composer interface for creating and editing presentation slides, including drag-and-drop reordering, slide type editors, and auto-save functionality.

**Epic Total: 62 hours**

---

### 6.1 Build composer page layout

**Estimate:** 4 hours

**Description:**
Create the main composer page with three-panel layout: sidebar, main editor, properties panel.

**Acceptance Criteria:**
- [ ] `frontend/src/pages/speaker/ComposerPage.tsx` renders three-panel layout
- [ ] Left sidebar: slide list (250px width, collapsible)
- [ ] Center: main editor area (flexible width)
- [ ] Right panel: properties (300px width, collapsible)
- [ ] Top bar: presentation title, save status, preview button, settings link
- [ ] Responsive: panels stack on tablet, simplified on mobile
- [ ] Fetches presentation and slides on mount
- [ ] Route: `/presentations/{id}/edit`
- [ ] 404 if presentation not found

---

### 6.2 Build slide thumbnail component

**Estimate:** 2 hours

**Description:**
Create thumbnail component for slide preview in the sidebar.

**Acceptance Criteria:**
- [ ] `frontend/src/components/slides/SlideThumbnail.tsx` component
- [ ] Shows miniature preview of slide content
- [ ] Type icon badge (image, question mark, summary, conclusion)
- [ ] Slide number displayed (1, 2, 3...)
- [ ] Selected state with cyan border highlight
- [ ] Hover state with subtle background change
- [ ] Click selects slide
- [ ] Proportional aspect ratio (16:9)

---

### 6.3 Build slide thumbnail list in sidebar

**Estimate:** 3 hours

**Description:**
Create scrollable list of slide thumbnails in the composer sidebar.

**Acceptance Criteria:**
- [ ] Renders all slides as thumbnails vertically
- [ ] Currently selected slide highlighted
- [ ] Scrollable when slides exceed viewport
- [ ] Scroll position preserved when switching slides
- [ ] "Add Slide" button at bottom of list
- [ ] Empty state if no slides yet
- [ ] Keyboard navigation (up/down arrows)

---

### 6.4 Implement drag-and-drop slide reordering

**Estimate:** 4 hours

**Description:**
Enable reordering slides via drag-and-drop in the sidebar.

**Acceptance Criteria:**
- [ ] Can drag slide thumbnail to new position
- [ ] Drop indicator shows insertion point
- [ ] Smooth animation during drag
- [ ] Order updated in local state immediately
- [ ] API call to persist new order (debounced)
- [ ] Error handling: revert to original order if API fails
- [ ] Use `@dnd-kit/core` or similar library
- [ ] Accessible: keyboard reorder with modifier keys

---

### 6.5 Build add slide dropdown menu

**Estimate:** 2 hours

**Description:**
Create dropdown menu for adding new slides of different types.

**Acceptance Criteria:**
- [ ] Dropdown triggered by "Add Slide" button
- [ ] Options: Content Slide, Question (Text), Question (Multiple Choice), Summary, Conclusion
- [ ] Each option has icon and description
- [ ] Selecting option creates slide and opens editor
- [ ] New slide added after currently selected (or at end if none selected)
- [ ] Menu closes on selection or outside click
- [ ] Keyboard accessible

---

### 6.6 Build delete slide with confirmation

**Estimate:** 2 hours

**Description:**
Enable slide deletion with confirmation to prevent accidental loss.

**Acceptance Criteria:**
- [ ] Delete button/icon on selected slide or in context menu
- [ ] Confirmation modal: "Delete this slide?"
- [ ] Modal shows slide preview or title
- [ ] Confirm deletes slide and calls API
- [ ] Next slide selected after deletion (or previous if last)
- [ ] Undo option in toast notification (30 second window)
- [ ] Cannot delete if only one slide (or allow empty presentation)

---

### 6.7 Build content slide editor

**Estimate:** 4 hours

**Description:**
Create editor interface for content slides with image and text areas.

**Acceptance Criteria:**
- [ ] Editor shows when content slide selected
- [ ] Layout selector: image-left, image-right, image-top, text-only
- [ ] Image area: shows current image or "Upload Image" placeholder
- [ ] Click image area to upload or replace
- [ ] Text area: markdown-enabled textarea
- [ ] Preview of final slide layout in editor
- [ ] Changes update local state immediately
- [ ] Changes auto-saved to API (debounced)

---

### 6.8 Build image upload component with preview

**Estimate:** 4 hours

**Description:**
Create reusable image upload component with preview and progress.

**Acceptance Criteria:**
- [ ] Click or drag-drop to upload image
- [ ] File type validation (JPEG, PNG, GIF, WebP)
- [ ] File size validation (max 5MB, client-side check)
- [ ] Upload progress indicator
- [ ] Preview shown after upload completes
- [ ] Remove/replace button on uploaded image
- [ ] Error display for failed uploads
- [ ] Accessible labels and keyboard support

---

### 6.9 Build rich text editor for slide content

**Estimate:** 6 hours

**Description:**
Create markdown-enabled rich text editor for slide text content.

**Acceptance Criteria:**
- [ ] Textarea with markdown support
- [ ] Toolbar: bold, italic, headers (H1-H3), bullet list, numbered list
- [ ] Live preview of formatted output (split view or toggle)
- [ ] Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic)
- [ ] Character count display
- [ ] Auto-resize textarea based on content
- [ ] Use existing library like `react-markdown` for preview
- [ ] Escape/unescape markdown characters properly

---

### 6.10 Build question slide editor (text input type)

**Estimate:** 3 hours

**Description:**
Create editor for free-text question slides.

**Acceptance Criteria:**
- [ ] Question text input (what to ask the audience)
- [ ] Placeholder text input (shown in audience input field)
- [ ] Max length number input with validation
- [ ] Required checkbox
- [ ] Preview of how audience will see the question
- [ ] Changes auto-saved
- [ ] Validation: question text required

---

### 6.11 Build question slide editor (multiple choice type)

**Estimate:** 4 hours

**Description:**
Create editor for multiple choice question slides.

**Acceptance Criteria:**
- [ ] Question text input
- [ ] Options list editor (see 6.12)
- [ ] "Allow multiple selections" toggle
- [ ] "Show results to audience" toggle
- [ ] Preview of question with selectable options
- [ ] Changes auto-saved
- [ ] Minimum 2 options enforced

---

### 6.12 Build multiple choice options editor

**Estimate:** 3 hours

**Description:**
Create interface for managing multiple choice options.

**Acceptance Criteria:**
- [ ] List of option inputs with text field each
- [ ] "Add Option" button (up to 6 options)
- [ ] Remove button on each option (minimum 2)
- [ ] Drag to reorder options
- [ ] Option color/icon selector (optional)
- [ ] Each option auto-assigned unique ID
- [ ] Empty options not saved

---

### 6.13 Build summary slide configuration panel

**Estimate:** 2 hours

**Description:**
Create editor for configuring AI-generated summary slides.

**Acceptance Criteria:**
- [ ] Title input for summary slide
- [ ] Auto-generate toggle
- [ ] Slide selector: choose which slides to include in summary
- [ ] "All slides" option for full presentation summary
- [ ] Manual summary text area (when auto-generate off)
- [ ] Preview placeholder showing "Summary will be generated..."

---

### 6.14 Build conclusion slide configuration panel

**Estimate:** 2 hours

**Description:**
Create editor for configuring conclusion slides.

**Acceptance Criteria:**
- [ ] Title input
- [ ] Auto-generate toggle
- [ ] Manual conclusions: list of bullet point inputs
- [ ] Add/remove conclusion points
- [ ] Thank you message input
- [ ] Preview of conclusion layout

---

### 6.15 Build speaker notes editor in properties panel

**Estimate:** 3 hours

**Description:**
Create editor for presentation-level speaker notes in the properties panel.

**Acceptance Criteria:**
- [ ] Large textarea in properties panel
- [ ] Tab or section labeled "Speaker Notes"
- [ ] Character count display
- [ ] Explanation text: "These notes provide context for AI responses"
- [ ] Auto-save with debounce
- [ ] Save indicator
- [ ] Collapsible section

---

### 6.16 Implement auto-save with debounce

**Estimate:** 3 hours

**Description:**
Automatically save slide changes after user stops typing.

**Acceptance Criteria:**
- [ ] Changes trigger save after 500ms of inactivity
- [ ] Save indicator shows: "Saving..." during API call
- [ ] Save indicator shows: "Saved" on success with timestamp
- [ ] Save indicator shows: "Save failed" with retry button on error
- [ ] Multiple rapid changes batched into single save
- [ ] Unsaved changes tracked in component state
- [ ] Use `useDebounce` hook or similar pattern

---

### 6.17 Build save status indicator

**Estimate:** 1 hour

**Description:**
Create visual indicator showing current save state.

**Acceptance Criteria:**
- [ ] Component in composer header
- [ ] States: "All changes saved" (gray), "Saving..." (animated), "Unsaved changes" (yellow), "Save failed" (red)
- [ ] Click on "Save failed" attempts retry
- [ ] Shows last saved timestamp
- [ ] Updates reactively based on save operations

---

### 6.18 Implement unsaved changes warning on navigation

**Estimate:** 2 hours

**Description:**
Warn users when navigating away with unsaved changes.

**Acceptance Criteria:**
- [ ] Browser beforeunload event shows native dialog
- [ ] React Router navigation blocked with confirmation modal
- [ ] Modal: "You have unsaved changes. Discard changes?"
- [ ] Options: "Save and Leave", "Discard", "Cancel"
- [ ] Only shows when there are actual unsaved changes
- [ ] Save and Leave waits for save completion before navigating

---

### 6.19 Build preview mode toggle

**Estimate:** 2 hours

**Description:**
Add toggle to switch between edit mode and preview mode in composer.

**Acceptance Criteria:**
- [ ] Preview button in composer header
- [ ] Toggle between "Edit" and "Preview" modes
- [ ] Preview mode hides editing controls
- [ ] Preview mode shows slides as audience would see them
- [ ] Keyboard shortcut: Ctrl+P / Cmd+P
- [ ] ESC exits preview mode

---

### 6.20 Build preview mode slide renderer

**Estimate:** 4 hours

**Description:**
Render slides exactly as they will appear to the audience.

**Acceptance Criteria:**
- [ ] Full-screen or large centered display
- [ ] Content slides: show image and formatted text
- [ ] Question slides: show question with answer input (non-functional)
- [ ] Summary slides: show title and placeholder/content
- [ ] Conclusion slides: show formatted conclusions
- [ ] Navigation arrows to move between slides
- [ ] Slide counter: "3 of 10"
- [ ] Matches final audience view styling

---

### 6.21 Add keyboard shortcuts for composer actions

**Estimate:** 2 hours

**Description:**
Implement keyboard shortcuts for common composer actions.

**Acceptance Criteria:**
- [ ] Ctrl+S / Cmd+S: Force save (even if already saved)
- [ ] Delete / Backspace: Delete selected slide (with confirmation)
- [ ] Ctrl+D / Cmd+D: Duplicate selected slide
- [ ] Arrow Up/Down: Navigate slides when sidebar focused
- [ ] Ctrl+P / Cmd+P: Toggle preview mode
- [ ] Escape: Exit preview mode, close modals
- [ ] Shortcuts work regardless of focus (unless in text input)
- [ ] Help tooltip or modal listing shortcuts

---

*Document continues with Phases 3-7...*

---

# Summary

| Phase | Epics | Stories | Hours |
|-------|-------|---------|-------|
| Phase 1: Foundation | 3 | 40 | 86 |
| Phase 2: Core Domain | 3 | 43 | 117 |
| Phase 3: Live Features | 6 | 82 | 180 |
| Phase 4: Intelligence | 2 | 30 | 82 |
| Phase 5: Management | 2 | 27 | 76 |
| Phase 6: Quality | 3 | 44 | 122 |
| Phase 7: Release | 2 | 25 | 70 |
| **Total** | **21** | **291** | **733** |

---

> **Note:** This backlog is designed to be self-contained. Each story includes enough context for any developer or AI agent to implement it independently. Refer to `docs/prd.md` for product vision and `architecture.mmd` files for technical design.
