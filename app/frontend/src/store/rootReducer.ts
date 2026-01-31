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
import presentationsReducer from '@/features/presentations/presentationsSlice'
import slidesReducer from '@/features/slides/slidesSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  presentations: presentationsReducer,
  slides: slidesReducer,
  // Future slices:
  // session: sessionReducer,
  // ui: uiReducer,
})
