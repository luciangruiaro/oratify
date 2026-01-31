/**
 * Tests for authSlice Redux reducer.
 *
 * Tests:
 * - Initial state
 * - Sync actions (clearError, setUser)
 * - Selectors
 */

import { describe, it, expect } from 'vitest'
import authReducer, {
  clearError,
  setUser,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectIsInitialized,
} from './authSlice'
import type { Speaker } from '@/api/auth'

// Mock speaker data
const mockSpeaker: Speaker = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  plan_type: 'free',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
}

describe('authSlice', () => {
  describe('initial state', () => {
    it('returns the initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' })

      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.isInitialized).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('clearError', () => {
    it('clears the error', () => {
      const stateWithError = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: 'Login failed',
      }

      const state = authReducer(stateWithError, clearError())

      expect(state.error).toBeNull()
    })
  })

  describe('setUser', () => {
    it('sets the user and marks as authenticated', () => {
      const state = authReducer(undefined, setUser(mockSpeaker))

      expect(state.user).toEqual(mockSpeaker)
      expect(state.isAuthenticated).toBe(true)
    })

    it('clears user when set to null', () => {
      const stateWithUser = {
        user: mockSpeaker,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      }

      const state = authReducer(stateWithUser, setUser(null))

      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })
})

describe('authSlice selectors', () => {
  const mockState = {
    auth: {
      user: mockSpeaker,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
      error: null,
    },
  }

  describe('selectUser', () => {
    it('returns the current user', () => {
      expect(selectUser(mockState)).toEqual(mockSpeaker)
    })

    it('returns null when no user', () => {
      const noUserState = {
        auth: { ...mockState.auth, user: null },
      }
      expect(selectUser(noUserState)).toBeNull()
    })
  })

  describe('selectIsAuthenticated', () => {
    it('returns true when authenticated', () => {
      expect(selectIsAuthenticated(mockState)).toBe(true)
    })

    it('returns false when not authenticated', () => {
      const notAuthState = {
        auth: { ...mockState.auth, isAuthenticated: false },
      }
      expect(selectIsAuthenticated(notAuthState)).toBe(false)
    })
  })

  describe('selectIsLoading', () => {
    it('returns the loading state', () => {
      expect(selectIsLoading(mockState)).toBe(false)

      const loadingState = {
        auth: { ...mockState.auth, isLoading: true },
      }
      expect(selectIsLoading(loadingState)).toBe(true)
    })
  })

  describe('selectAuthError', () => {
    it('returns null when no error', () => {
      expect(selectAuthError(mockState)).toBeNull()
    })

    it('returns error message when present', () => {
      const errorState = {
        auth: { ...mockState.auth, error: 'Invalid credentials' },
      }
      expect(selectAuthError(errorState)).toBe('Invalid credentials')
    })
  })

  describe('selectIsInitialized', () => {
    it('returns the initialized state', () => {
      expect(selectIsInitialized(mockState)).toBe(true)

      const notInitState = {
        auth: { ...mockState.auth, isInitialized: false },
      }
      expect(selectIsInitialized(notInitState)).toBe(false)
    })
  })
})
