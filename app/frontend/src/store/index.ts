/**
 * Redux Store Configuration
 *
 * This file configures the Redux store with:
 * - Root reducer combining all feature slices
 * - Redux DevTools integration for development
 * - TypeScript type exports for typed hooks
 *
 * Usage:
 *   import { store } from '@/store'
 *   import { useAppDispatch, useAppSelector } from '@/store'
 */

import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (WebSocket, etc.)
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

// Infer types from store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
