# Oratify Frontend

React-based frontend for Oratify platform.

## Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client and services
│   ├── components/             # Shared components
│   │   ├── common/             # Generic UI components
│   │   ├── layout/             # Layout components
│   │   ├── charts/             # Data visualization
│   │   └── slides/             # Slide renderers
│   ├── features/               # Feature-based modules
│   │   ├── auth/
│   │   ├── composer/
│   │   ├── presenter/
│   │   ├── audience/
│   │   └── admin/
│   ├── hooks/                  # Shared custom hooks
│   ├── pages/                  # Page components
│   ├── store/                  # Redux store config
│   ├── styles/                 # Global styles
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Color Palette

```css
:root {
  --color-dark: #2c2d2f;
  --color-cyan: #0de7e7;
  --color-red: #c73a52;
  --color-light: #eeeeee;
}
```

## Environment Variables

Create `.env` from `.env.example` in project root. Frontend uses `VITE_` prefixed variables.
