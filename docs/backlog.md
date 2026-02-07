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

# Phase 3: Live Features

**Description:** Implement session management, audience join flow, real-time WebSocket communication, presenter controls, and audience interaction view. This phase brings the platform to life with real-time capabilities.

**Phase Total: 180 hours**

---

## Epic 7: Session Management

**Description:** Build the backend API for creating, managing, and tracking live presentation sessions. Sessions represent a single delivery of a presentation to an audience, with lifecycle states (created, active, paused, ended), join codes for audience access, and real-time slide tracking.

**Epic Total: 22 hours**

---

### 7.1 Create session creation endpoint

**Estimate:** 3 hours

**Description:**
Create the POST /api/sessions endpoint that creates a new session for a presentation. The endpoint takes a presentation_id, generates a unique 6-character join code, and returns the session in "created" state.

**Acceptance Criteria:**
- [ ] POST `/api/sessions` accepts `{presentation_id}` in request body
- [ ] Creates a new Session record linked to the presentation
- [ ] Session starts in "created" state (not yet active)
- [ ] Generates a unique 6-character alphanumeric join code
- [ ] Returns 201 with the session object including join_code, status, and presentation info
- [ ] Requires speaker authentication and verifies presentation ownership
- [ ] Returns 404 if presentation not found, 403 if not owner
- [ ] Prevents creating a session if one is already active for the same presentation

---

### 7.2 Implement 6-character join code generator

**Estimate:** 1 hour

**Description:**
Create a utility that generates 6-character alphanumeric codes (uppercase letters and digits) that are easy to read, type, and share verbally. Exclude ambiguous characters (0/O, 1/I/L).

**Acceptance Criteria:**
- [ ] Generates codes using uppercase letters and digits (e.g., "ABC123")
- [ ] Excludes ambiguous characters: 0, O, 1, I, L
- [ ] Code length is exactly 6 characters
- [ ] Codes are randomly generated (not sequential)
- [ ] Function is deterministic for testing when given a seed
- [ ] Output is always uppercase

---

### 7.3 Implement join code uniqueness validation

**Estimate:** 1 hour

**Description:**
Ensure generated join codes are unique among active (non-ended) sessions. If a collision occurs, regenerate the code.

**Acceptance Criteria:**
- [ ] Before saving, check join_code against all active sessions in the database
- [ ] If collision found, regenerate and check again (up to 10 attempts)
- [ ] Only check against sessions that are not in "ended" state
- [ ] Raise an error if unable to generate unique code after max attempts
- [ ] Database has a unique index on (join_code) for active sessions

---

### 7.4 Create get session by join code endpoint

**Estimate:** 2 hours

**Description:**
Create a GET endpoint that retrieves a session by its join code. Used by audience members to validate a code before joining.

**Acceptance Criteria:**
- [ ] GET `/api/sessions/join/{code}` returns session with presentation info
- [ ] Returns presentation title, session status, and speaker name
- [ ] Does NOT require authentication (audience members are anonymous)
- [ ] Returns 404 if join code not found or session has ended
- [ ] Case-insensitive code matching (accepts lowercase input)
- [ ] Response includes enough info for the join flow (session_id, status, presentation title)

---

### 7.5 Create get session by slug endpoint

**Estimate:** 1 hour

**Description:**
Create a GET endpoint that finds the active session for a presentation by its URL slug.

**Acceptance Criteria:**
- [ ] GET `/api/sessions/slug/{slug}` returns the active session for the presentation
- [ ] Looks up presentation by slug, then finds its active session
- [ ] Returns 404 if no presentation with that slug or no active session
- [ ] Does not require authentication
- [ ] Response matches the join-by-code response format

---

### 7.6 Create start session endpoint

**Estimate:** 2 hours

**Description:**
Create the endpoint to transition a session from "created" to "active" state, marking it as live.

**Acceptance Criteria:**
- [ ] PATCH `/api/sessions/{id}/start` transitions session to "active"
- [ ] Sets `started_at` timestamp to current time
- [ ] Sets `current_slide_id` to the first slide of the presentation
- [ ] Returns 400 if session is not in "created" state
- [ ] Requires speaker authentication and session ownership
- [ ] Broadcasts `session_started` WebSocket event to all connected audience members
- [ ] Returns updated session object

---

### 7.7 Create end session endpoint

**Estimate:** 2 hours

**Description:**
Create the endpoint to end a session, marking it as finished and disconnecting audience.

**Acceptance Criteria:**
- [ ] PATCH `/api/sessions/{id}/end` transitions session to "ended"
- [ ] Sets `ended_at` timestamp to current time
- [ ] Returns 400 if session is already ended
- [ ] Requires speaker authentication and session ownership
- [ ] Broadcasts `session_ended` WebSocket event to all connected clients
- [ ] Session data is preserved for historical review
- [ ] Returns updated session object with duration

---

### 7.8 Create pause/resume session endpoint

**Estimate:** 2 hours

**Description:**
Create endpoints to pause and resume an active session, temporarily halting audience interaction.

**Acceptance Criteria:**
- [ ] PATCH `/api/sessions/{id}/pause` transitions from "active" to "paused"
- [ ] PATCH `/api/sessions/{id}/resume` transitions from "paused" to "active"
- [ ] Returns 400 if transition is invalid (e.g., pausing an ended session)
- [ ] Requires speaker authentication and session ownership
- [ ] Broadcasts `session_paused` or `session_resumed` event via WebSocket
- [ ] Audience sees a "Session paused" indicator when paused
- [ ] Response submissions are rejected while session is paused

---

### 7.9 Implement current slide tracking

**Estimate:** 2 hours

**Description:**
Track which slide the speaker is currently presenting within a session using a foreign key to the slides table.

**Acceptance Criteria:**
- [ ] Session model has `current_slide_id` FK to the Slide table
- [ ] Initialized to the first slide when session starts
- [ ] Updated atomically when speaker navigates
- [ ] GET session endpoints include the current slide data in the response
- [ ] Null when session hasn't started yet
- [ ] Validated to ensure the slide belongs to the session's presentation

---

### 7.10 Create change current slide endpoint

**Estimate:** 2 hours

**Description:**
Create the endpoint for the speaker to navigate to a different slide during a live session.

**Acceptance Criteria:**
- [ ] PATCH `/api/sessions/{id}/current-slide` accepts `{slide_id}`
- [ ] Updates `current_slide_id` on the session
- [ ] Validates that the slide belongs to the session's presentation
- [ ] Returns 400 if session is not active
- [ ] Requires speaker authentication and session ownership
- [ ] Broadcasts `slide_changed` WebSocket event with the new slide data
- [ ] Returns updated session object

---

### 7.11 Implement session expiration handling

**Estimate:** 2 hours

**Description:**
Automatically end sessions that have been active too long without activity, preventing abandoned sessions from lingering.

**Acceptance Criteria:**
- [ ] Sessions auto-expire after a configurable timeout (default: 4 hours)
- [ ] Expiration check runs periodically (background task or on-access check)
- [ ] Expired sessions transition to "ended" state with `ended_at` set
- [ ] Connected audience members receive `session_ended` event
- [ ] Expiration timeout is configurable via environment variable
- [ ] Activity (slide change, response) resets the expiration timer

---

### 7.12 Create session statistics endpoint

**Estimate:** 2 hours

**Description:**
Create an endpoint that returns aggregate statistics for a session.

**Acceptance Criteria:**
- [ ] GET `/api/sessions/{id}/stats` returns session statistics
- [ ] Includes: total participants, peak concurrent participants, total responses
- [ ] Includes: session duration, responses per slide, average response time
- [ ] Requires speaker authentication and session ownership
- [ ] Works for both active and ended sessions
- [ ] Returns 404 if session not found

---

## Epic 8: Join Flow

**Description:** Build the frontend audience join experience, from entering a code or scanning a QR to entering a name and waiting for the session to start. The flow handles all edge cases (invalid code, session not started, session ended) with appropriate screens.

**Epic Total: 19 hours**

---

### 8.1 Build join page with code input

**Estimate:** 3 hours

**Description:**
Build the /join page with a centered input field for entering a 6-character session code. The page is mobile-friendly with large input and clear instructions.

**Acceptance Criteria:**
- [ ] Page accessible at `/join` route
- [ ] Centered layout with "Join a Session" heading
- [ ] Single input field for 6-character code, large font, auto-uppercase
- [ ] "Join" submit button below the input
- [ ] Mobile-friendly: large tap targets, appropriate viewport handling
- [ ] Input auto-focuses on page load
- [ ] Styled with Oratify dark theme and cyan accents
- [ ] Accessible with proper labels and ARIA attributes

---

### 8.2 Build join page code validation and submission

**Estimate:** 2 hours

**Description:**
Implement client-side validation of the join code format and server-side validation by calling the API.

**Acceptance Criteria:**
- [ ] Client-side: validates 6 alphanumeric characters before submitting
- [ ] Shows inline error for invalid format (too short, special characters)
- [ ] Calls GET `/api/sessions/join/{code}` to validate the code
- [ ] On success: stores session data in state and navigates to name entry
- [ ] On 404: shows "Session not found" error
- [ ] Shows loading state during API call
- [ ] Handles network errors gracefully

---

### 8.3 Create QR code generation utility

**Estimate:** 2 hours

**Description:**
Create a utility that generates QR codes encoding the join URL for a session, using the qrcode.react library.

**Acceptance Criteria:**
- [ ] Uses `qrcode.react` library to generate QR codes
- [ ] QR code encodes the full join URL: `{domain}/join/{code}`
- [ ] Configurable size (small for sidebar, large for projection)
- [ ] Configurable colors (dark foreground on light background for scannability)
- [ ] Utility function returns QR code data URL or component
- [ ] QR code is scannable by standard phone cameras

---

### 8.4 Build QR code display component

**Estimate:** 2 hours

**Description:**
Build a reusable QRCode component that displays a QR code with the join code text below it.

**Acceptance Criteria:**
- [ ] Renders QR code at specified size
- [ ] Displays join code text below the QR code in large, readable font
- [ ] Dark theme styling (dark background, light QR code with cyan accent)
- [ ] Responsive sizing that works in sidebar and full-screen contexts
- [ ] Join URL text shown below for manual entry
- [ ] Copy button for the join code

---

### 8.5 Build join URL with slug handling

**Estimate:** 2 hours

**Description:**
Build the /s/{slug} route that allows audience members to join via a presentation's custom URL slug.

**Acceptance Criteria:**
- [ ] Route `/s/{slug}` is configured in the router
- [ ] On load, calls GET `/api/sessions/slug/{slug}` to find the active session
- [ ] If session found and active: redirects to name entry with session data
- [ ] If session found but not started: shows waiting screen
- [ ] If no active session: shows "No active session" error with option to enter code manually
- [ ] Loading state shown while fetching

---

### 8.6 Build optional name entry screen

**Estimate:** 2 hours

**Description:**
After code validation, show a screen where the audience member can optionally enter their display name before joining.

**Acceptance Criteria:**
- [ ] Displays after successful code validation
- [ ] Name input field with placeholder "Your name (optional)"
- [ ] "Join" button that proceeds with the entered name
- [ ] "Join as Anonymous" link that skips name entry
- [ ] Name stored in local state for the session
- [ ] Shows the presentation title so the user knows what they're joining
- [ ] Navigates to the audience view (or waiting screen) on submit

---

### 8.7 Build session not found error screen

**Estimate:** 1 hour

**Description:**
Display a friendly error screen when a join code or slug doesn't match any active session.

**Acceptance Criteria:**
- [ ] Shows "Session Not Found" heading
- [ ] Friendly message: "The code you entered doesn't match any active session"
- [ ] "Try another code" button navigates back to /join
- [ ] Styled consistently with the join flow
- [ ] Works for both code and slug lookup failures

---

### 8.8 Build session not started waiting screen

**Estimate:** 2 hours

**Description:**
Show a waiting screen when the session exists but hasn't started yet, with auto-detection when it starts.

**Acceptance Criteria:**
- [ ] Displays "Waiting for the speaker to start..." message
- [ ] Animated loading indicator (pulse or spinner)
- [ ] Shows presentation title and speaker name
- [ ] Connects to WebSocket to listen for `session_started` event
- [ ] Auto-navigates to audience view when session starts
- [ ] "Leave" button to return to /join
- [ ] Periodic polling fallback if WebSocket is unavailable

---

### 8.9 Build session ended screen

**Estimate:** 2 hours

**Description:**
Show a screen when the audience member tries to join a session that has already ended.

**Acceptance Criteria:**
- [ ] Displays "This session has ended" heading
- [ ] Friendly message: "Thank you for your interest"
- [ ] Shows when the session ended (relative time)
- [ ] "Join another session" button navigates to /join
- [ ] Optional: summary link if session summary was generated
- [ ] Styled consistently with the join flow

---

### 8.10 Implement join code input auto-formatting

**Estimate:** 1 hour

**Description:**
Enhance the join code input with auto-formatting: uppercase conversion, paste support, and visual feedback.

**Acceptance Criteria:**
- [ ] Input auto-converts to uppercase as user types
- [ ] Paste support: trims whitespace and converts to uppercase
- [ ] Maximum length enforced (6 characters)
- [ ] Visual feedback: green check icon when format is valid
- [ ] Clear button to reset the input
- [ ] Works correctly on both desktop and mobile keyboards

---

## Epic 9: WebSocket Infrastructure

**Description:** Build the real-time communication layer using FastAPI WebSockets on the backend and a custom React hook on the frontend. This includes connection management, room-based message routing, authentication, heartbeat monitoring, and reconnection logic.

**Epic Total: 34 hours**

---

### 9.1 Set up FastAPI WebSocket endpoint

**Estimate:** 3 hours

**Description:**
Create the WebSocket endpoint at /ws/session/{join_code} that accepts connections and routes them to the connection manager.

**Acceptance Criteria:**
- [ ] WebSocket endpoint at `/ws/session/{join_code}`
- [ ] Validates join_code against active sessions on connection
- [ ] Rejects connection with close code 4004 if session not found
- [ ] Rejects connection with close code 4003 if session has ended
- [ ] Accepts connection and adds to connection manager on success
- [ ] Handles incoming messages in a receive loop
- [ ] Cleans up on disconnect (normal or error)
- [ ] Logs connection and disconnection events

---

### 9.2 Implement WebSocket connection manager

**Estimate:** 4 hours

**Description:**
Build a singleton ConnectionManager class that tracks all active WebSocket connections organized by session.

**Acceptance Criteria:**
- [ ] Singleton ConnectionManager class in `app/core/websocket.py`
- [ ] `connect(websocket, session_id, role)`: register a new connection
- [ ] `disconnect(websocket, session_id)`: remove a connection
- [ ] `broadcast(session_id, message)`: send to all connections in a session
- [ ] `send_to_role(session_id, role, message)`: send to only speakers or only audience
- [ ] `send_personal(websocket, message)`: send to a specific connection
- [ ] Thread-safe connection tracking using dict of sets
- [ ] Handles connection errors gracefully during broadcast

---

### 9.3 Implement session-based room grouping

**Estimate:** 3 hours

**Description:**
Organize WebSocket connections into rooms based on session join codes, enabling targeted message broadcasting.

**Acceptance Criteria:**
- [ ] Connections grouped by session join_code
- [ ] Room created automatically when first connection joins
- [ ] Room cleaned up when last connection leaves
- [ ] Support for role-based sub-groups within a room (speaker, audience)
- [ ] `get_room_count(session_id)` returns the number of connections
- [ ] `get_room_roles(session_id)` returns count per role
- [ ] Room operations are atomic (no partial updates)

---

### 9.4 Implement connection lifecycle handling

**Estimate:** 3 hours

**Description:**
Handle the full lifecycle of a WebSocket connection: connect, authenticate, receive messages, and disconnect with cleanup.

**Acceptance Criteria:**
- [ ] On connect: validate session, add to room, broadcast `participant_joined`
- [ ] On message: parse JSON, route to appropriate handler based on message type
- [ ] On disconnect: remove from room, broadcast `participant_left`, update participant count
- [ ] Handle unexpected disconnections (network drop, browser close)
- [ ] Log all lifecycle events with connection ID and session ID
- [ ] Create Participant record in database on connect
- [ ] Update Participant record on disconnect

---

### 9.5 Implement connection authentication for speakers

**Estimate:** 2 hours

**Description:**
Allow speakers to authenticate their WebSocket connection using their JWT token, granting them the speaker role.

**Acceptance Criteria:**
- [ ] Speaker sends `{type: "authenticate", payload: {token: "jwt..."}}` as first message
- [ ] Server validates JWT token using existing auth logic
- [ ] On valid token: mark connection as "speaker" role
- [ ] On invalid token: send error message and close connection
- [ ] Speaker role grants access to session control commands
- [ ] Only one speaker connection per session allowed

---

### 9.6 Implement anonymous connection for audience

**Estimate:** 2 hours

**Description:**
Handle audience connections that don't require authentication, assigning them a unique connection ID.

**Acceptance Criteria:**
- [ ] Audience connects without sending an authenticate message
- [ ] Assigned a UUID connection_id on connect
- [ ] Creates a Participant record with optional display_name
- [ ] Audience sends `{type: "join", payload: {name: "optional"}}` after connecting
- [ ] Participant record updated with display name if provided
- [ ] Connection marked as "audience" role
- [ ] Connection ID used for tracking responses

---

### 9.7 Implement heartbeat ping-pong mechanism

**Estimate:** 2 hours

**Description:**
Implement a keep-alive mechanism to detect dead connections and clean them up.

**Acceptance Criteria:**
- [ ] Server sends ping message every 30 seconds to each connection
- [ ] Client responds with pong within 10 seconds
- [ ] Server disconnects clients that miss 3 consecutive pongs
- [ ] Disconnected clients are cleaned up from the room
- [ ] Participant count updated after cleanup
- [ ] Heartbeat interval is configurable
- [ ] Heartbeat does not interfere with regular message flow

---

### 9.8 Define WebSocket message format schema

**Estimate:** 2 hours

**Description:**
Define the standard JSON message format for all WebSocket communication using Pydantic schemas.

**Acceptance Criteria:**
- [ ] Message envelope: `{type: string, payload: object, timestamp: string}`
- [ ] Pydantic models for each message type in `app/schemas/websocket.py`
- [ ] Server-to-client types: slide_changed, participant_joined, participant_left, participant_count, vote_update, question_asked, ai_response, session_started, session_ended, session_paused, session_resumed, error
- [ ] Client-to-server types: authenticate, join, submit_response, ask_question
- [ ] Each type has a defined payload schema
- [ ] Unknown message types return an error response

---

### 9.9 Implement message serialization and deserialization

**Estimate:** 2 hours

**Description:**
Parse incoming JSON messages and validate against schemas; serialize outgoing messages using Pydantic models.

**Acceptance Criteria:**
- [ ] Incoming messages parsed from JSON string to dict
- [ ] Message type extracted and routed to appropriate Pydantic model
- [ ] Validation errors return a structured error message to the client
- [ ] Outgoing messages serialized via Pydantic `.model_dump_json()`
- [ ] Timestamp auto-populated on outgoing messages
- [ ] Invalid JSON returns an error message (not a disconnect)

---

### 9.10 Implement WebSocket error handling

**Estimate:** 2 hours

**Description:**
Handle errors in WebSocket communication gracefully, sending structured error messages to clients.

**Acceptance Criteria:**
- [ ] Malformed JSON sends `{type: "error", payload: {code: "PARSE_ERROR", message: "..."}}` back
- [ ] Unknown message type sends `{type: "error", payload: {code: "UNKNOWN_TYPE", message: "..."}}`
- [ ] Authorization errors send appropriate error code and close connection
- [ ] Server-side exceptions caught and logged, generic error sent to client
- [ ] Error responses include a human-readable message
- [ ] Critical errors (DB failures) logged but don't crash the WebSocket loop

---

### 9.11 Build frontend WebSocket connection hook

**Estimate:** 4 hours

**Description:**
Create a useWebSocket React hook that manages the WebSocket connection lifecycle and provides methods for sending and subscribing to messages.

**Acceptance Criteria:**
- [ ] `useWebSocket(sessionJoinCode)` hook in `src/hooks/useWebSocket.ts`
- [ ] Connects to `ws://{host}/ws/session/{joinCode}` on mount
- [ ] Exposes `send(type, payload)` method
- [ ] Exposes `subscribe(eventType, handler)` method
- [ ] Exposes connection state: "connecting", "connected", "disconnected", "reconnecting"
- [ ] Automatically sends ping responses to server pings
- [ ] Cleans up connection on unmount
- [ ] TypeScript types for all message types

---

### 9.12 Implement frontend reconnection with exponential backoff

**Estimate:** 3 hours

**Description:**
Add automatic reconnection logic to the WebSocket hook with exponential backoff to handle network interruptions.

**Acceptance Criteria:**
- [ ] Auto-reconnect on unexpected disconnect
- [ ] Backoff schedule: 1s, 2s, 4s (exponential)
- [ ] Maximum 3 reconnection attempts
- [ ] Rejoin session room automatically on successful reconnect
- [ ] Reset backoff counter on successful connection
- [ ] Expose `reconnectAttempt` and `maxAttempts` in hook state
- [ ] Manual `reconnect()` method for user-initiated retry
- [ ] Stop reconnecting if session has ended

---

### 9.13 Build connection status indicator component

**Estimate:** 2 hours

**Description:**
Build a small visual indicator showing the current WebSocket connection state.

**Acceptance Criteria:**
- [ ] Small dot/badge component showing connection state
- [ ] Green: connected, Red: disconnected, Yellow/Orange: reconnecting
- [ ] Optional text label: "Connected", "Disconnected", "Reconnecting..."
- [ ] Tooltip with more details on hover
- [ ] Uses useWebSocket hook state
- [ ] Positioned unobtrusively (header corner or similar)
- [ ] Accessible with ARIA labels

---

## Epic 10: WebSocket Events

**Description:** Implement all the specific WebSocket event types for real-time communication between the server, presenter, and audience. Each event has a defined broadcast pattern (to all, to speaker only, to specific participant).

**Epic Total: 23 hours**

---

### 10.1 Implement slide changed event broadcast

**Estimate:** 2 hours

**Description:**
Broadcast the current slide data to all audience members when the speaker navigates to a different slide.

**Acceptance Criteria:**
- [ ] Event type: `slide_changed`
- [ ] Payload: `{slide_id, slide_type, content, order_index, total_slides}`
- [ ] Broadcast to ALL connections in the session (audience + speaker)
- [ ] Triggered when current_slide_id changes via the API
- [ ] Uses `websocket_events.broadcast_slide_change()` service function
- [ ] Audience receives full slide content to render

---

### 10.2 Implement participant joined event

**Estimate:** 2 hours

**Description:**
Notify the speaker when an audience member joins the session.

**Acceptance Criteria:**
- [ ] Event type: `participant_joined`
- [ ] Payload: `{participant_id, name, participant_count}`
- [ ] Sent to the SPEAKER connection only (not broadcast to all audience)
- [ ] Triggered when a new audience WebSocket connection is established
- [ ] Includes the updated total participant count
- [ ] Name is "Anonymous" if not provided

---

### 10.3 Implement participant left event

**Estimate:** 2 hours

**Description:**
Notify the speaker when an audience member disconnects from the session.

**Acceptance Criteria:**
- [ ] Event type: `participant_left`
- [ ] Payload: `{participant_id, name, participant_count}`
- [ ] Sent to the SPEAKER connection only
- [ ] Triggered on WebSocket disconnect (normal or error)
- [ ] Includes the updated total participant count
- [ ] Handles rapid disconnect/reconnect gracefully

---

### 10.4 Implement participant count update event

**Estimate:** 1 hour

**Description:**
Broadcast the current participant count to all connections whenever it changes.

**Acceptance Criteria:**
- [ ] Event type: `participant_count`
- [ ] Payload: `{count}`
- [ ] Broadcast to ALL connections in the session
- [ ] Sent after every join or leave event
- [ ] Debounced to avoid flooding during rapid join/leave sequences
- [ ] Used by both presenter and audience to display count

---

### 10.5 Implement response submitted event

**Estimate:** 2 hours

**Description:**
Notify the speaker when an audience member submits a response to a question slide.

**Acceptance Criteria:**
- [ ] Event type: `response_submitted`
- [ ] Payload: `{slide_id, participant_name, response_content, response_type, timestamp}`
- [ ] Sent to the SPEAKER connection for the response feed
- [ ] Triggered when a response is saved to the database
- [ ] Includes the response content (text or selected choice)
- [ ] Does not broadcast the individual response to other audience members

---

### 10.6 Implement aggregated vote update event

**Estimate:** 3 hours

**Description:**
After each vote on a multiple choice question, recalculate the aggregated totals and broadcast to all participants.

**Acceptance Criteria:**
- [ ] Event type: `vote_update`
- [ ] Payload: `{slide_id, options: [{text, count, percentage}], total_votes}`
- [ ] Broadcast to ALL connections in the session
- [ ] Triggered after each new vote on a question_choice slide
- [ ] Recalculates percentages from current totals
- [ ] Used by presenter to show chart, audience to see results (if show_results is enabled)
- [ ] Efficient: doesn't requery all votes, maintains running totals

---

### 10.7 Implement question asked event

**Estimate:** 2 hours

**Description:**
Notify the speaker when an audience member asks a free-form question.

**Acceptance Criteria:**
- [ ] Event type: `question_asked`
- [ ] Payload: `{question_text, participant_name, participant_id, timestamp}`
- [ ] Sent to the SPEAKER connection only
- [ ] Triggered when audience submits a question via the Q&A feature
- [ ] Speaker sees the question in the response feed
- [ ] Question is also stored in the database for later review

---

### 10.8 Implement AI response event

**Estimate:** 2 hours

**Description:**
Send the AI-generated answer back to the specific audience member who asked the question.

**Acceptance Criteria:**
- [ ] Event type: `ai_response`
- [ ] Payload: `{question_text, answer_text, timestamp}`
- [ ] Sent to the SPECIFIC participant who asked the question (not broadcast)
- [ ] Triggered after LLM processes the question
- [ ] Uses `send_personal()` on the connection manager
- [ ] Handles case where participant disconnected before answer arrives

---

### 10.9 Implement session started event

**Estimate:** 1 hour

**Description:**
Broadcast to all waiting audience members when the speaker starts the session.

**Acceptance Criteria:**
- [ ] Event type: `session_started`
- [ ] Payload: `{session_id, first_slide}` with the first slide data
- [ ] Broadcast to ALL connections in the session
- [ ] Triggers audience transition from waiting screen to active view
- [ ] Sent by the start session endpoint

---

### 10.10 Implement session ended event

**Estimate:** 1 hour

**Description:**
Broadcast to all participants when the speaker ends the session.

**Acceptance Criteria:**
- [ ] Event type: `session_ended`
- [ ] Payload: `{session_id, ended_at, summary_available}`
- [ ] Broadcast to ALL connections in the session
- [ ] Triggers audience transition to the session ended screen
- [ ] Sent by the end session endpoint
- [ ] WebSocket connections are gracefully closed after sending

---

### 10.11 Implement session paused/resumed event

**Estimate:** 1 hour

**Description:**
Broadcast session pause and resume state changes to all participants.

**Acceptance Criteria:**
- [ ] Event types: `session_paused` and `session_resumed`
- [ ] Payload: `{session_id, timestamp}`
- [ ] Broadcast to ALL connections in the session
- [ ] Audience shows "Session paused" indicator when paused
- [ ] Response inputs disabled/enabled based on paused state
- [ ] Sent by the pause/resume session endpoints

---

### 10.12 Create frontend event handlers for all events

**Estimate:** 4 hours

**Description:**
Register handlers in the useWebSocket hook for all incoming event types, dispatching Redux actions or updating local state.

**Acceptance Criteria:**
- [ ] Handler for `slide_changed`: update current slide in local state
- [ ] Handler for `participant_count`: update audience count display
- [ ] Handler for `response_submitted`: add to presenter's response feed
- [ ] Handler for `vote_update`: update chart data for the current question
- [ ] Handler for `ai_response`: display AI answer to the audience member
- [ ] Handler for `session_started`/`ended`/`paused`/`resumed`: update session state
- [ ] Handler for `error`: display toast notification
- [ ] Unrecognized event types logged as warnings but don't crash

---

## Epic 11: Presenter View

**Description:** Build the speaker's presentation delivery interface with real-time slide display, navigation controls, session management, audience metrics, and response monitoring. The presenter view is desktop-optimized and supports keyboard shortcuts and full-screen mode.

**Epic Total: 43 hours**

---

### 11.1 Build presenter view page layout

**Estimate:** 4 hours

**Description:**
Create the presenter page at /sessions/:sessionId/present with a layout optimized for delivering presentations: large slide display, sidebar with controls and metrics, and a thumbnail strip.

**Acceptance Criteria:**
- [ ] Route `/sessions/:sessionId/present` renders the presenter view
- [ ] Layout: main slide area (center ~70%), sidebar (right ~30%), thumbnail strip (bottom)
- [ ] Loads session and presentation data on mount
- [ ] Connects to WebSocket with speaker authentication
- [ ] Shows loading state while data is being fetched
- [ ] Redirects to dashboard if session not found or not owned by speaker
- [ ] Responsive: sidebar collapses on smaller screens
- [ ] Dark theme background for distraction-free presenting

---

### 11.2 Build current slide display component

**Estimate:** 3 hours

**Description:**
Build the main slide display area that renders the current slide at large scale, supporting all 5 slide types.

**Acceptance Criteria:**
- [ ] Renders content slides with image and formatted markdown text
- [ ] Renders question_text slides with the question and response summary
- [ ] Renders question_choice slides with the question and vote chart
- [ ] Renders summary slides with generated or placeholder content
- [ ] Renders conclusion slides with takeaways
- [ ] Scales content to fill the available display area
- [ ] Smooth transition animation between slides
- [ ] Maintains aspect ratio (16:9) with letterboxing if needed

---

### 11.3 Build slide navigation controls

**Estimate:** 2 hours

**Description:**
Build Previous/Next navigation buttons and a slide counter for the presenter.

**Acceptance Criteria:**
- [ ] "Previous" and "Next" buttons with arrow icons
- [ ] Previous disabled on the first slide
- [ ] Next disabled on the last slide
- [ ] Shows "Slide X of Y" counter
- [ ] Clicking navigates and calls the change current slide API
- [ ] Updates via WebSocket confirmation (optimistic UI)
- [ ] Buttons are large enough for easy clicking during a talk

---

### 11.4 Build slide thumbnail strip for quick navigation

**Estimate:** 3 hours

**Description:**
Build a horizontal strip of slide thumbnails at the bottom of the presenter view for quick visual navigation.

**Acceptance Criteria:**
- [ ] Horizontal scrollable strip of small slide thumbnails
- [ ] Current slide highlighted with a cyan border
- [ ] Clicking a thumbnail navigates to that slide
- [ ] Auto-scrolls to keep the current slide visible
- [ ] Shows slide number on each thumbnail
- [ ] Slide type icon badge on each thumbnail
- [ ] Smooth scroll animation

---

### 11.5 Build jump to slide modal

**Estimate:** 2 hours

**Description:**
Build a modal with a grid of all slide thumbnails for direct navigation to any slide.

**Acceptance Criteria:**
- [ ] Grid layout of all slide thumbnails
- [ ] Each thumbnail shows slide number, type icon, and preview
- [ ] Current slide visually distinguished
- [ ] Clicking a thumbnail navigates and closes the modal
- [ ] Opened via a button or keyboard shortcut (G key)
- [ ] Modal closable with ESC or clicking outside
- [ ] Keyboard accessible: tab through items, Enter to select

---

### 11.6 Build session start button and flow

**Estimate:** 2 hours

**Description:**
Build the "Start Session" button displayed when the session is in "created" state, with a confirmation dialog.

**Acceptance Criteria:**
- [ ] "Start Session" button displayed when session status is "created"
- [ ] Confirmation dialog: "Start this session? Audience members will see your slides."
- [ ] On confirm: calls PATCH /api/sessions/{id}/start
- [ ] On success: UI transitions to active state with session controls
- [ ] Button replaced by pause/end controls after starting
- [ ] Loading state during API call
- [ ] Error handling for edge cases (session already started)

---

### 11.7 Build session end button with confirmation

**Estimate:** 2 hours

**Description:**
Build the "End Session" button with a warning confirmation modal.

**Acceptance Criteria:**
- [ ] "End Session" button visible when session is active or paused
- [ ] Styled as destructive action (red accent color)
- [ ] Confirmation modal: "End this session? This cannot be undone."
- [ ] On confirm: calls PATCH /api/sessions/{id}/end
- [ ] On success: shows session summary/stats
- [ ] Loading state during API call
- [ ] Audience receives session_ended event

---

### 11.8 Build session pause/resume toggle

**Estimate:** 2 hours

**Description:**
Build a toggle button for pausing and resuming the session.

**Acceptance Criteria:**
- [ ] Shows "Pause" with pause icon when session is active
- [ ] Shows "Resume" with play icon when session is paused
- [ ] Calls appropriate API endpoint on click
- [ ] Visual indicator of current state (color, icon change)
- [ ] Loading state during API call
- [ ] Broadcasts appropriate WebSocket event
- [ ] Error handling for invalid state transitions

---

### 11.9 Build join code display panel

**Estimate:** 2 hours

**Description:**
Build a sidebar panel showing the session join code in large readable text with a copy button.

**Acceptance Criteria:**
- [ ] Displays join code in large, bold, monospace text (e.g., "ABC123")
- [ ] Characters spaced for readability
- [ ] Copy button copies join code to clipboard with "Copied!" tooltip
- [ ] Full join URL displayed below (e.g., oratify.com/join/ABC123)
- [ ] Join URL also copyable
- [ ] Text readable when projected on screen
- [ ] Styled consistently with sidebar design

---

### 11.10 Build QR code display for projection

**Estimate:** 2 hours

**Description:**
Build a large QR code display for the join URL, optimized for projection screens.

**Acceptance Criteria:**
- [ ] Large QR code (300x300px minimum) linking to the session join URL
- [ ] Toggle button to show/hide QR code
- [ ] Overlay mode: shows QR code over the slide area with semi-transparent background
- [ ] Non-overlay: shows in sidebar
- [ ] Join code text below QR for manual entry
- [ ] Scannable from reasonable projection distance
- [ ] Uses the QRCode component built in Epic 8

---

### 11.11 Build connected audience counter

**Estimate:** 2 hours

**Description:**
Build a counter displaying the number of currently connected audience members, updating in real-time.

**Acceptance Criteria:**
- [ ] Displays "X connected" with a person icon
- [ ] Updates in real-time via participant_count WebSocket events
- [ ] Shows "0 connected" when no audience members present
- [ ] Subtle animation on count change (pulse or number transition)
- [ ] Positioned prominently in the sidebar
- [ ] Styled consistently with sidebar design

---

### 11.12 Build session timer display

**Estimate:** 2 hours

**Description:**
Build a timer showing elapsed time since the session started, with pause support.

**Acceptance Criteria:**
- [ ] Displays elapsed time in HH:MM:SS format
- [ ] Starts from 00:00:00 when session starts
- [ ] Pauses when session is paused, resumes on resume
- [ ] Updates every second via client-side interval
- [ ] Calculates initial elapsed time from session's started_at timestamp on page load
- [ ] Monospace font for stable digit width
- [ ] Positioned in sidebar or header

---

### 11.13 Build response counter for current slide

**Estimate:** 2 hours

**Description:**
Build a counter showing the number of responses for the current slide, only visible on question slides.

**Acceptance Criteria:**
- [ ] Displays "X responses" for the current question slide
- [ ] Only visible for question_text and question_choice slide types
- [ ] Hidden for content, summary, and conclusion slides
- [ ] Updates in real-time via WebSocket events
- [ ] Resets to correct count when navigating between slides
- [ ] Shows "0 responses" when no responses yet
- [ ] Positioned near the slide display area

---

### 11.14 Build real-time response feed

**Estimate:** 4 hours

**Description:**
Build a scrollable feed showing incoming audience responses in real-time.

**Acceptance Criteria:**
- [ ] Vertically scrollable list of responses
- [ ] Each entry: participant name, response content, relative timestamp
- [ ] Newest responses at the top
- [ ] Auto-scrolls to top for new responses (if not manually scrolled)
- [ ] Supports text responses and choice selections
- [ ] Audience questions displayed with distinct styling
- [ ] Updates via WebSocket events
- [ ] Empty state: "No responses yet"
- [ ] Performant with many entries (virtualized if needed)

---

### 11.15 Build response feed filtering options

**Estimate:** 2 hours

**Description:**
Add filtering controls to the response feed for the presenter.

**Acceptance Criteria:**
- [ ] Filter options: "All", "Current Slide", "Questions Only"
- [ ] Filters applied immediately to the feed
- [ ] "All" shows responses across all slides
- [ ] "Current Slide" filters to the active slide only
- [ ] "Questions Only" shows audience question_asked events
- [ ] Toggle to pause/resume auto-scrolling
- [ ] "New responses" badge when auto-scroll is paused
- [ ] Filter state persists during slide navigation

---

### 11.16 Build full-screen presentation mode

**Estimate:** 3 hours

**Description:**
Build full-screen mode that shows only the slide with minimal controls, hiding sidebar and browser chrome.

**Acceptance Criteria:**
- [ ] Activated via button click or F key
- [ ] Uses Fullscreen API to hide browser chrome
- [ ] Shows only slide display and minimal navigation arrows
- [ ] Hides sidebar, thumbnail strip, and header
- [ ] Slide counter visible in corner
- [ ] ESC exits full-screen and returns to normal layout
- [ ] Keyboard shortcuts still work in full-screen
- [ ] WebSocket events continue processing
- [ ] Graceful fallback for browsers without Fullscreen API

---

### 11.17 Add keyboard shortcuts for presenter navigation

**Estimate:** 2 hours

**Description:**
Implement keyboard shortcuts for common presenter actions during a live session.

**Acceptance Criteria:**
- [ ] Left arrow / Page Up: previous slide
- [ ] Right arrow / Page Down / Space: next slide
- [ ] F: toggle full-screen mode
- [ ] P: toggle pause/resume session
- [ ] G: open jump-to-slide modal
- [ ] Shortcuts disabled when text input or modal is focused
- [ ] Help overlay accessible via ? key
- [ ] Event listeners cleaned up on unmount

---

### 11.18 Build presenter view header with presentation info

**Estimate:** 2 hours

**Description:**
Build the header bar showing presentation title, session status, and navigation.

**Acceptance Criteria:**
- [ ] Displays presentation title
- [ ] Session status badge: color-coded (green=active, yellow=paused, gray=created, red=ended)
- [ ] "Back to Dashboard" link/button
- [ ] Confirmation prompt when leaving an active session
- [ ] Compact height to maximize slide display area
- [ ] Dark theme styling
- [ ] Responsive to different screen widths

---

## Epic 12: Audience View

**Description:** Build the mobile-first audience experience for participating in a live session. This includes real-time slide display, text and choice response inputs, question submission with AI answers, and all transitional states. The audience view replaces the current placeholder and is optimized for mobile devices as a PWA.

**Epic Total: 39 hours**

---

### 12.1 Build audience view page layout

**Estimate:** 3 hours

**Description:**
Build the /join/audience route with a mobile-first, full-viewport layout replacing the current placeholder. Three sections: header (session info), center (slide content), bottom (response input).

**Acceptance Criteria:**
- [ ] Page at `/join/audience` route replaces current placeholder
- [ ] Full viewport height layout (100dvh for mobile compatibility)
- [ ] Three sections: header (top), slide content (center, flexible), response area (bottom)
- [ ] Mobile-first design working from 320px width
- [ ] No horizontal scrolling on mobile
- [ ] Connects to WebSocket on mount using session join code from state
- [ ] Redirects to /join if no session data in state
- [ ] Graceful desktop scaling

---

### 12.2 Build audience header with session info

**Estimate:** 2 hours

**Description:**
Build the header for the audience view with presentation title, slide counter, connection status, and leave button.

**Acceptance Criteria:**
- [ ] Displays presentation title (truncated if too long)
- [ ] Shows "Slide X of Y" updating on slide changes
- [ ] Connection status indicator (green/red/yellow dot)
- [ ] "Leave" button disconnects WebSocket and navigates to /join
- [ ] Compact height to maximize content area on mobile
- [ ] Fixed at top, doesn't scroll with content
- [ ] Dark theme styling

---

### 12.3 Build content slide display for audience

**Estimate:** 3 hours

**Description:**
Build the audience rendering for content slides showing title, markdown body, and optional image.

**Acceptance Criteria:**
- [ ] Renders slide title as prominent heading
- [ ] Renders body text as markdown (bold, italic, lists, links, code)
- [ ] Renders optional image, responsive to viewport width
- [ ] Images do not exceed viewport width
- [ ] Long content scrollable within the content area
- [ ] Font sizes optimized for mobile readability
- [ ] Handles slides with missing text or image gracefully
- [ ] Smooth transition on slide change

---

### 12.4 Build waiting for next slide state

**Estimate:** 2 hours

**Description:**
Display a transitional state when the audience is between slides or the speaker hasn't advanced yet.

**Acceptance Criteria:**
- [ ] Displays "Waiting for next slide..." centered message
- [ ] Subtle pulse or fade animation
- [ ] Shown when current slide is null or during transitions
- [ ] Automatically replaced on slide_changed event
- [ ] Session ended screen takes priority over waiting state
- [ ] Consistent styling with audience view
- [ ] Animation is performance-efficient on mobile

---

### 12.5 Build text response input component

**Estimate:** 2 hours

**Description:**
Build the text input for question_text slides with character limit and submit button.

**Acceptance Criteria:**
- [ ] Text area in the bottom response area for question_text slides
- [ ] Placeholder: "Type your response..."
- [ ] Character limit enforced (500 chars) with visible counter
- [ ] Submit button disabled when text area is empty
- [ ] Submit sends response via WebSocket or REST API
- [ ] Accommodates mobile keyboard without layout issues
- [ ] Not displayed for non-question slide types
- [ ] Supports multi-line input

---

### 12.6 Build multiple choice voting buttons

**Estimate:** 3 hours

**Description:**
Build large, tappable voting buttons for question_choice slides.

**Acceptance Criteria:**
- [ ] One button per answer option from the slide data
- [ ] Buttons minimum 48px height for easy mobile tapping
- [ ] Tapping highlights the selected option
- [ ] Only one option selectable at a time (unless allow_multiple)
- [ ] Submit button disabled until an option is selected
- [ ] Submit sends the selected option
- [ ] Options rendered in defined order
- [ ] Supports up to 6 options without layout issues

---

### 12.7 Build response submission handler

**Estimate:** 2 hours

**Description:**
Implement the logic for submitting audience responses to the server.

**Acceptance Criteria:**
- [ ] Sends response as WebSocket message: `{type: "submit_response", payload: {slide_id, content}}`
- [ ] Falls back to REST API if WebSocket is disconnected
- [ ] Disables input immediately after submission
- [ ] Shows loading state during submission
- [ ] Transitions to confirmation state on success
- [ ] Shows error message and re-enables input on failure
- [ ] Prevents duplicate submissions for the same slide
- [ ] Handles race conditions if slide changes during submission

---

### 12.8 Build response submitted confirmation state

**Estimate:** 2 hours

**Description:**
Show a confirmation UI after an audience member successfully submits a response.

**Acceptance Criteria:**
- [ ] Displays "Response submitted!" with checkmark icon/animation
- [ ] Replaces the input area (text area or voting buttons)
- [ ] Checkmark animation plays once (CSS animation)
- [ ] Shows the user's submitted response or selected option
- [ ] State persists for this slide if user navigates back
- [ ] Success color styling (cyan accent)
- [ ] Centered in the response area

---

### 12.9 Build already responded state display

**Estimate:** 2 hours

**Description:**
Show the user's previous response when the speaker navigates back to a slide they already responded to.

**Acceptance Criteria:**
- [ ] Displays "Already responded" message
- [ ] Shows the user's previously submitted response
- [ ] No input area or submit button shown
- [ ] Checks local state or server to determine previous response
- [ ] State determined on each slide_changed event
- [ ] Styled to indicate past response, not active input
- [ ] Works for both question_text and question_choice slides

---

### 12.10 Build ask question floating action button

**Estimate:** 2 hours

**Description:**
Build a floating action button (FAB) for asking free-form questions, available on any slide type.

**Acceptance Criteria:**
- [ ] FAB positioned in bottom-right corner
- [ ] Question mark or chat icon
- [ ] Tapping opens the question submission modal
- [ ] Available on all slide types
- [ ] Does not overlap with response input area
- [ ] Hidden when session is paused or ended
- [ ] Subtle shadow for visual elevation
- [ ] Minimum 56px diameter for easy tapping

---

### 12.11 Build question submission modal

**Estimate:** 3 hours

**Description:**
Build a modal for audience members to submit free-form questions to be answered by AI.

**Acceptance Criteria:**
- [ ] Modal slides up from bottom (mobile sheet pattern)
- [ ] Text area with placeholder "Ask a question..."
- [ ] Submit button sends question via WebSocket
- [ ] Note: "Your question will be answered by AI"
- [ ] After submit: shows "Question sent!" confirmation
- [ ] Dismissible by tapping outside, swiping down, or close button
- [ ] Character limit (300 chars)
- [ ] Submit disabled when text area is empty

---

### 12.12 Build AI response display area

**Estimate:** 3 hours

**Description:**
Display the AI-generated answer after an audience member submits a question.

**Acceptance Criteria:**
- [ ] Displays AI response in a card/panel overlay
- [ ] Renders answer as markdown (bold, italic, lists, code)
- [ ] Shows original question above the answer for context
- [ ] Card dismissible with close button or swipe
- [ ] Multiple responses stacked (newest at top)
- [ ] Triggered by ai_response WebSocket event
- [ ] Scrollable for long answers
- [ ] Distinct background styling

---

### 12.13 Build AI response loading state

**Estimate:** 2 hours

**Description:**
Show a loading state while the AI processes a question.

**Acceptance Criteria:**
- [ ] Displays "Thinking..." text in AI response area
- [ ] Typing indicator animation (three bouncing/fading dots)
- [ ] Shown after question submission, before ai_response arrives
- [ ] Replaced by actual AI response when it arrives
- [ ] Timeout message after 30 seconds if no response
- [ ] Smooth animation, performant on mobile
- [ ] Consistent styling with AI response area

---

### 12.14 Build session ended screen for audience

**Estimate:** 2 hours

**Description:**
Display a screen when the session ends, triggered by the session_ended WebSocket event.

**Acceptance Criteria:**
- [ ] Displays "This session has ended"
- [ ] "Thank you for participating!" message
- [ ] Optional "View Summary" link if summary was generated
- [ ] "Join another session" button navigates to /join
- [ ] Triggered by session_ended WebSocket event
- [ ] WebSocket connection closed gracefully
- [ ] Replaces entire audience view
- [ ] Consistent styling

---

### 12.15 Build summary slide display for audience

**Estimate:** 2 hours

**Description:**
Render summary slides for the audience, showing AI-generated summary content as read-only markdown.

**Acceptance Criteria:**
- [ ] Renders summary slide title
- [ ] Renders AI-generated summary as markdown
- [ ] Supports rich formatting (headings, lists, bold, italic)
- [ ] No response input shown (read-only)
- [ ] Bottom area shows "Summary" label or is hidden
- [ ] Long content scrollable
- [ ] Consistent styling with content slides
- [ ] "Summary not yet generated" fallback for empty content

---

### 12.16 Build conclusion slide display for audience

**Estimate:** 2 hours

**Description:**
Render conclusion slides for the audience, showing takeaways and closing remarks.

**Acceptance Criteria:**
- [ ] Renders conclusion slide title
- [ ] Renders conclusion content as markdown
- [ ] Supports bullet points, numbered lists, bold, italic
- [ ] No response input shown (read-only)
- [ ] Long content scrollable
- [ ] Consistent styling with other slide types
- [ ] "Conclusion" label in bottom area or hidden
- [ ] Handles empty content gracefully

---

### 12.17 Implement haptic feedback for mobile interactions

**Estimate:** 2 hours

**Description:**
Add subtle vibration feedback for key audience interactions on mobile devices.

**Acceptance Criteria:**
- [ ] Short vibration (50-100ms) on vote submission
- [ ] Short vibration on text response submission
- [ ] Short vibration on question submission
- [ ] Uses Navigator Vibration API (`navigator.vibrate()`)
- [ ] Graceful fallback for unsupported devices (no errors)
- [ ] Feature-detects support before calling API
- [ ] No vibration on other interactions (scroll, navigate, tap)
- [ ] Vibration is subtle and non-repeating

---

# Phase 4: Intelligence

**Description:** Implement response handling, aggregation, visualization, and AI-powered features including Q&A with speaker notes context, summary generation, and conclusion generation.

**Phase Total: 82 hours**

---

## Epic 13: Response Handling & Aggregation

**Description:** Build the backend API and frontend components for submitting, storing, aggregating, and visualizing audience responses. This includes text responses, multiple choice votes, real-time chart updates, and response moderation.

**Epic Total: 33 hours**

---

### 13.1 Create submit response endpoint

**Estimate:** 3 hours

**Description:**
Create the POST /api/responses endpoint that accepts audience responses. Content format varies by slide type: `{text: string}` for question_text, `{choice_index: int, choice_text: string}` for question_choice.

**Acceptance Criteria:**
- [ ] POST `/api/responses` accepts `{session_id, slide_id, participant_id, content}`
- [ ] Content validated against the slide's type (text vs choice format)
- [ ] Creates a Response record linked to session, slide, and participant
- [ ] Returns 201 with the created response
- [ ] Returns 400 if content format doesn't match slide type
- [ ] Returns 404 if session, slide, or participant not found
- [ ] Returns 400 if session is not active or is paused
- [ ] Triggers `response_submitted` WebSocket event to the speaker

---

### 13.2 Implement response storage with participant tracking

**Estimate:** 2 hours

**Description:**
Store responses in the database with full participant tracking, linking each response to the participant who submitted it.

**Acceptance Criteria:**
- [ ] Response record stores: session_id, slide_id, participant_id, content (JSONB), created_at
- [ ] `is_ai_response` boolean defaults to false for human responses
- [ ] Participant's display name retrievable via the participant relation
- [ ] Indexes on (session_id, slide_id) for efficient querying
- [ ] Content JSONB stores the raw response data
- [ ] Timestamps stored in UTC

---

### 13.3 Implement duplicate response prevention

**Estimate:** 2 hours

**Description:**
Prevent audience members from submitting multiple responses to the same slide within a session.

**Acceptance Criteria:**
- [ ] Unique constraint on (session_id, slide_id, participant_id) for non-AI responses
- [ ] Returns 409 Conflict if participant already responded to this slide
- [ ] Error message includes "You have already responded to this slide"
- [ ] Database constraint enforces uniqueness at the DB level
- [ ] Optional override parameter for speakers to allow re-submission (future use)

---

### 13.4 Create get responses for slide endpoint

**Estimate:** 2 hours

**Description:**
Create a GET endpoint that retrieves all responses for a specific slide within a session, with pagination support.

**Acceptance Criteria:**
- [ ] GET `/api/responses/slide/{slide_id}?session_id={id}` returns responses
- [ ] Supports pagination: `?page=1&per_page=20`
- [ ] Returns `{items, total, page, per_page, pages}`
- [ ] Each response includes participant display name and timestamp
- [ ] Ordered by created_at descending (newest first)
- [ ] Requires speaker authentication (only the session owner can view)
- [ ] Returns 404 if slide or session not found

---

### 13.5 Implement multiple choice vote aggregation

**Estimate:** 3 hours

**Description:**
Aggregate votes for question_choice slides, counting votes per option and calculating percentages.

**Acceptance Criteria:**
- [ ] Aggregation function: given session_id and slide_id, returns per-option counts
- [ ] Result format: `{options: [{text, count, percentage}], total_votes}`
- [ ] Percentages calculated as `(count / total_votes * 100)`, rounded to 1 decimal
- [ ] Handles zero votes gracefully (0% for all options)
- [ ] Efficient query: uses GROUP BY, not loading all individual responses
- [ ] Recalculated on each new vote
- [ ] Service function callable from both REST API and WebSocket event handler

---

### 13.6 Implement real-time vote count broadcasting

**Estimate:** 3 hours

**Description:**
After each vote on a question_choice slide, aggregate totals and broadcast updated results via WebSocket.

**Acceptance Criteria:**
- [ ] After each new vote, recalculate aggregated vote counts
- [ ] Broadcast `vote_update` event with aggregated results
- [ ] Broadcast to all connections in the session
- [ ] Debounced: if multiple votes arrive rapidly, batch into a single broadcast (100ms window)
- [ ] Only broadcasts for question_choice slides (not text responses)
- [ ] Payload matches the aggregation format from 13.5
- [ ] Handles concurrent votes safely (no race conditions in counts)

---

### 13.7 Build bar chart component for vote display

**Estimate:** 4 hours

**Description:**
Build a horizontal bar chart component for displaying multiple choice vote results. CSS-based, no external chart library.

**Acceptance Criteria:**
- [ ] Horizontal bars showing each option's text, bar fill, and count/percentage
- [ ] Bar width proportional to vote count
- [ ] Animated bars that grow smoothly when counts update
- [ ] Uses Oratify colors: cyan bars on dark background
- [ ] Responsive: works in both presenter sidebar and audience view
- [ ] Shows "No votes yet" empty state
- [ ] Updates in real-time when new vote_update events arrive
- [ ] Accessible: screen reader can interpret the chart data

---

### 13.8 Build word cloud component for text responses

**Estimate:** 6 hours

**Description:**
Build a word cloud visualization for text responses on question_text slides, extracting common words and sizing them by frequency.

**Acceptance Criteria:**
- [ ] Extracts words from all text responses for a slide
- [ ] Filters out common stop words (the, a, is, etc.)
- [ ] Words sized proportionally by frequency
- [ ] Minimum 3 letters, maximum 50 unique words displayed
- [ ] Randomized positioning within a bounded area
- [ ] CSS-based or lightweight library (e.g., d3-cloud)
- [ ] Updates when new responses arrive
- [ ] Fallback: simple list of top words if cloud rendering fails

---

### 13.9 Build response statistics calculation

**Estimate:** 2 hours

**Description:**
Calculate aggregate statistics for responses within a session or per slide.

**Acceptance Criteria:**
- [ ] Total response count for the session
- [ ] Response rate: responses / participants as percentage
- [ ] Per-slide response counts
- [ ] Most popular choice per question_choice slide
- [ ] Average response length for text responses
- [ ] Statistics available via service function (used by stats endpoint and UI)

---

### 13.10 Create export responses endpoint

**Estimate:** 3 hours

**Description:**
Create an endpoint that exports all session responses as CSV or JSON for post-session analysis.

**Acceptance Criteria:**
- [ ] GET `/api/sessions/{id}/export?format=csv` returns CSV download
- [ ] GET `/api/sessions/{id}/export?format=json` returns JSON
- [ ] CSV includes columns: slide_title, slide_type, participant_name, response_content, timestamp
- [ ] Responses grouped by slide, ordered by slide order then timestamp
- [ ] Content-Disposition header triggers file download
- [ ] Requires speaker authentication and session ownership
- [ ] Returns 404 if session not found

---

### 13.11 Build response moderation controls

**Estimate:** 3 hours

**Description:**
Allow the speaker to hide or flag inappropriate responses from the response feed.

**Acceptance Criteria:**
- [ ] "Hide" button on each response in the presenter's feed
- [ ] Hidden responses removed from aggregation counts
- [ ] Hidden responses not visible in the audience view
- [ ] "Flag" option marks response for review without hiding
- [ ] Hidden responses still visible to the speaker with a "hidden" indicator
- [ ] "Unhide" option to restore hidden responses
- [ ] Database stores hidden/flagged state on the Response model

---

## Epic 14: AI Integration

**Description:** Integrate LLM capabilities using LiteLLM abstraction for answering audience questions with speaker notes context, generating session summaries, and creating conclusions. Includes streaming responses, caching, rate limiting, and error handling.

**Epic Total: 49 hours**

---

### 14.1 Set up LiteLLM service

**Estimate:** 3 hours

**Description:**
Create the LLM service module at app/services/llm.py that initializes a LiteLLM client configured from environment variables.

**Acceptance Criteria:**
- [ ] `app/services/llm.py` module created
- [ ] Initializes LiteLLM with configuration from environment variables
- [ ] Reads `OPENAI_API_KEY` and `OLLAMA_BASE_URL` from environment
- [ ] Provides an async `generate(prompt, system_prompt, **kwargs)` method
- [ ] Returns structured response: `{text, tokens_used, model, latency_ms}`
- [ ] Handles import errors gracefully if litellm is not installed
- [ ] Configurable default model via `LLM_MODEL` env var (default: "gpt-4o-mini")

---

### 14.2 Create LLM provider configuration schema

**Estimate:** 2 hours

**Description:**
Define Pydantic models for LLM configuration including provider, model, API keys, and generation parameters.

**Acceptance Criteria:**
- [ ] `LLMConfig` Pydantic model: provider, model, api_key, base_url, temperature, max_tokens
- [ ] Provider enum: "openai", "ollama", "litellm"
- [ ] Default temperature: 0.7, default max_tokens: 1024
- [ ] Configuration loadable from environment variables or database
- [ ] Validation: api_key required for OpenAI, base_url required for Ollama
- [ ] Schema documented with field descriptions

---

### 14.3 Implement OpenAI provider adapter

**Estimate:** 3 hours

**Description:**
Implement the adapter for calling OpenAI models via LiteLLM.

**Acceptance Criteria:**
- [ ] Calls OpenAI API through LiteLLM with configured API key
- [ ] Default model: gpt-4o-mini
- [ ] Handles API errors: rate limit (429), auth error (401), server error (500)
- [ ] Retries on transient errors with exponential backoff (max 3 attempts)
- [ ] Parses response to extract text content and token usage
- [ ] Logs request latency and token usage
- [ ] Timeout: 30 seconds per request

---

### 14.4 Implement Ollama provider adapter

**Estimate:** 3 hours

**Description:**
Implement the adapter for calling local Ollama models via LiteLLM.

**Acceptance Criteria:**
- [ ] Calls Ollama API through LiteLLM with configured base_url
- [ ] Default base URL: `http://localhost:11434`
- [ ] Handles connection errors (Ollama not running)
- [ ] Handles model not found errors
- [ ] Lists available models via Ollama API
- [ ] Parses response in the same format as OpenAI adapter
- [ ] Logs request latency
- [ ] Longer timeout: 60 seconds (local models can be slower)

---

### 14.5 Implement provider switching logic

**Estimate:** 2 hours

**Description:**
Implement fallback logic to try the primary provider first and fall back to the secondary on failure.

**Acceptance Criteria:**
- [ ] Primary and secondary provider configurable via environment variables
- [ ] On primary provider failure, automatically retry with secondary
- [ ] Logs provider switch: "Primary provider failed, falling back to secondary"
- [ ] If both fail, returns a structured error
- [ ] Provider health check: test connection before using
- [ ] Switching is transparent to callers of the LLM service

---

### 14.6 Implement token counting utility

**Estimate:** 2 hours

**Description:**
Count tokens for input text to ensure prompts stay within model limits.

**Acceptance Criteria:**
- [ ] Uses tiktoken for OpenAI models
- [ ] Estimates tokens for non-OpenAI models (chars / 4 approximation)
- [ ] `count_tokens(text, model)` returns integer token count
- [ ] Supports counting system prompt + user prompt combined
- [ ] Warns when input exceeds 80% of model's context window
- [ ] Model context limits: gpt-4o-mini = 128K, configurable for others

---

### 14.7 Implement context truncation strategy

**Estimate:** 2 hours

**Description:**
Truncate speaker notes when they exceed the model's token limit while preserving the most useful content.

**Acceptance Criteria:**
- [ ] If notes + prompt exceed token limit, truncate the notes
- [ ] Truncation strategy: keep first 70% and last 30% of notes (beginning and end are usually most important)
- [ ] Add "[...content truncated...]" marker at the truncation point
- [ ] Log a warning when truncation occurs
- [ ] Return a flag indicating truncation happened (for UI warning)
- [ ] Configurable maximum context tokens (default: 4000)

---

### 14.8 Create question answering prompt template

**Estimate:** 2 hours

**Description:**
Design the prompt template for answering audience questions using speaker notes as context.

**Acceptance Criteria:**
- [ ] System prompt: "You are an AI assistant helping answer audience questions during a presentation. Use the speaker's notes below as your primary source of information. If the notes don't contain relevant information, say so politely."
- [ ] System prompt includes the speaker notes as context
- [ ] User prompt includes the audience question
- [ ] Template handles empty speaker notes gracefully
- [ ] Prompt engineered to produce concise answers (2-3 paragraphs max)
- [ ] Template stored as a configurable constant

---

### 14.9 Create answer audience question endpoint

**Estimate:** 4 hours

**Description:**
Create the endpoint that accepts an audience question, processes it through the LLM with speaker notes context, and returns the answer.

**Acceptance Criteria:**
- [ ] POST `/api/ai/answer` accepts `{session_id, question, participant_id}`
- [ ] Loads speaker notes from the session's presentation
- [ ] Constructs prompt using the Q&A template
- [ ] Calls LLM service and gets the answer
- [ ] Saves the answer as a Response record with `is_ai_response=true`
- [ ] Broadcasts `ai_response` WebSocket event to the participant
- [ ] Returns 200 with the answer text
- [ ] Returns 503 if LLM service is unavailable

---

### 14.10 Create summary generation prompt template

**Estimate:** 2 hours

**Description:**
Design the prompt template for generating a session summary from all collected responses.

**Acceptance Criteria:**
- [ ] System prompt instructs the LLM to summarize audience engagement
- [ ] Input includes all responses grouped by slide
- [ ] Prompt asks for key themes, popular opinions, and interesting insights
- [ ] Output format: structured summary with sections
- [ ] Handles sessions with few responses gracefully
- [ ] Template produces markdown-formatted output

---

### 14.11 Create generate summary endpoint

**Estimate:** 3 hours

**Description:**
Create the endpoint that generates an AI summary of the session's audience responses.

**Acceptance Criteria:**
- [ ] POST `/api/ai/summary` accepts `{session_id}`
- [ ] Collects all responses for the session grouped by slide
- [ ] Constructs prompt using the summary template
- [ ] Calls LLM service and gets the summary
- [ ] Stores summary as the content of the session's summary slide
- [ ] Returns 200 with the generated summary text
- [ ] Requires speaker authentication and session ownership
- [ ] Returns 400 if session has no responses

---

### 14.12 Create conclusion generation prompt template

**Estimate:** 2 hours

**Description:**
Design the prompt for generating key takeaways and conclusions based on speaker notes and audience responses.

**Acceptance Criteria:**
- [ ] System prompt includes speaker notes AND all audience responses
- [ ] Asks LLM to generate 3-5 key takeaways
- [ ] Output format: numbered list of conclusions
- [ ] Conclusions reflect both the speaker's intent and audience engagement
- [ ] Template produces markdown-formatted output
- [ ] Handles sessions with no responses (conclusions from notes only)

---

### 14.13 Create generate conclusion endpoint

**Estimate:** 3 hours

**Description:**
Create the endpoint that generates conclusions for the session.

**Acceptance Criteria:**
- [ ] POST `/api/ai/conclusion` accepts `{session_id}`
- [ ] Loads speaker notes and all session responses
- [ ] Constructs prompt using the conclusion template
- [ ] Calls LLM service and gets the conclusions
- [ ] Stores conclusions as the content of the session's conclusion slide
- [ ] Returns 200 with the generated conclusions
- [ ] Requires speaker authentication and session ownership

---

### 14.14 Implement streaming response support

**Estimate:** 4 hours

**Description:**
Stream LLM responses via WebSocket, sending tokens as they arrive for a real-time typing effect.

**Acceptance Criteria:**
- [ ] LLM service supports streaming mode (yields tokens)
- [ ] Streaming tokens sent as WebSocket messages: `{type: "ai_stream", payload: {token, done}}`
- [ ] `done: true` sent on final token
- [ ] Falls back to non-streaming if provider doesn't support it
- [ ] Handles stream interruptions gracefully
- [ ] Client receives tokens and assembles the full response
- [ ] Timeout if no tokens received for 15 seconds

---

### 14.15 Build streaming response display component

**Estimate:** 3 hours

**Description:**
Build a frontend component that displays streamed AI response tokens progressively.

**Acceptance Criteria:**
- [ ] Receives streaming tokens from WebSocket
- [ ] Displays text progressively with typing effect
- [ ] Cursor blink animation at the end of current text
- [ ] Renders markdown as it's received (buffered paragraph rendering)
- [ ] Shows complete response when streaming finishes
- [ ] Handles interruptions: shows partial response with "Response interrupted" note
- [ ] Smooth scrolling to keep new text visible

---

### 14.16 Implement AI response caching

**Estimate:** 3 hours

**Description:**
Cache AI responses for identical questions within a session to avoid duplicate LLM calls.

**Acceptance Criteria:**
- [ ] In-memory cache keyed by `(session_id, question_hash)`
- [ ] Question hash: normalized lowercase, trimmed, hashed with SHA-256
- [ ] Cache hit returns the previous answer immediately
- [ ] Cache miss proceeds to LLM call and stores the result
- [ ] Cache cleared when session ends
- [ ] Cache size limited per session (max 100 entries)
- [ ] Cache hit/miss logged for monitoring

---

### 14.17 Implement AI request rate limiting

**Estimate:** 2 hours

**Description:**
Limit the number of AI requests per participant and per session to prevent abuse.

**Acceptance Criteria:**
- [ ] Per-participant limit: 5 AI questions per session
- [ ] Per-session limit: 100 AI requests total
- [ ] Returns 429 Too Many Requests when limit exceeded
- [ ] Error message includes remaining quota
- [ ] Limits configurable via environment variables
- [ ] Limits tracked in memory (keyed by session_id and participant_id)
- [ ] Counters reset when session ends

---

### 14.18 Implement AI error handling and fallbacks

**Estimate:** 2 hours

**Description:**
Handle LLM failures gracefully with user-friendly error messages and fallback behavior.

**Acceptance Criteria:**
- [ ] Timeout errors: "The AI is taking longer than expected. Please try again."
- [ ] API errors: "AI service is temporarily unavailable. Please try again later."
- [ ] Rate limit errors: "Too many requests. Please wait a moment."
- [ ] All errors logged with full details for debugging
- [ ] Error response sent to participant via WebSocket
- [ ] Failed requests do not count against the participant's quota
- [ ] Fallback message for when all providers fail

---

### 14.19 Add AI usage tracking per session

**Estimate:** 2 hours

**Description:**
Track AI usage metrics per session for monitoring and cost estimation.

**Acceptance Criteria:**
- [ ] Track per session: total AI calls, total tokens used (input + output), estimated cost
- [ ] Cost estimated from token count using configurable per-token pricing
- [ ] Metrics available via the session stats endpoint
- [ ] Stored in a session metadata JSON field or separate table
- [ ] Updated after each AI call
- [ ] Accessible to speakers and admins

---

# Phase 5: Management

**Description:** Build the admin dashboard for user and system management, and implement plan/subscription structure for usage limits.

**Phase Total: 76 hours**

---

## Epic 15: Admin Dashboard

**Description:** Build a full admin interface for managing speakers, configuring LLM providers, monitoring active sessions, and viewing system health and usage statistics. The admin dashboard is a separate section of the application requiring admin role authorization.

**Epic Total: 54 hours**

---

### 15.1 Build admin layout with navigation sidebar

**Estimate:** 4 hours

**Description:**
Build the admin section layout with a navigation sidebar at /admin/* routes, styled consistently with the Oratify dark theme.

**Acceptance Criteria:**
- [ ] Admin routes under `/admin/*` path
- [ ] Sidebar navigation with links: Dashboard, Speakers, LLM Config, Sessions, Settings
- [ ] Active link highlighted with cyan accent
- [ ] Main content area beside the sidebar
- [ ] Header with "Admin" label and current admin name
- [ ] Logout button in header
- [ ] Dark theme matching Oratify palette
- [ ] Responsive: sidebar collapses to hamburger on smaller screens

---

### 15.2 Implement admin role authorization

**Estimate:** 3 hours

**Description:**
Add admin role support to the authentication system and protect admin routes.

**Acceptance Criteria:**
- [ ] Add `is_admin` boolean field to the Speaker model (Alembic migration)
- [ ] Backend middleware/dependency `get_current_admin` checks is_admin flag
- [ ] All admin API endpoints use `get_current_admin` dependency
- [ ] Returns 403 Forbidden if user is not admin
- [ ] Frontend `AdminProtectedRoute` component wraps admin pages
- [ ] Non-admin users redirected to dashboard if they access /admin
- [ ] Seed script creates a default admin user

---

### 15.3 Build admin login page

**Estimate:** 2 hours

**Description:**
Build the admin login page that authenticates and redirects to the admin dashboard.

**Acceptance Criteria:**
- [ ] Login form at `/admin/login` (or reuse existing login with admin redirect)
- [ ] Same email/password authentication as speaker login
- [ ] On success: check if user is admin, redirect to /admin/dashboard
- [ ] On success but not admin: show "You don't have admin access" error
- [ ] Error handling for invalid credentials
- [ ] Loading state during authentication
- [ ] Styled consistently with admin theme

---

### 15.4 Build speakers list page

**Estimate:** 4 hours

**Description:**
Build a paginated table listing all speakers with key information and management actions.

**Acceptance Criteria:**
- [ ] Table columns: Name, Email, Presentations (count), Sessions (count), Last Active, Status
- [ ] Sortable columns (click header to sort)
- [ ] Pagination: 20 rows per page, page navigation
- [ ] Search input to filter by name or email
- [ ] Status badge: Active (green), Inactive (red)
- [ ] Row click navigates to speaker detail page
- [ ] "Create Speaker" button in header
- [ ] Backend endpoint: GET `/api/admin/speakers` with pagination and sorting

---

### 15.5 Build speaker detail page

**Estimate:** 3 hours

**Description:**
Build a detail page showing all information about a speaker including their presentations and session history.

**Acceptance Criteria:**
- [ ] Shows speaker: name, email, created date, last active, status, admin flag
- [ ] List of their presentations with title, slide count, date
- [ ] List of their sessions with date, participants, duration
- [ ] "Edit" button opens edit form
- [ ] "Deactivate" button with confirmation
- [ ] "Reset Password" button sends reset email
- [ ] Breadcrumb: Admin > Speakers > {name}

---

### 15.6 Build create speaker form

**Estimate:** 3 hours

**Description:**
Build a form for admins to create new speaker accounts.

**Acceptance Criteria:**
- [ ] Form fields: name, email, password, confirm password, is_admin checkbox
- [ ] Name: required, max 255 characters
- [ ] Email: required, valid email format, unique validation
- [ ] Password: required, minimum 8 characters
- [ ] Is Admin: checkbox, default unchecked
- [ ] On submit: POST `/api/admin/speakers` creates the account
- [ ] On success: redirect to speakers list with success toast
- [ ] On error: show validation errors inline

---

### 15.7 Build edit speaker form

**Estimate:** 2 hours

**Description:**
Build a form for editing speaker account details (excluding password).

**Acceptance Criteria:**
- [ ] Pre-filled form with current speaker data
- [ ] Editable fields: name, email, is_admin
- [ ] Email uniqueness validated on change
- [ ] Password NOT editable (use separate reset flow)
- [ ] On submit: PATCH `/api/admin/speakers/{id}`
- [ ] On success: redirect back with success toast
- [ ] Cancel button returns without saving

---

### 15.8 Implement speaker deactivation

**Estimate:** 2 hours

**Description:**
Allow admins to soft-deactivate speaker accounts, preventing login while preserving data.

**Acceptance Criteria:**
- [ ] "Deactivate" button on speaker detail page
- [ ] Confirmation modal: "Deactivate {name}? They will not be able to log in."
- [ ] Sets `is_active=false` on the speaker (Alembic migration for field)
- [ ] Deactivated speakers cannot log in (auth check)
- [ ] Presentations and sessions preserved
- [ ] "Reactivate" button appears for inactive speakers
- [ ] Admin list shows deactivated status clearly

---

### 15.9 Build LLM configuration page

**Estimate:** 4 hours

**Description:**
Build the admin page for configuring LLM providers, models, and API keys.

**Acceptance Criteria:**
- [ ] Form for primary provider: provider dropdown, model name, API key, temperature, max_tokens
- [ ] Form for secondary provider (fallback): same fields
- [ ] "Test Connection" button that calls the LLM with a test prompt
- [ ] Test result shown: success with response time, or error details
- [ ] Save button persists configuration to database
- [ ] Configuration loaded on page mount
- [ ] Sensible defaults pre-filled

---

### 15.10 Implement API key encrypted storage

**Estimate:** 3 hours

**Description:**
Encrypt LLM API keys before storing in the database, using Fernet symmetric encryption.

**Acceptance Criteria:**
- [ ] Uses `cryptography` library's Fernet encryption
- [ ] Encryption key derived from a `ENCRYPTION_KEY` environment variable
- [ ] `encrypt_key(plain_text)` returns encrypted string
- [ ] `decrypt_key(cipher_text)` returns plain text
- [ ] API keys encrypted before database insert
- [ ] API keys decrypted only when needed for LLM calls
- [ ] API keys NEVER returned in API responses (only last 4 chars)
- [ ] Startup error if `ENCRYPTION_KEY` is not set

---

### 15.11 Build API key management UI

**Estimate:** 3 hours

**Description:**
Build the UI for managing LLM API keys with masked display and key rotation.

**Acceptance Criteria:**
- [ ] Displays stored key as masked: `sk-...abc1` (last 4 characters)
- [ ] "Show" toggle to briefly reveal the key (auto-hides after 5 seconds)
- [ ] "Add Key" form with input field
- [ ] "Remove" button with confirmation
- [ ] "Rotate" button: enter new key, old key replaced
- [ ] "Test Key" button validates the key works with the provider
- [ ] Key validation feedback: valid (green), invalid (red)

---

### 15.12 Build LLM provider selection UI

**Estimate:** 2 hours

**Description:**
Build dropdown selectors for choosing primary and secondary LLM providers.

**Acceptance Criteria:**
- [ ] Primary provider dropdown: OpenAI, Ollama
- [ ] Secondary provider dropdown: same options + "None"
- [ ] Selecting a provider shows its configuration fields
- [ ] OpenAI: requires API key, shows available models
- [ ] Ollama: requires base URL, shows available local models
- [ ] Provider status indicator: connected/disconnected
- [ ] Changes saved on selection

---

### 15.13 Build model selection per provider UI

**Estimate:** 2 hours

**Description:**
Build model selection dropdowns that show available models for each configured provider.

**Acceptance Criteria:**
- [ ] For OpenAI: dropdown listing common models (gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
- [ ] For Ollama: fetches available models from Ollama API and lists them
- [ ] Loading state while fetching models
- [ ] "Refresh" button to reload available models
- [ ] Selected model saved to configuration
- [ ] Shows model info: name, context window size
- [ ] Error state if unable to fetch models

---

### 15.14 Build system health dashboard

**Estimate:** 4 hours

**Description:**
Build the admin home page showing system health metrics and real-time statistics.

**Acceptance Criteria:**
- [ ] Metric cards: Active Sessions, Total Speakers, Total Presentations, WebSocket Connections
- [ ] Database connection status: connected/error
- [ ] LLM service status: connected/error (with last check time)
- [ ] Uptime display (time since last restart)
- [ ] Recent errors list (last 10 errors from logs)
- [ ] Auto-refreshes every 30 seconds
- [ ] Backend endpoint: GET `/api/admin/health` returns all metrics

---

### 15.15 Build active sessions list

**Estimate:** 3 hours

**Description:**
Show a list of currently active sessions with key metrics.

**Acceptance Criteria:**
- [ ] Table: Presentation Title, Speaker, Participants, Duration, Started At
- [ ] Real-time participant count updates
- [ ] Click to view session detail
- [ ] "Force End" button for emergency session termination
- [ ] Auto-refreshes every 10 seconds
- [ ] Empty state: "No active sessions"
- [ ] Backend endpoint: GET `/api/admin/sessions?status=active`

---

### 15.16 Build session detail view (admin)

**Estimate:** 3 hours

**Description:**
Show detailed information about a session for admin monitoring and management.

**Acceptance Criteria:**
- [ ] Session info: presentation title, speaker, start/end times, duration, status
- [ ] Participant list with names, join times, connection status
- [ ] Response counts per slide
- [ ] AI usage: calls made, tokens used, estimated cost
- [ ] "Force End Session" button with confirmation
- [ ] Real-time updates for active sessions
- [ ] Breadcrumb: Admin > Sessions > {title}

---

### 15.17 Build usage statistics page

**Estimate:** 4 hours

**Description:**
Build a page showing aggregated usage statistics with date filtering.

**Acceptance Criteria:**
- [ ] Sessions per day/week chart (bar chart)
- [ ] Total participants over time
- [ ] AI calls count and tokens used
- [ ] Response counts per slide type
- [ ] Date range filter: last 7 days, 30 days, custom range
- [ ] Export data as CSV
- [ ] Backend endpoint: GET `/api/admin/stats?from=date&to=date`
- [ ] Loading state while data is being fetched

---

### 15.18 Build session history with filtering

**Estimate:** 3 hours

**Description:**
Build a paginated list of all past sessions with filtering options.

**Acceptance Criteria:**
- [ ] Table: Title, Speaker, Participants, Duration, Date, Status
- [ ] Filter by speaker (dropdown)
- [ ] Filter by date range (date pickers)
- [ ] Filter by status (active, ended)
- [ ] Pagination: 20 per page
- [ ] Sortable columns
- [ ] Click row to view session detail
- [ ] Backend endpoint with filter parameters

---

## Epic 16: Plans & Subscription Structure

**Description:** Implement a plan/tier system that defines usage limits for speakers. No payment processing in MVP - plans are assigned by admins. This establishes the structure for future monetization.

**Epic Total: 22 hours**

---

### 16.1 Create Plan model in database

**Estimate:** 2 hours

**Description:**
Create the Plan database model with fields for defining usage limits and create the Alembic migration.

**Acceptance Criteria:**
- [ ] Plan model: id, name, max_sessions_per_month, max_participants_per_session, max_ai_calls_per_session, price
- [ ] Alembic migration creates the plans table
- [ ] Seed data creates default plans: Free, Pro, Enterprise
- [ ] Free: 5 sessions/month, 25 participants, 10 AI calls, price 0
- [ ] Pro: 50 sessions/month, 100 participants, 100 AI calls
- [ ] Enterprise: unlimited (null values = no limit)
- [ ] Pydantic schemas: PlanCreate, PlanResponse

---

### 16.2 Create speaker-plan association

**Estimate:** 2 hours

**Description:**
Add a plan_id foreign key to the Speaker model, defaulting to the Free plan.

**Acceptance Criteria:**
- [ ] Add `plan_id` FK column to Speaker model
- [ ] Alembic migration adds the column with default pointing to Free plan
- [ ] Existing speakers assigned to Free plan in migration
- [ ] Speaker API responses include plan info
- [ ] Plan relationship eager-loaded when fetching speaker data
- [ ] Deleting a plan prevented if speakers are assigned to it

---

### 16.3 Define plan limits schema

**Estimate:** 2 hours

**Description:**
Define the Pydantic models for plan limits and create helper functions for checking limits.

**Acceptance Criteria:**
- [ ] `PlanLimits` Pydantic model with all limit fields
- [ ] `check_session_limit(speaker)`: returns True if under monthly session limit
- [ ] `check_participant_limit(session)`: returns True if under participant limit
- [ ] `check_ai_limit(session)`: returns True if under AI call limit
- [ ] Null values in limits = unlimited (no check)
- [ ] Helper returns remaining quota alongside boolean
- [ ] Limit info included in error responses when exceeded

---

### 16.4 Create plan checking middleware

**Estimate:** 3 hours

**Description:**
Create a FastAPI dependency that checks plan limits before allowing certain operations.

**Acceptance Criteria:**
- [ ] `check_plan_limits` dependency for session creation endpoint
- [ ] Checks monthly session count against plan limit
- [ ] Returns 403 with `{error: "Plan limit exceeded", limit: "sessions", current: 5, max: 5}`
- [ ] Participant limit checked on audience join
- [ ] AI call limit checked on AI endpoints
- [ ] Bypass for enterprise/unlimited plans
- [ ] Efficient: caches current counts per request

---

### 16.5 Implement usage tracking per speaker

**Estimate:** 3 hours

**Description:**
Track monthly usage counters for each speaker to enforce plan limits.

**Acceptance Criteria:**
- [ ] Track: sessions created this month, total AI calls this month
- [ ] Counters stored in database (speaker_usage table or JSON field)
- [ ] Reset monthly (first of each month)
- [ ] Increment counters atomically on relevant actions
- [ ] Handle month boundary correctly (timezone-aware)
- [ ] Historical usage preserved for statistics

---

### 16.6 Create get current usage endpoint

**Estimate:** 2 hours

**Description:**
Create an endpoint for speakers to check their current usage against plan limits.

**Acceptance Criteria:**
- [ ] GET `/api/speakers/me/usage` returns current usage and limits
- [ ] Response: `{sessions: {used: 3, limit: 5}, ai_calls: {used: 15, limit: 50}, ...}`
- [ ] Includes plan name and all limit categories
- [ ] Requires speaker authentication
- [ ] Efficient query (single DB call or cached)
- [ ] Null limits shown as "unlimited"

---

### 16.7 Build usage display in speaker dashboard

**Estimate:** 3 hours

**Description:**
Add a usage card to the speaker dashboard showing current usage against plan limits.

**Acceptance Criteria:**
- [ ] Card showing plan name and usage bars
- [ ] Progress bar: "3/5 sessions this month" with visual fill
- [ ] Progress bar: "15/50 AI calls remaining"
- [ ] Color coding: green (<70%), yellow (70-90%), red (>90%)
- [ ] "Upgrade Plan" link for speakers on free/lower plans
- [ ] Auto-refreshes when dashboard loads
- [ ] Handles unlimited plans: shows "Unlimited" without progress bar

---

### 16.8 Create plan upgrade/downgrade endpoints

**Estimate:** 2 hours

**Description:**
Create endpoints for changing a speaker's plan (admin-only for MVP, no payment processing).

**Acceptance Criteria:**
- [ ] PATCH `/api/admin/speakers/{id}/plan` accepts `{plan_id}`
- [ ] Changes the speaker's plan immediately
- [ ] Admin-only endpoint (speaker cannot change their own plan in MVP)
- [ ] Returns updated speaker with new plan info
- [ ] Validates plan_id exists
- [ ] Logs plan changes for auditing
- [ ] Does not affect current active sessions

---

### 16.9 Build plan selection UI

**Estimate:** 3 hours

**Description:**
Build a page showing available plans with feature comparison and upgrade request.

**Acceptance Criteria:**
- [ ] Shows all plans in a comparison table or card layout
- [ ] Features listed per plan with check/cross marks
- [ ] Current plan highlighted
- [ ] "Request Upgrade" button sends a notification to admin
- [ ] No payment form (MVP - admin assigns plans manually)
- [ ] Responsive layout for mobile
- [ ] Accessible: screen reader compatible comparison

---

# Phase 6: Quality

**Description:** Implement comprehensive error handling, performance optimization, and thorough testing across backend and frontend. This phase ensures production readiness.

**Phase Total: 122 hours**

---

## Epic 17: Error Handling & Resilience

**Description:** Implement consistent error handling across the entire stack: standardized API error responses, global exception handlers, frontend error boundaries, toast notifications, WebSocket error handling, rate limiting, input sanitization, and security hardening.

**Epic Total: 30 hours**

---

### 17.1 Define API error response format

**Estimate:** 2 hours

**Description:**
Define a standard JSON error response format used consistently across all API endpoints.

**Acceptance Criteria:**
- [ ] Standard format: `{error: {code: string, message: string, details: object|null}}`
- [ ] Error codes are machine-readable strings (e.g., "VALIDATION_ERROR", "NOT_FOUND", "UNAUTHORIZED")
- [ ] Messages are human-readable descriptions
- [ ] Details field contains additional context (e.g., field-level validation errors)
- [ ] Pydantic model `ErrorResponse` defined in schemas
- [ ] All existing endpoints updated to use the standard format
- [ ] Documented in API documentation

---

### 17.2 Implement global exception handler (backend)

**Estimate:** 3 hours

**Description:**
Register FastAPI exception handlers for all exception types, ensuring no unformatted errors reach clients.

**Acceptance Criteria:**
- [ ] Handler for `HTTPException`: returns standard error format with HTTP status code
- [ ] Handler for `RequestValidationError`: returns 422 with field-level errors
- [ ] Handler for generic `Exception`: returns 500 with generic message, logs full traceback
- [ ] All handlers return the standard error response format
- [ ] Handlers registered in main.py on app startup
- [ ] Sensitive information (stack traces, DB details) never exposed to clients
- [ ] All errors logged with appropriate severity level

---

### 17.3 Implement validation error formatting

**Estimate:** 2 hours

**Description:**
Format Pydantic validation errors into a user-friendly structure with field paths and messages.

**Acceptance Criteria:**
- [ ] Validation errors formatted as array: `[{field: "email", message: "Invalid email format"}]`
- [ ] Nested field paths using dot notation: "content.options.0.text"
- [ ] Custom error messages for common validations (required, min_length, email format)
- [ ] Returns 422 Unprocessable Entity status code
- [ ] Works for both request body and query parameter validation
- [ ] Error messages are localization-ready (string constants)

---

### 17.4 Build global error boundary (frontend)

**Estimate:** 2 hours

**Description:**
Wrap the React application with an Error Boundary that catches rendering errors and displays a fallback UI.

**Acceptance Criteria:**
- [ ] Error Boundary component wraps the entire App
- [ ] Catches JavaScript errors during rendering, lifecycle methods, and constructors
- [ ] Displays fallback UI: "Something went wrong" with Oratify styling
- [ ] "Try Again" button reloads the page
- [ ] "Go to Dashboard" link for navigation
- [ ] Logs error details to console (and optionally to error tracking service)
- [ ] Does not catch errors in event handlers or async code

---

### 17.5 Build error display component

**Estimate:** 2 hours

**Description:**
Build a reusable error display component for inline and full-page error states.

**Acceptance Criteria:**
- [ ] Props: icon, title, message, retryAction, details
- [ ] Default error icon (warning triangle)
- [ ] Retry button calls the provided retryAction function
- [ ] "Show Details" expandable section for technical details
- [ ] Inline variant: small, fits within a component
- [ ] Full-page variant: centered, takes up the page
- [ ] Styled with Oratify palette (red accent for errors)

---

### 17.6 Build toast notification system

**Estimate:** 3 hours

**Description:**
Build a toast notification provider with support for success, error, info, and warning types.

**Acceptance Criteria:**
- [ ] `ToastProvider` wraps the app, manages toast state
- [ ] `useToast()` hook returns `{success, error, info, warning}` methods
- [ ] Each method accepts a message string
- [ ] Toasts appear in the top-right corner
- [ ] Auto-dismiss after 5 seconds (configurable)
- [ ] Manual dismiss via close button
- [ ] Multiple toasts stack vertically
- [ ] Color-coded by type: green (success), red (error), blue (info), yellow (warning)
- [ ] Enter/exit animations

---

### 17.7 Implement WebSocket error handling

**Estimate:** 2 hours

**Description:**
Send structured error messages via WebSocket and display them as toast notifications on the client.

**Acceptance Criteria:**
- [ ] Server sends `{type: "error", payload: {code, message}}` on WS errors
- [ ] Client error handler triggers a toast notification
- [ ] Error codes categorized: recoverable (show toast) vs fatal (show overlay)
- [ ] Fatal errors trigger connection close with appropriate close code
- [ ] Error events logged on both client and server
- [ ] Common error codes documented

---

### 17.8 Build connection lost overlay

**Estimate:** 2 hours

**Description:**
Show a semi-transparent overlay when the WebSocket connection is lost.

**Acceptance Criteria:**
- [ ] Semi-transparent dark overlay covers the content
- [ ] "Connection lost" message with a disconnected icon
- [ ] Shown when WebSocket disconnects unexpectedly
- [ ] Auto-transitions to reconnecting state
- [ ] Overlay prevents interaction with underlying UI
- [ ] Dismissed automatically on successful reconnection
- [ ] Styled with Oratify theme

---

### 17.9 Build reconnection attempt UI

**Estimate:** 2 hours

**Description:**
Show reconnection progress during automatic WebSocket reconnection attempts.

**Acceptance Criteria:**
- [ ] Shows "Reconnecting... (attempt 2/3)" with progress
- [ ] Spinner or pulse animation during reconnection
- [ ] After max attempts: "Failed to reconnect" with manual "Retry" button
- [ ] "Retry" button triggers a new reconnection attempt
- [ ] "Leave Session" button to exit cleanly
- [ ] Transitions back to normal view on successful reconnect
- [ ] Accessible: screen reader announces state changes

---

### 17.10 Implement rate limiting on API endpoints

**Estimate:** 3 hours

**Description:**
Add rate limiting to API endpoints to prevent abuse, with different limits per endpoint category.

**Acceptance Criteria:**
- [ ] General endpoints: 100 requests/minute per IP
- [ ] Auth endpoints (login, register): 10 requests/minute per IP
- [ ] AI endpoints: 20 requests/minute per IP
- [ ] Uses slowapi library or custom middleware
- [ ] Returns 429 Too Many Requests with Retry-After header
- [ ] Response body: standard error format with retry information
- [ ] Rate limit headers in responses: X-RateLimit-Limit, X-RateLimit-Remaining
- [ ] Configurable limits via environment variables

---

### 17.11 Implement input sanitization utilities

**Estimate:** 2 hours

**Description:**
Create utilities for sanitizing user input to prevent XSS and injection attacks.

**Acceptance Criteria:**
- [ ] Backend: sanitize HTML in user inputs (names, responses, questions)
- [ ] Uses `bleach` library or similar for HTML stripping
- [ ] Allows safe markdown formatting (bold, italic, lists)
- [ ] Frontend: uses DOMPurify before rendering any user-generated content
- [ ] SQL injection prevented by SQLAlchemy parameterized queries (verify no raw SQL)
- [ ] Sanitization applied at service layer, not at every endpoint

---

### 17.12 Implement XSS prevention measures

**Estimate:** 2 hours

**Description:**
Harden the application against cross-site scripting attacks.

**Acceptance Criteria:**
- [ ] Content-Security-Policy header configured on backend responses
- [ ] All user-generated content sanitized before rendering
- [ ] Audit all uses of `dangerouslySetInnerHTML` - replace with safe alternatives
- [ ] Markdown rendering uses a safe renderer (no raw HTML pass-through)
- [ ] React's built-in XSS protection (JSX auto-escaping) verified
- [ ] Test with common XSS payloads to verify protection

---

### 17.13 Configure CORS properly for production

**Estimate:** 1 hour

**Description:**
Configure CORS for production with specific allowed origins instead of wildcard.

**Acceptance Criteria:**
- [ ] `CORS_ORIGINS` environment variable: comma-separated list of allowed origins
- [ ] Production: specific origins only (no `*`)
- [ ] Development: `http://localhost:3000` and `http://localhost:5173`
- [ ] Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- [ ] Allowed headers: Content-Type, Authorization
- [ ] Credentials: true (for cookie-based auth if needed)
- [ ] Startup validation: warn if CORS_ORIGINS is wildcard in production mode

---

### 17.14 Implement request timeout handling

**Estimate:** 2 hours

**Description:**
Configure timeouts for both backend request processing and frontend API calls.

**Acceptance Criteria:**
- [ ] Backend: middleware timeout of 30 seconds for regular requests
- [ ] Backend: 60-second timeout for AI endpoints
- [ ] Frontend: Axios timeout set to 30 seconds
- [ ] Frontend: AbortController for cancelable long-running requests
- [ ] Timeout errors return 504 Gateway Timeout
- [ ] Client shows timeout-specific error message
- [ ] Configurable timeouts via environment variables

---

## Epic 18: Performance & Optimization

**Description:** Optimize database queries, implement connection pooling, add pagination, compress images, optimize frontend bundle size, implement lazy loading, and improve perceived performance with loading skeletons.

**Epic Total: 29 hours**

---

### 18.1 Optimize database queries with proper indexes

**Estimate:** 4 hours

**Description:**
Analyze query patterns and add database indexes to improve query performance.

**Acceptance Criteria:**
- [ ] Index on `sessions.join_code` for quick join code lookups
- [ ] Index on `sessions.presentation_id` for finding sessions by presentation
- [ ] Composite index on `slides(presentation_id, order_index)` for ordered slide retrieval
- [ ] Composite index on `responses(session_id, slide_id)` for response queries
- [ ] Index on `participants.session_id` for participant lookups
- [ ] Alembic migration for all new indexes
- [ ] Query analysis: EXPLAIN ANALYZE on critical queries to verify index usage

---

### 18.2 Implement database connection pooling

**Estimate:** 2 hours

**Description:**
Configure SQLAlchemy async connection pool for optimal database performance.

**Acceptance Criteria:**
- [ ] Pool size: 10 connections (configurable via `DB_POOL_SIZE`)
- [ ] Max overflow: 20 additional connections (`DB_MAX_OVERFLOW`)
- [ ] Pool timeout: 30 seconds
- [ ] Pool recycling: 1800 seconds (30 minutes)
- [ ] Pre-ping enabled for connection health checks
- [ ] Pool stats logged on startup
- [ ] Monitoring: log when pool is exhausted

---

### 18.3 Implement response pagination

**Estimate:** 3 hours

**Description:**
Add pagination to all list endpoints returning potentially large datasets.

**Acceptance Criteria:**
- [ ] Standard pagination query params: `?page=1&per_page=20`
- [ ] Response format: `{items: [], total: int, page: int, per_page: int, pages: int}`
- [ ] Default per_page: 20, maximum per_page: 100
- [ ] Applied to: responses list, presentations list, sessions list, admin lists
- [ ] Frontend pagination components: page numbers, previous/next buttons
- [ ] Efficient: uses SQL LIMIT/OFFSET (or cursor-based for high-volume)
- [ ] Total count query optimized (COUNT over index)

---

### 18.4 Implement image compression on upload

**Estimate:** 3 hours

**Description:**
Compress uploaded images to reduce storage and improve load times.

**Acceptance Criteria:**
- [ ] Uses Pillow library for image processing
- [ ] Resize images: max 1920px on longest side
- [ ] JPEG quality: 85 (configurable)
- [ ] Optional WebP conversion for better compression
- [ ] Preserve original aspect ratio
- [ ] Skip compression for images already under size threshold
- [ ] GIF files: compress but preserve animation
- [ ] Compression runs asynchronously to not block upload response

---

### 18.5 Implement image lazy loading

**Estimate:** 2 hours

**Description:**
Implement lazy loading for images to improve initial page load performance.

**Acceptance Criteria:**
- [ ] `loading="lazy"` attribute on all `<img>` tags
- [ ] IntersectionObserver for slide thumbnails in sidebar
- [ ] Placeholder skeleton shown while image loads
- [ ] Blur-up effect: low-quality placeholder replaced by full image
- [ ] Images above the fold still loaded eagerly
- [ ] Works correctly with slide navigation (preload adjacent slides)

---

### 18.6 Optimize frontend bundle with code splitting

**Estimate:** 3 hours

**Description:**
Configure Vite to split the frontend bundle for faster initial load.

**Acceptance Criteria:**
- [ ] Vendor libraries in separate chunk (react, redux, etc.)
- [ ] Route-based chunks for each major section
- [ ] Bundle analysis with vite-plugin-visualizer
- [ ] Initial load bundle under 200KB (gzipped)
- [ ] Large libraries (markdown renderer, QR code) in separate chunks
- [ ] Chunk naming: content hash for cache busting
- [ ] Tree-shaking verified: no unused code in bundles

---

### 18.7 Implement route-based lazy loading

**Estimate:** 2 hours

**Description:**
Use React.lazy() and Suspense for loading page components on demand.

**Acceptance Criteria:**
- [ ] `React.lazy()` used for: admin pages, presenter page, composer page
- [ ] `Suspense` boundary with loading spinner for each lazy route
- [ ] Preload critical routes (audience view loads eagerly for fast join)
- [ ] Loading spinner matches Oratify theme
- [ ] Error boundary catches chunk load failures with retry option
- [ ] Development mode still works without lazy loading issues

---

### 18.8 Implement WebSocket message batching

**Estimate:** 3 hours

**Description:**
Batch rapid-fire WebSocket events to reduce message frequency during high-traffic moments.

**Acceptance Criteria:**
- [ ] Batch vote_update events: collect votes over 100ms window, send one update
- [ ] Batch participant_count events: debounce to 500ms
- [ ] Individual events (slide_changed, session_ended) sent immediately
- [ ] Configurable batch window per event type
- [ ] Client-side debounce for rapid UI updates
- [ ] No data loss: all votes counted even if batched
- [ ] Reduces message count by 50%+ during high-traffic moments

---

### 18.9 Configure proper caching headers

**Estimate:** 2 hours

**Description:**
Set appropriate HTTP caching headers for different resource types.

**Acceptance Criteria:**
- [ ] Static assets (JS, CSS, images with hash): `Cache-Control: max-age=31536000, immutable`
- [ ] API responses: `Cache-Control: no-cache` for dynamic data
- [ ] Uploaded images: `Cache-Control: max-age=86400` (1 day)
- [ ] HTML index: `Cache-Control: no-cache` (always check for updates)
- [ ] ETag headers for conditional requests on API endpoints
- [ ] Verified with browser DevTools network tab

---

### 18.10 Implement frontend asset caching strategy

**Estimate:** 2 hours

**Description:**
Set up a service worker for PWA offline support and smart asset caching.

**Acceptance Criteria:**
- [ ] Service worker registered for the audience view (PWA)
- [ ] Static assets cached on install (app shell)
- [ ] Network-first strategy for API calls
- [ ] Cache-first strategy for images and fonts
- [ ] Manifest.json for PWA installability
- [ ] Offline fallback page: "You're offline. Please check your connection."
- [ ] Cache invalidation on app update

---

### 18.11 Add loading skeletons for better perceived performance

**Estimate:** 3 hours

**Description:**
Replace loading spinners with content-shaped skeleton placeholders for better perceived performance.

**Acceptance Criteria:**
- [ ] Skeleton for presentation list: card outlines with pulsing animation
- [ ] Skeleton for composer: sidebar + editor area outlines
- [ ] Skeleton for presenter view: slide area + sidebar outlines
- [ ] Skeleton for audience view: header + content area outlines
- [ ] Pulse animation (light shimmer effect)
- [ ] Skeletons match the layout dimensions of actual content
- [ ] Transitions smoothly from skeleton to real content

---

## Epic 19: Testing

**Description:** Implement comprehensive testing across the stack: backend API tests, frontend component tests, and end-to-end tests. This epic focuses on testing coverage beyond the foundational tests already written alongside features.

**Epic Total: 63 hours**

---

### 19.1 Set up Pytest with async support

**Estimate:** 2 hours

**Description:**
Configure pytest-asyncio for testing async FastAPI endpoints and services with proper database fixtures.

**Acceptance Criteria:**
- [ ] `pytest-asyncio` configured in pytest settings
- [ ] Async test fixtures for database sessions (create/teardown)
- [ ] Test database configuration (separate from development)
- [ ] `conftest.py` structure for shared fixtures
- [ ] `httpx.AsyncClient` for testing FastAPI endpoints
- [ ] Tests isolated: each test gets a clean database state

---

### 19.2 Create test database fixtures

**Estimate:** 3 hours

**Description:**
Create factory fixtures for generating test data across all models.

**Acceptance Criteria:**
- [ ] `create_speaker()` fixture: generates a speaker with unique email
- [ ] `create_presentation(speaker)` fixture: generates a presentation with slides
- [ ] `create_slide(presentation, type)` fixture: generates a slide of any type with valid content
- [ ] `create_session(presentation)` fixture: generates a session with join code
- [ ] `create_participant(session)` fixture: generates a participant
- [ ] `create_response(session, slide, participant)` fixture: generates a response
- [ ] All fixtures use factory pattern for customizable defaults
- [ ] Fixtures handle cleanup automatically

---

### 19.3 Write authentication endpoint tests

**Estimate:** 4 hours

**Description:**
Write comprehensive tests for all authentication endpoints.

**Acceptance Criteria:**
- [ ] Test register: valid registration, duplicate email (409), invalid email format, weak password
- [ ] Test login: valid credentials, wrong password (401), non-existent email (401)
- [ ] Test refresh: valid token, expired token (401), invalid token (401)
- [ ] Test me: with valid token, with expired token, without token (401)
- [ ] Test password-reset: request with valid email, non-existent email, reset with valid/invalid token
- [ ] Test token format and claims
- [ ] All tests use the async client fixture

---

### 19.4 Write presentation CRUD tests

**Estimate:** 3 hours

**Description:**
Write tests for presentation create, read, update, delete, and related operations.

**Acceptance Criteria:**
- [ ] Test create: valid creation, missing title, unauthorized
- [ ] Test read: own presentation, other's presentation (403), not found (404)
- [ ] Test update: title, description, slug, speaker notes
- [ ] Test delete: own (200), other's (403), cascades slides
- [ ] Test list: returns only own presentations, pagination, search filter
- [ ] Test duplicate: creates copy with "(Copy)" suffix, copies all slides
- [ ] Test slug: auto-generation, uniqueness, custom slug

---

### 19.5 Write slide CRUD tests

**Estimate:** 3 hours

**Description:**
Write tests for slide operations including type-specific content validation.

**Acceptance Criteria:**
- [ ] Test create: each of 5 slide types with valid content
- [ ] Test create: invalid content for each type (wrong JSONB structure)
- [ ] Test read: by ID, list for presentation (ordered)
- [ ] Test update: content update, type change
- [ ] Test delete: removes slide, reindexes remaining
- [ ] Test reorder: valid reorder, missing slide IDs, wrong presentation
- [ ] Test authorization: can only modify own presentation's slides

---

### 19.6 Write session flow tests

**Estimate:** 4 hours

**Description:**
Write tests for the complete session lifecycle and state machine.

**Acceptance Criteria:**
- [ ] Test create: generates join code, starts in "created" state
- [ ] Test start: transitions to "active", sets started_at and current_slide
- [ ] Test pause/resume: valid transitions, invalid transitions (400)
- [ ] Test end: transitions to "ended", sets ended_at
- [ ] Test invalid transitions: start an ended session (400), pause a created session (400)
- [ ] Test current-slide: update, invalid slide_id (400)
- [ ] Test stats: returns correct counts
- [ ] Test join by code: found, not found, ended session

---

### 19.7 Write response submission tests

**Estimate:** 3 hours

**Description:**
Write tests for response submission, duplicate prevention, and aggregation.

**Acceptance Criteria:**
- [ ] Test submit text response: valid, empty text, exceeds max length
- [ ] Test submit choice vote: valid option, invalid option index
- [ ] Test duplicate prevention: second submission returns 409
- [ ] Test get responses: pagination, filtering by slide
- [ ] Test vote aggregation: correct counts and percentages
- [ ] Test response with inactive/paused session (400)
- [ ] Test export: CSV format, JSON format

---

### 19.8 Write WebSocket connection tests

**Estimate:** 4 hours

**Description:**
Write tests for WebSocket connection lifecycle and message handling.

**Acceptance Criteria:**
- [ ] Test connect with valid join code
- [ ] Test connect with invalid join code (close 4004)
- [ ] Test connect with ended session (close 4003)
- [ ] Test speaker authentication via WebSocket
- [ ] Test audience join (anonymous and named)
- [ ] Test message routing: send message, verify broadcast
- [ ] Test disconnect: participant count updates
- [ ] Test heartbeat: ping-pong mechanism

---

### 19.9 Write AI integration tests (mocked)

**Estimate:** 3 hours

**Description:**
Write tests for AI endpoints with mocked LLM calls to verify logic without actual API calls.

**Acceptance Criteria:**
- [ ] Mock LiteLLM calls using pytest-mock or unittest.mock
- [ ] Test answer endpoint: question processed, response saved, WebSocket event sent
- [ ] Test summary generation: collects responses, calls LLM, stores result
- [ ] Test conclusion generation: collects notes + responses, calls LLM
- [ ] Test error handling: LLM timeout, API error, rate limit
- [ ] Test rate limiting: per-participant and per-session limits
- [ ] Test caching: second identical question returns cached answer

---

### 19.10 Set up Vitest and React Testing Library

**Estimate:** 2 hours

**Description:**
Configure the frontend testing environment (project uses Vitest, not Jest).

**Acceptance Criteria:**
- [ ] Vitest configured with jsdom environment
- [ ] React Testing Library installed and configured
- [ ] Setup file with global mocks: Redux store, React Router, WebSocket
- [ ] Mock API client for testing components that make API calls
- [ ] CSS module mocks for testing styled components
- [ ] Test runner integrated with `npm test` command
- [ ] Coverage reporting configured

---

### 19.11 Write auth component tests

**Estimate:** 3 hours

**Description:**
Write tests for authentication page components.

**Acceptance Criteria:**
- [ ] LoginPage: renders form, validates inputs, submits, handles errors, redirects on success
- [ ] RegisterPage: renders form, validates all fields, submits, handles duplicate email error
- [ ] ResetPasswordPage: renders request form, submits, shows confirmation
- [ ] ProtectedRoute: redirects to login when not authenticated
- [ ] ProtectedRoute: renders children when authenticated
- [ ] All tests mock the API client and Redux store

---

### 19.12 Write composer component tests

**Estimate:** 4 hours

**Description:**
Write tests for the composer page and its sub-components.

**Acceptance Criteria:**
- [ ] ComposerPage: loads presentation, renders sidebar + editor + properties
- [ ] SlideEditor: renders correct editor for each slide type
- [ ] Each editor type: renders fields, validates input, triggers save
- [ ] SlideThumbnail: renders preview, handles click selection
- [ ] Drag-and-drop: reorder triggers API call
- [ ] Auto-save: debounced save triggers after input changes
- [ ] Preview mode: toggles between edit and preview
- [ ] All tests mock API calls

---

### 19.13 Write presenter view component tests

**Estimate:** 3 hours

**Description:**
Write tests for the presenter view and its interactive components.

**Acceptance Criteria:**
- [ ] PresenterPage: loads session, connects WebSocket, renders layout
- [ ] Slide navigation: previous/next, boundary handling
- [ ] Session controls: start, pause, resume, end with confirmations
- [ ] Response feed: displays incoming responses, filtering works
- [ ] Keyboard shortcuts: arrow keys navigate, F toggles fullscreen
- [ ] Timer: starts on session start, pauses on session pause
- [ ] Mock WebSocket for all real-time features

---

### 19.14 Write audience view component tests

**Estimate:** 3 hours

**Description:**
Write tests for the audience view and response components.

**Acceptance Criteria:**
- [ ] AudiencePage: connects to WebSocket, renders current slide
- [ ] Text response: input, validation, submit, confirmation state
- [ ] Voting buttons: selection, submit, already-responded state
- [ ] Question FAB: opens modal, submit, AI response display
- [ ] Session ended screen: displays on session_ended event
- [ ] Slide transitions: waiting state between slides
- [ ] Mock WebSocket events for all tests

---

### 19.15 Set up Playwright for E2E testing

**Estimate:** 3 hours

**Description:**
Install and configure Playwright for end-to-end browser testing.

**Acceptance Criteria:**
- [ ] Playwright installed with Chrome and Firefox browsers
- [ ] Test configuration: base URL, timeouts, screenshots on failure
- [ ] Docker Compose setup for test environment (app + db)
- [ ] Global setup: start services, run migrations, seed data
- [ ] Global teardown: stop services, clean up
- [ ] `npm run test:e2e` command configured
- [ ] CI integration: runs E2E tests in GitHub Actions

---

### 19.16 Write E2E test for speaker registration and login

**Estimate:** 3 hours

**Description:**
End-to-end test covering the complete speaker registration and login flow.

**Acceptance Criteria:**
- [ ] Navigate to /register, fill form, submit
- [ ] Verify redirect to dashboard
- [ ] Logout, navigate to /login
- [ ] Fill login form, submit
- [ ] Verify redirect to dashboard with user name displayed
- [ ] Test invalid credentials: error message shown
- [ ] Test password reset flow (if email service mocked)

---

### 19.17 Write E2E test for presentation creation

**Estimate:** 4 hours

**Description:**
End-to-end test for creating a presentation and adding slides in the composer.

**Acceptance Criteria:**
- [ ] Login as speaker, navigate to dashboard
- [ ] Create new presentation via modal
- [ ] Add a content slide, enter text, upload image
- [ ] Add a question slide (multiple choice), enter question and options
- [ ] Reorder slides via drag-and-drop
- [ ] Verify auto-save (save indicator shows "Saved")
- [ ] Open preview mode, verify slides render
- [ ] Return to dashboard, verify presentation appears in list

---

### 19.18 Write E2E test for live session flow

**Estimate:** 5 hours

**Description:**
End-to-end test for the complete live session flow: speaker starts, audience joins, interactions happen.

**Acceptance Criteria:**
- [ ] Speaker creates a session from dashboard
- [ ] Speaker enters presenter view
- [ ] In a second browser context: audience joins via code
- [ ] Speaker starts session
- [ ] Audience sees first slide content
- [ ] Speaker navigates to next slide
- [ ] Audience view updates to show new slide
- [ ] Speaker ends session
- [ ] Audience sees session ended screen
- [ ] Handles multiple browser contexts (speaker + audience)

---

### 19.19 Write E2E test for audience join and response

**Estimate:** 4 hours

**Description:**
End-to-end test for the audience experience: join, respond to questions, ask a question.

**Acceptance Criteria:**
- [ ] Audience navigates to /join, enters session code
- [ ] Enters optional name, joins session
- [ ] Waits for session start (sees waiting screen)
- [ ] Session starts, audience sees first slide
- [ ] On question slide: submits text response, sees confirmation
- [ ] On choice slide: votes for an option, sees confirmation
- [ ] Uses FAB to ask a question
- [ ] Receives AI response (mocked)
- [ ] Session ends, sees ended screen

---

# Phase 7: Release

**Description:** Complete documentation, create production deployment configuration, and prepare for release. This phase covers all deliverables needed for a production-ready open-source release.

**Phase Total: 70 hours**

---

## Epic 20: Documentation

**Description:** Create comprehensive documentation for the API, development setup, deployment, architecture, and end-user guides. Documentation ensures the project is maintainable and accessible to contributors and operators.

**Epic Total: 32 hours**

---

### 20.1 Configure Swagger/OpenAPI documentation

**Estimate:** 2 hours

**Description:**
Enhance FastAPI's auto-generated OpenAPI documentation with descriptions, examples, and proper tagging.

**Acceptance Criteria:**
- [ ] All endpoints have descriptive summaries and descriptions
- [ ] Endpoints tagged by category: Auth, Presentations, Slides, Sessions, Responses, AI, Admin
- [ ] Request body examples for each endpoint
- [ ] Response examples for success and error cases
- [ ] Authentication scheme documented (Bearer JWT)
- [ ] Available at /docs (Swagger UI) and /redoc (ReDoc)
- [ ] OpenAPI JSON exportable at /openapi.json

---

### 20.2 Write API endpoint descriptions

**Estimate:** 4 hours

**Description:**
Add detailed docstrings to every API endpoint with parameter descriptions, response formats, and error codes.

**Acceptance Criteria:**
- [ ] Every endpoint has a docstring with: description, parameters, response format, error codes
- [ ] Auth endpoints: registration requirements, token format, refresh flow
- [ ] Presentation endpoints: ownership rules, slug behavior, duplication logic
- [ ] Slide endpoints: type-specific content schemas, ordering behavior
- [ ] Session endpoints: state machine rules, join code behavior
- [ ] Response endpoints: submission rules, aggregation format
- [ ] AI endpoints: rate limits, context handling, provider failover

---

### 20.3 Create README with project overview

**Estimate:** 2 hours

**Description:**
Write a comprehensive README.md with project overview, features, tech stack, and quick start guide.

**Acceptance Criteria:**
- [ ] Project description and value proposition
- [ ] Features list with status indicators
- [ ] Tech stack table
- [ ] Architecture overview (ASCII diagram or image)
- [ ] Quick start: Docker Compose (3 commands to running app)
- [ ] Quick start: local development setup
- [ ] Screenshots or GIFs of key screens
- [ ] Links to detailed documentation

---

### 20.4 Document development setup instructions

**Estimate:** 3 hours

**Description:**
Write step-by-step development setup guide covering all platforms and common issues.

**Acceptance Criteria:**
- [ ] Prerequisites: Docker, Node.js 20+, Python 3.11+, Git
- [ ] Clone and initial setup steps
- [ ] `.env` configuration: copy example, set required values
- [ ] Docker Compose setup: `docker-compose up` and verification
- [ ] Local backend setup: venv, pip install, uvicorn
- [ ] Local frontend setup: npm install, npm run dev
- [ ] Running migrations: alembic upgrade head
- [ ] Running tests: pytest (backend), npm test (frontend)
- [ ] Common issues and troubleshooting section
- [ ] IDE recommendations and extension list

---

### 20.5 Document environment variables

**Estimate:** 2 hours

**Description:**
Create a comprehensive reference of all environment variables used by the application.

**Acceptance Criteria:**
- [ ] Table format: Variable, Description, Required/Optional, Default, Example
- [ ] Backend variables: DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS, LOG_LEVEL, etc.
- [ ] Frontend variables: VITE_API_URL, VITE_WS_URL
- [ ] LLM variables: OPENAI_API_KEY, OLLAMA_BASE_URL, LLM_MODEL
- [ ] Database variables: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
- [ ] Security note: which variables contain secrets
- [ ] Environment-specific recommendations (dev vs staging vs prod)

---

### 20.6 Create deployment guide

**Estimate:** 4 hours

**Description:**
Write a production deployment guide covering server setup, Docker configuration, SSL, and monitoring.

**Acceptance Criteria:**
- [ ] Server requirements: CPU, RAM, disk, OS recommendations
- [ ] Docker installation and configuration
- [ ] Production Docker Compose setup
- [ ] nginx reverse proxy configuration
- [ ] SSL/TLS setup with Let's Encrypt
- [ ] Database setup and initial migration
- [ ] Environment variable configuration for production
- [ ] Health check verification
- [ ] Backup setup and schedule
- [ ] Monitoring recommendations
- [ ] Update/upgrade procedure

---

### 20.7 Document architecture decisions

**Estimate:** 3 hours

**Description:**
Write Architecture Decision Records (ADRs) explaining key technology and design choices.

**Acceptance Criteria:**
- [ ] ADR 1: Why FastAPI - async support, WebSocket built-in, auto OpenAPI
- [ ] ADR 2: Why Redux Toolkit - standardized patterns, DevTools, scalable state
- [ ] ADR 3: Why WebSockets over SSE - bidirectional communication for responses
- [ ] ADR 4: Why LiteLLM - provider-agnostic, supports OpenAI + Ollama
- [ ] ADR 5: Why JSONB for slides - flexible per-type content, simpler queries
- [ ] ADR 6: Why CSS Modules - scoped styles, no runtime cost
- [ ] ADR 7: Why PostgreSQL - JSONB support, async driver, production-ready
- [ ] Each ADR: context, decision, consequences, alternatives considered

---

### 20.8 Create contributing guidelines

**Estimate:** 2 hours

**Description:**
Write CONTRIBUTING.md with code style, branching strategy, PR process, and testing requirements.

**Acceptance Criteria:**
- [ ] Code of conduct reference
- [ ] Code style: Ruff + Black (backend), ESLint + Prettier (frontend)
- [ ] Branch naming: `feature/`, `fix/`, `docs/`
- [ ] Commit message convention: conventional commits
- [ ] Pull request process: fork, branch, changes, tests, PR
- [ ] PR template: summary, testing, screenshots, checklist
- [ ] Testing requirements: new features must include tests
- [ ] Review process: 1 approval required, CI must pass

---

### 20.9 Document WebSocket event specifications

**Estimate:** 3 hours

**Description:**
Create a complete specification of the WebSocket protocol for real-time communication.

**Acceptance Criteria:**
- [ ] Connection flow: URL, authentication, room joining
- [ ] Message envelope format: `{type, payload, timestamp}`
- [ ] All server-to-client event types with payload schemas
- [ ] All client-to-server event types with payload schemas
- [ ] Error codes and meanings
- [ ] Reconnection protocol: backoff timing, re-auth, state recovery
- [ ] Example message sequences for common flows
- [ ] Rate limiting rules for WebSocket messages

---

### 20.10 Create user guide for speakers

**Estimate:** 4 hours

**Description:**
Write an end-user guide for speakers covering all features in plain language.

**Acceptance Criteria:**
- [ ] Getting started: registration, first login
- [ ] Creating a presentation: title, description, speaker notes
- [ ] Adding slides: each type explained with use cases
- [ ] Content slides: images, text, layouts
- [ ] Question slides: text vs choice, options management
- [ ] Summary and conclusion slides: auto-generate vs manual
- [ ] Reordering and deleting slides
- [ ] Speaker notes: purpose, how AI uses them, writing tips
- [ ] Starting a live session: creating, sharing code/QR
- [ ] Presenter view: navigation, controls, response monitoring
- [ ] After the session: reviewing results

---

### 20.11 Create admin guide

**Estimate:** 3 hours

**Description:**
Write an administration guide for self-hosted deployments.

**Acceptance Criteria:**
- [ ] Admin access: creating first admin, role assignment
- [ ] User management: viewing, creating, deactivating speakers
- [ ] LLM configuration: API keys, provider selection, testing
- [ ] Model selection guidance per use case
- [ ] Session monitoring: active sessions, health indicators
- [ ] Plan management: configuring tiers and limits
- [ ] System health: interpreting /health endpoint
- [ ] Backup and restore procedures
- [ ] Troubleshooting: common issues and solutions

---

## Epic 21: Deployment & DevOps

**Description:** Create production-ready Docker configurations, configure the application server stack (Gunicorn + Uvicorn + nginx), set up SSL, implement structured logging, create database backup/restore scripts, build a CD pipeline, and establish staging and production environments.

**Epic Total: 38 hours**

---

### 21.1 Create production Dockerfile for backend

**Estimate:** 3 hours

**Description:**
Create a multi-stage Docker build for the backend that produces a minimal, secure production image.

**Acceptance Criteria:**
- [ ] Multi-stage build: build stage installs dependencies, runtime stage copies only what's needed
- [ ] Python 3.11-slim base image
- [ ] Non-root user `appuser` for running the application
- [ ] HEALTHCHECK instruction pings `/health` every 30 seconds
- [ ] Entrypoint runs Gunicorn with Uvicorn workers
- [ ] Image size under 200MB
- [ ] `.dockerignore`: tests, __pycache__, .git, venv, .env
- [ ] Builds successfully and starts the application

---

### 21.2 Create production Dockerfile for frontend

**Estimate:** 3 hours

**Description:**
Create a multi-stage Docker build that builds the Vite app and serves it via nginx.

**Acceptance Criteria:**
- [ ] Build stage: Node 18-alpine, npm install, npm run build
- [ ] Build-time args for VITE_API_URL and VITE_WS_URL
- [ ] Runtime stage: nginx-alpine, copies dist to nginx html directory
- [ ] Custom nginx.conf: SPA routing, gzip, security headers
- [ ] Non-root nginx user
- [ ] HEALTHCHECK instruction
- [ ] Image size under 50MB
- [ ] `.dockerignore`: node_modules, .git, dist

---

### 21.3 Create Docker Compose for production

**Estimate:** 3 hours

**Description:**
Create a production Docker Compose configuration with proper networking, volumes, and restart policies.

**Acceptance Criteria:**
- [ ] Services: backend, frontend, db, nginx
- [ ] `restart: unless-stopped` on all services
- [ ] Resource limits: backend 512MB/1CPU, frontend 128MB/0.5CPU, db 1GB
- [ ] Internal network for service-to-service communication
- [ ] Only nginx ports (80/443) exposed to host
- [ ] Named volumes for PostgreSQL data and uploaded images
- [ ] Environment variables from `.env` file
- [ ] `docker-compose -f docker-compose.prod.yml up -d` starts all services

---

### 21.4 Configure Gunicorn with Uvicorn workers

**Estimate:** 2 hours

**Description:**
Create Gunicorn configuration for running the FastAPI app in production.

**Acceptance Criteria:**
- [ ] `gunicorn.conf.py` configuration file
- [ ] Worker class: `uvicorn.workers.UvicornWorker`
- [ ] Worker count: `min(2 * CPU_COUNT + 1, MAX_WORKERS)` (MAX_WORKERS default 4)
- [ ] Bind: `0.0.0.0:8000`
- [ ] Request timeout: 120 seconds (for AI endpoints)
- [ ] Graceful shutdown: 30 seconds
- [ ] Access log format with timestamp, method, path, status, response time
- [ ] Error log to stderr
- [ ] Starts successfully with all workers responding

---

### 21.5 Configure nginx as reverse proxy

**Estimate:** 3 hours

**Description:**
Create nginx configuration for reverse proxying, WebSocket support, compression, and security headers.

**Acceptance Criteria:**
- [ ] Frontend static files served from `/`
- [ ] SPA routing: try_files with fallback to index.html
- [ ] API requests `/api/*` proxied to backend:8000
- [ ] WebSocket `/ws/*` proxied with Upgrade and Connection headers
- [ ] gzip enabled for text/html, text/css, application/javascript, application/json
- [ ] Security headers: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- [ ] Client max body size: 10MB
- [ ] Proxy timeouts: connect 60s, read 120s
- [ ] Static asset caching with long max-age

---

### 21.6 Set up SSL/TLS with Let's Encrypt

**Estimate:** 2 hours

**Description:**
Configure SSL certificate generation and nginx HTTPS configuration.

**Acceptance Criteria:**
- [ ] Certbot integration documented and scripted
- [ ] nginx HTTPS configuration: listen 443 ssl
- [ ] HTTP to HTTPS redirect: 301
- [ ] Modern TLS: TLS 1.2+ only, strong cipher suite
- [ ] HSTS header enabled
- [ ] OCSP stapling enabled
- [ ] Auto-renewal via cron: `certbot renew --quiet`
- [ ] Post-renewal nginx reload hook
- [ ] Docker volume for certificates

---

### 21.7 Configure logging for production

**Estimate:** 2 hours

**Description:**
Implement structured JSON logging for production with request correlation.

**Acceptance Criteria:**
- [ ] `python-json-logger` for structured JSON log output
- [ ] Log fields: timestamp, level, logger, message, request_id, module, function
- [ ] Request ID generated per request via middleware
- [ ] Request ID in X-Request-ID response header
- [ ] Log levels: DEBUG (dev), INFO (prod), configurable via LOG_LEVEL
- [ ] Access logs: method, path, status, duration, client IP
- [ ] Exception logs: full stack trace in structured format
- [ ] Sensitive data never logged

---

### 21.8 Set up log aggregation

**Estimate:** 3 hours

**Description:**
Configure Docker log drivers and document log aggregation setup.

**Acceptance Criteria:**
- [ ] Docker log driver: json-file with `max-size: 10m`, `max-file: 5`
- [ ] Log rotation verified
- [ ] ELK stack integration documented
- [ ] Grafana Loki integration documented as lightweight alternative
- [ ] Sample Filebeat/Promtail configuration included
- [ ] Retention policy: 30 days production, 7 days staging
- [ ] Health check logs filtered from aggregation
- [ ] Log aggregation marked as optional in deployment guide

---

### 21.9 Create database backup script

**Estimate:** 2 hours

**Description:**
Create a shell script for PostgreSQL database backups with compression and retention.

**Acceptance Criteria:**
- [ ] `scripts/backup-db.sh` script
- [ ] Uses pg_dump in custom format (compressed)
- [ ] Timestamped filenames: `oratify_backup_YYYYMMDD_HHMMSS.dump`
- [ ] Configurable backup directory
- [ ] Retention: keeps last N backups (default 7), deletes older
- [ ] Output: file path, size, retention count
- [ ] Exit code 0 on success, non-zero on failure
- [ ] Optional S3/remote upload
- [ ] Cron job example provided

---

### 21.10 Create database restore script

**Estimate:** 2 hours

**Description:**
Create a shell script for restoring PostgreSQL from a backup with safety checks.

**Acceptance Criteria:**
- [ ] `scripts/restore-db.sh` script
- [ ] Accepts backup file path as argument
- [ ] Lists available backups if no argument
- [ ] Confirmation prompt: "Type 'RESTORE' to confirm"
- [ ] Creates pre-restore backup automatically
- [ ] Uses pg_restore with --clean flag
- [ ] Verifies integrity: counts key tables after restore
- [ ] Reports: tables restored, row counts, duration
- [ ] Exit code 0 on success

---

### 21.11 Document manual deployment process

**Estimate:** 3 hours

**Description:**
Write step-by-step manual deployment guide for fresh server deployment.

**Acceptance Criteria:**
- [ ] Server provisioning: Ubuntu 22.04 LTS, minimum specs
- [ ] Prerequisites: Docker, Docker Compose, Git, Certbot
- [ ] Firewall: allow 80, 443, 22
- [ ] Clone repository to recommended directory
- [ ] Environment configuration: .env setup, JWT secret generation
- [ ] Build and start: docker-compose -f docker-compose.prod.yml up -d --build
- [ ] Database migrations: docker exec ... alembic upgrade head
- [ ] SSL setup: Certbot instructions
- [ ] DNS configuration
- [ ] Verification: health check, login test
- [ ] Cron jobs: backup, SSL renewal

---

### 21.12 Create GitHub Actions CD pipeline

**Estimate:** 4 hours

**Description:**
Build a continuous deployment pipeline that builds, tests, pushes images, and deploys to staging.

**Acceptance Criteria:**
- [ ] `.github/workflows/cd.yml` triggered on push to main
- [ ] Job 1: Build backend and frontend Docker images
- [ ] Job 2: Run tests (pytest + vitest) using built images
- [ ] Job 3: Push images to GitHub Container Registry on test success
- [ ] Job 4: Deploy to staging via SSH
- [ ] Manual trigger (workflow_dispatch) for production deployment
- [ ] Deployment notifications (GitHub status, optional webhook)
- [ ] Rollback documented: re-deploy previous image tag
- [ ] Pipeline completes in under 10 minutes
- [ ] Secrets: SSH keys, registry tokens via GitHub Actions secrets

---

### 21.13 Set up staging environment

**Estimate:** 4 hours

**Description:**
Create a staging environment that mirrors production for pre-release testing.

**Acceptance Criteria:**
- [ ] `docker-compose.staging.yml` configuration
- [ ] Separate database from production
- [ ] Staging-specific .env: DEBUG=false, staging CORS, staging URLs
- [ ] Accessible at staging URL
- [ ] Seeded with test data
- [ ] LLM: test API key or mock mode
- [ ] Auto-deploys on push to main via CD pipeline
- [ ] Own SSL certificate
- [ ] Data resettable independently
- [ ] Access restricted via HTTP basic auth or IP allowlist

---

### 21.14 Configure environment-specific settings

**Estimate:** 2 hours

**Description:**
Refactor backend configuration to support development, staging, and production environments with appropriate defaults.

**Acceptance Criteria:**
- [ ] Base `Settings` class with environment-specific subclasses
- [ ] `ENV` variable selects config: development (default), staging, production
- [ ] Development: DEBUG=True, LOG_LEVEL=DEBUG, CORS_ORIGINS=*, DB_POOL_SIZE=5
- [ ] Staging: DEBUG=False, LOG_LEVEL=INFO, explicit CORS_ORIGINS, DB_POOL_SIZE=10
- [ ] Production: DEBUG=False, LOG_LEVEL=WARNING, explicit CORS_ORIGINS, pool size 10, overflow 20
- [ ] Production errors: startup fails if JWT_SECRET_KEY is default or CORS_ORIGINS is `*`
- [ ] `get_settings()` factory function
- [ ] Startup log: "Starting Oratify API in [production] mode"

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

