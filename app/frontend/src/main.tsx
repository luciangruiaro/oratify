/**
 * Application Entry Point
 *
 * This file bootstraps the React application by:
 * 1. Rendering the root App component
 * 2. Wrapping with Redux Provider for state management
 * 3. Setting up React StrictMode for development checks
 *
 * To start development server: npm run dev
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import App from './App'
import '@/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
