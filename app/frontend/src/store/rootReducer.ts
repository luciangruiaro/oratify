/**
 * Root Reducer
 *
 * Combines all feature slices into the root reducer.
 * Each slice manages a specific domain of state:
 * - auth: Authentication state (user, tokens)
 * - presentations: Presentation list and current (future)
 * - slides: Slides for active presentation (future)
 * - session: Live session state (future)
 * - ui: UI state (modals, toasts, etc.) (future)
 */

import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  // Future slices:
  // presentations: presentationsReducer,
  // slides: slidesReducer,
  // session: sessionReducer,
  // ui: uiReducer,
})
