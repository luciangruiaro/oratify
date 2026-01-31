/**
 * Custom hook for authentication.
 *
 * Provides a convenient interface to auth state and actions.
 *
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth()
 */

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './redux'
import {
  initializeAuth,
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  clearError,
  selectAuth,
} from '@/features/auth/authSlice'
import { LoginData, RegisterData } from '@/api/auth'

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)

  // Initialize auth on mount
  useEffect(() => {
    if (!auth.isInitialized) {
      dispatch(initializeAuth())
    }
  }, [dispatch, auth.isInitialized])

  // Listen for forced logout events (from token refresh failure)
  useEffect(() => {
    const handleLogout = () => {
      dispatch(logoutAction())
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [dispatch])

  const login = useCallback(
    async (data: LoginData) => {
      const result = await dispatch(loginAction(data))
      if (loginAction.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerAction(data))
      if (registerAction.rejected.match(result)) {
        throw new Error(result.payload as string)
      }
      return result.payload
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    dispatch(logoutAction())
  }, [dispatch])

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const doInitializeAuth = useCallback(() => {
    if (!auth.isInitialized) {
      dispatch(initializeAuth())
    }
  }, [dispatch, auth.isInitialized])

  return {
    speaker: auth.user,
    user: auth.user, // Alias for backwards compatibility
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitialized: auth.isInitialized,
    error: auth.error,
    initializeAuth: doInitializeAuth,
    login,
    register,
    logout,
    resetError,
  }
}

export default useAuth
