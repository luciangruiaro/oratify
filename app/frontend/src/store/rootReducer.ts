/**
 * Root Reducer
 *
 * Combines all feature slices into the root reducer.
 * Each slice manages a specific domain of state:
 * - auth: Authentication state (user, tokens)
 * - presentations: Presentation list and current
 * - slides: Slides for active presentation
 * - session: Live session state
 * - ui: UI state (modals, toasts, etc.)
 *
 * Slices will be added as features are implemented.
 */

import { combineReducers } from '@reduxjs/toolkit'

// Placeholder reducer until slices are created
const placeholderReducer = (state = {}) => state

export const rootReducer = combineReducers({
  // Will be replaced with actual slices:
  // auth: authReducer,
  // presentations: presentationsReducer,
  // slides: slidesReducer,
  // session: sessionReducer,
  // ui: uiReducer,
  _placeholder: placeholderReducer,
})
