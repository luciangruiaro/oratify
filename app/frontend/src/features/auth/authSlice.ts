/**
 * Redux slice for authentication state.
 *
 * Manages:
 * - Current user state
 * - Authentication status
 * - Loading and error states
 * - Login, register, and logout actions
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  Speaker,
  LoginData,
  RegisterData,
  login as apiLogin,
  register as apiRegister,
  getMe as apiGetMe,
  logout as apiLogout,
  hasStoredTokens,
} from '@/api/auth'

interface AuthState {
  user: Speaker | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
}

/**
 * Initialize auth state by checking for existing tokens and fetching user.
 */
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    if (!hasStoredTokens()) {
      return null
    }

    try {
      const user = await apiGetMe()
      return user
    } catch {
      // Token invalid or expired, will be handled by interceptor
      return null
    }
  }
)

/**
 * Login with email and password.
 */
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      await apiLogin(data)
      const user = await apiGetMe()
      return user
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(
        err.response?.data?.detail || 'Login failed'
      )
    }
  }
)

/**
 * Register new speaker account.
 */
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const result = await apiRegister(data)
      return result.speaker
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(
        err.response?.data?.detail || 'Registration failed'
      )
    }
  }
)

/**
 * Logout and clear auth state.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  apiLogout()
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<Speaker | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = !!action.payload
        state.isLoading = false
        state.isInitialized = true
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.isLoading = false
        state.isInitialized = true
      })

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isLoading = false
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.isLoading = false
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error
export const selectIsInitialized = (state: { auth: AuthState }) =>
  state.auth.isInitialized
