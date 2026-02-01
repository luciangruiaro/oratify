/**
 * Sessions API Functions
 *
 * Public API functions for audience join flow:
 * - Get session by join code
 * - Get session by presentation slug
 */

import { apiClient } from './client'

export type SessionStatus = 'pending' | 'active' | 'paused' | 'ended'

export interface SessionJoinInfo {
  join_code: string
  presentation_title: string
  status: SessionStatus
  current_slide_order: number | null
}

/**
 * Get session by join code (public endpoint).
 * Returns session info for audience joining.
 */
export async function getSessionByCode(code: string): Promise<SessionJoinInfo> {
  const response = await apiClient.get<SessionJoinInfo>(
    `/api/sessions/code/${code.toUpperCase()}`
  )
  return response.data
}

/**
 * Get session by presentation slug (public endpoint).
 * Returns the active session for a presentation, if any.
 */
export async function getSessionBySlug(slug: string): Promise<SessionJoinInfo> {
  const response = await apiClient.get<SessionJoinInfo>(
    `/api/sessions/slug/${slug}`
  )
  return response.data
}
