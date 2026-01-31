/**
 * Authentication API functions.
 *
 * Provides typed functions for all auth endpoints:
 * - register: Create new speaker account
 * - login: Authenticate and get tokens
 * - refreshToken: Get new access token
 * - getMe: Get current speaker profile
 * - requestPasswordReset: Request reset email
 * - confirmPasswordReset: Complete password reset
 */

import { apiClient, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './client'

// Types
export interface Speaker {
  id: string
  email: string
  name: string
  plan_type: string
  is_active: boolean
  created_at: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface SpeakerWithTokens {
  speaker: Speaker
  access_token: string
  refresh_token: string
  token_type: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordResetConfirmData {
  token: string
  new_password: string
}

export interface MessageResponse {
  message: string
}

/**
 * Register a new speaker account.
 */
export async function register(data: RegisterData): Promise<SpeakerWithTokens> {
  const response = await apiClient.post<SpeakerWithTokens>(
    '/api/auth/register',
    data
  )

  // Store tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)

  return response.data
}

/**
 * Login with email and password.
 */
export async function login(data: LoginData): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/auth/login', data)

  // Store tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)

  return response.data
}

/**
 * Refresh access token using refresh token.
 */
export async function refreshToken(
  refresh_token: string
): Promise<TokenResponse> {
  const response = await apiClient.post<TokenResponse>('/api/auth/refresh', {
    refresh_token,
  })

  // Store new tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token)

  return response.data
}

/**
 * Get current speaker profile.
 */
export async function getMe(): Promise<Speaker> {
  const response = await apiClient.get<Speaker>('/api/auth/me')
  return response.data
}

/**
 * Request password reset email.
 */
export async function requestPasswordReset(
  data: PasswordResetData
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/password-reset',
    data
  )
  return response.data
}

/**
 * Confirm password reset with token.
 */
export async function confirmPasswordReset(
  data: PasswordResetConfirmData
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    '/api/auth/password-reset/confirm',
    data
  )
  return response.data
}

/**
 * Logout - clear tokens from storage.
 */
export function logout(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Check if user has stored tokens (may be expired).
 */
export function hasStoredTokens(): boolean {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY)
}
