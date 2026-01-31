/**
 * Presentations API Functions
 *
 * CRUD operations for presentations:
 * - List with pagination, search, filtering
 * - Create, read, update, delete
 * - Duplicate presentation
 */

import { apiClient } from './client'

// Types
export type PresentationStatus = 'draft' | 'active' | 'archived'

export interface Presentation {
  id: string
  speaker_id: string
  title: string
  description: string | null
  speaker_notes: string | null
  slug: string
  status: PresentationStatus
  slide_count: number
  created_at: string
  updated_at: string
}

export interface PresentationListResponse {
  items: Presentation[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface CreatePresentationData {
  title: string
  description?: string
  speaker_notes?: string
}

export interface UpdatePresentationData {
  title?: string
  description?: string
  speaker_notes?: string
  status?: PresentationStatus
}

export interface ListPresentationsParams {
  page?: number
  page_size?: number
  search?: string
  status?: PresentationStatus
}

/**
 * List presentations with pagination and filtering.
 */
export async function listPresentations(
  params: ListPresentationsParams = {}
): Promise<PresentationListResponse> {
  const { page = 1, page_size = 20, search, status } = params
  const queryParams = new URLSearchParams()

  queryParams.set('page', page.toString())
  queryParams.set('page_size', page_size.toString())

  if (search) {
    queryParams.set('search', search)
  }

  if (status) {
    queryParams.set('status', status)
  }

  const response = await apiClient.get<PresentationListResponse>(
    `/api/presentations?${queryParams.toString()}`
  )
  return response.data
}

/**
 * Get a single presentation by ID.
 */
export async function getPresentation(id: string): Promise<Presentation> {
  const response = await apiClient.get<Presentation>(`/api/presentations/${id}`)
  return response.data
}

/**
 * Get a presentation by its slug (public).
 */
export async function getPresentationBySlug(slug: string): Promise<Presentation> {
  const response = await apiClient.get<Presentation>(
    `/api/presentations/slug/${slug}`
  )
  return response.data
}

/**
 * Create a new presentation.
 */
export async function createPresentation(
  data: CreatePresentationData
): Promise<Presentation> {
  const response = await apiClient.post<Presentation>('/api/presentations', data)
  return response.data
}

/**
 * Update a presentation.
 */
export async function updatePresentation(
  id: string,
  data: UpdatePresentationData
): Promise<Presentation> {
  const response = await apiClient.put<Presentation>(
    `/api/presentations/${id}`,
    data
  )
  return response.data
}

/**
 * Delete a presentation.
 */
export async function deletePresentation(id: string): Promise<void> {
  await apiClient.delete(`/api/presentations/${id}`)
}

/**
 * Duplicate a presentation.
 */
export async function duplicatePresentation(
  id: string,
  newTitle?: string
): Promise<Presentation> {
  const response = await apiClient.post<Presentation>(
    `/api/presentations/${id}/duplicate`,
    newTitle ? { new_title: newTitle } : {}
  )
  return response.data
}
