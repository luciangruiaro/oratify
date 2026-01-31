# Oratify Frontend

React-based frontend for the Oratify platform providing the speaker dashboard, presentation composer, presenter view, and audience participation interface.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI framework |
| Vite | 5.0+ | Build tool & dev server |
| TypeScript | 5.3+ | Type safety |
| Redux Toolkit | 2.0+ | State management |
| React Router | 6.21+ | Routing |
| Axios | 1.6+ | HTTP client |
| Vitest | 1.2+ | Testing |

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx                 # Application entry point
│   │                            # - Renders root component
│   │                            # - Wraps with Redux Provider
│   │                            # - Imports global styles
│   │
│   ├── App.tsx                  # Root component
│   │                            # - BrowserRouter setup
│   │                            # - Route definitions
│   │                            # - Layout structure
│   │
│   ├── api/                     # API layer
│   │   ├── client.ts            # Axios instance with interceptors
│   │   ├── auth.ts              # Auth API calls
│   │   ├── presentations.ts     # Presentation API calls
│   │   ├── sessions.ts          # Session API calls
│   │   └── websocket.ts         # WebSocket client
│   │
│   ├── components/              # Shared components
│   │   ├── common/              # Generic UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   └── Loading/
│   │   ├── layout/              # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   └── PageContainer/
│   │   ├── charts/              # Data visualization
│   │   │   ├── BarChart/
│   │   │   └── WordCloud/
│   │   └── slides/              # Slide renderers
│   │       ├── ContentSlide/
│   │       ├── QuestionSlide/
│   │       ├── SummarySlide/
│   │       └── ConclusionSlide/
│   │
│   ├── features/                # Feature-based modules
│   │   ├── auth/                # Authentication feature
│   │   │   ├── components/      # Auth-specific components
│   │   │   ├── hooks/           # Auth hooks
│   │   │   └── authSlice.ts     # Auth Redux slice
│   │   ├── composer/            # Presentation composer
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── slidesSlice.ts
│   │   ├── presenter/           # Presenter view
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   ├── audience/            # Audience view
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── admin/               # Admin dashboard
│   │       ├── components/
│   │       └── hooks/
│   │
│   ├── hooks/                   # Shared custom hooks
│   │   ├── redux.ts             # Typed useDispatch, useSelector
│   │   ├── useAuth.ts           # Authentication hook
│   │   ├── useWebSocket.ts      # WebSocket connection hook
│   │   └── useDebounce.ts       # Debounce utility hook
│   │
│   ├── pages/                   # Page components (routes)
│   │   ├── public/
│   │   │   ├── JoinPage.tsx     # /join, /join/:code
│   │   │   └── NotFoundPage.tsx # 404
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx    # /login
│   │   │   ├── RegisterPage.tsx # /register
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── speaker/
│   │   │   ├── DashboardPage.tsx    # /dashboard
│   │   │   ├── ComposerPage.tsx     # /presentations/:id/edit
│   │   │   ├── PresenterPage.tsx    # /presentations/:id/present
│   │   │   └── SettingsPage.tsx     # /settings
│   │   ├── audience/
│   │   │   ├── AudienceViewPage.tsx # /session/:id
│   │   │   └── SessionEndedPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx   # /admin
│   │       ├── SpeakersPage.tsx     # /admin/speakers
│   │       └── LLMConfigPage.tsx    # /admin/llm
│   │
│   ├── store/                   # Redux store
│   │   ├── index.ts             # Store configuration
│   │   │                        # - configureStore setup
│   │   │                        # - Type exports (RootState, AppDispatch)
│   │   └── rootReducer.ts       # Combined reducers
│   │
│   ├── styles/                  # Global styles
│   │   └── global.css           # CSS variables, reset, utilities
│   │                            # - Color palette
│   │                            # - Typography
│   │                            # - Spacing scale
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── api.ts               # API response types
│   │   ├── presentation.ts      # Presentation types
│   │   ├── session.ts           # Session types
│   │   └── websocket.ts         # WebSocket message types
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format.ts            # Date, number formatting
│   │   ├── validation.ts        # Form validation
│   │   └── qrcode.ts            # QR code generation
│   │
│   └── vite-env.d.ts            # Vite environment types
│
├── public/                      # Static assets
│   └── vite.svg
│
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
├── tsconfig.node.json           # Node TypeScript config
├── vite.config.ts               # Vite configuration
│                                # - React plugin
│                                # - Path aliases (@/)
│                                # - Dev server proxy
├── .eslintrc.cjs                # ESLint config
├── .prettierrc                  # Prettier config
├── Dockerfile.dev               # Development container
├── architecture.mmd             # Frontend architecture diagram
└── README.md
```

## Routes

| Path | Page | Access | Description |
|------|------|--------|-------------|
| `/` | - | Public | Redirect to /dashboard or /login |
| `/login` | LoginPage | Public | Speaker login |
| `/register` | RegisterPage | Public | Speaker registration |
| `/reset-password` | ResetPasswordPage | Public | Password reset |
| `/join` | JoinPage | Public | Enter session code |
| `/join/:code` | JoinPage | Public | Direct join with code |
| `/s/:slug` | JoinPage | Public | Join via presentation slug |
| `/dashboard` | DashboardPage | Speaker | Presentations list |
| `/presentations/:id/edit` | ComposerPage | Speaker | Edit presentation |
| `/presentations/:id/present` | PresenterPage | Speaker | Present live |
| `/settings` | SettingsPage | Speaker | Account settings |
| `/session/:id` | AudienceViewPage | Public | Audience participation |
| `/admin` | AdminDashboard | Admin | Admin home |
| `/admin/speakers` | SpeakersPage | Admin | Manage speakers |
| `/admin/llm` | LLMConfigPage | Admin | LLM settings |

## State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: Speaker | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
  },
  presentations: {
    items: Presentation[],
    current: Presentation | null,
    isLoading: boolean
  },
  slides: {
    items: Slide[],
    currentId: string | null,
    isDirty: boolean
  },
  session: {
    active: Session | null,
    participants: Participant[],
    currentSlideId: string | null
  },
  responses: {
    items: Response[],
    aggregated: AggregatedVotes
  },
  ui: {
    toast: ToastMessage | null,
    modal: ModalState,
    sidebarOpen: boolean
  }
}
```

### Typed Hooks

```typescript
// src/hooks/redux.ts
import { useAppDispatch, useAppSelector } from '@/hooks/redux'

// Usage
const dispatch = useAppDispatch()
const user = useAppSelector(state => state.auth.user)
```

## Styling

### Color Palette

```css
:root {
  /* Primary */
  --color-dark: #2c2d2f;      /* Backgrounds */
  --color-cyan: #0de7e7;      /* Primary accent */
  --color-red: #c73a52;       /* Secondary accent */
  --color-light: #eeeeee;     /* Text, light backgrounds */

  /* Secondary */
  --color-teal: #1cb9c8;
  --color-navy: #001240;
  --color-coral: #ed6a5a;
  --color-charcoal: #292f36;
  --color-gold: #e4c02e;
}
```

### Spacing Scale

```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
}
```

## Environment Variables

Frontend uses `VITE_` prefixed variables accessible via `import.meta.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:8000` |
| `VITE_APP_NAME` | Application name | `Oratify` |

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Open http://localhost:3000
```

### Available Scripts

```bash
npm run dev          # Start Vite dev server with HMR
npm run build        # TypeScript check + production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format with Prettier
npm run format:check # Check Prettier formatting
npm run test         # Run Vitest tests
npm run test:coverage # Run tests with coverage
```

### Docker

```bash
# From project root
docker-compose up frontend

# Or standalone
docker build -f Dockerfile.dev -t oratify-frontend .
docker run -p 3000:3000 oratify-frontend
```

### Code Quality

```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npx tsc --noEmit
```

## Component Guidelines

### Naming Conventions

- Components: PascalCase (`SlideEditor.tsx`)
- Hooks: camelCase with `use` prefix (`usePresentation.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: PascalCase (`PresentationType.ts`)

### Component Structure

```
ComponentName/
├── index.ts              # Re-export
├── ComponentName.tsx     # Component implementation
├── ComponentName.module.css  # Styles (CSS Modules)
├── ComponentName.test.tsx    # Tests
└── types.ts              # Component-specific types
```

### Example Component

```tsx
// src/components/Button/Button.tsx
import styles from './Button.module.css'
import type { ButtonProps } from './types'

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
```

## Testing

```bash
# Run all tests
npm test

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test:coverage

# Run specific file
npm test -- Button.test.tsx
```

### Test Structure

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```
