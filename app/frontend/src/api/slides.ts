/**
 * Slides API Functions
 *
 * CRUD operations for slides:
 * - List slides for a presentation
 * - Create, read, update, delete slides
 * - Reorder slides
 * - Duplicate slides
 */

import { apiClient } from './client'

// ============================================================================
// Types
// ============================================================================

export type SlideType =
  | 'content'
  | 'question_text'
  | 'question_choice'
  | 'summary'
  | 'conclusion'

export type LayoutType = 'image-left' | 'image-right' | 'image-top' | 'text-only'

// Content types for each slide type
export interface ContentSlideContent {
  image_url?: string | null
  text: string
  layout: LayoutType
}

export interface QuestionTextContent {
  question: string
  placeholder?: string | null
  max_length?: number | null
  required: boolean
}

export interface ChoiceOption {
  id: string
  text: string
  order: number
}

export interface QuestionChoiceContent {
  question: string
  options: ChoiceOption[]
  allow_multiple: boolean
  show_results: boolean
}

export interface SummaryContent {
  title: string
  summary_text?: string | null
  auto_generate: boolean
  include_slides: string[] | 'all'
}

export interface ConclusionContent {
  title: string
  conclusions: string[]
  auto_generate: boolean
  thank_you_message?: string | null
}

export type SlideContent =
  | ContentSlideContent
  | QuestionTextContent
  | QuestionChoiceContent
  | SummaryContent
  | ConclusionContent

// Slide interfaces
export interface Slide {
  id: string
  presentation_id: string
  order_index: number
  type: SlideType
  content: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SlideListResponse {
  items: Slide[]
  total: number
}

export interface CreateSlideData {
  type: SlideType
  content?: Record<string, unknown>
  order_index?: number
}

export interface UpdateSlideData {
  type?: SlideType
  content?: Record<string, unknown>
  order_index?: number
}

export interface ReorderSlidesData {
  slide_ids: string[]
}

export interface ReorderSlidesResponse {
  reordered: number
  slides: Slide[]
}

// ============================================================================
// Default Content
// ============================================================================

export function getDefaultContent(slideType: SlideType): Record<string, unknown> {
  switch (slideType) {
    case 'content':
      return {
        image_url: null,
        text: '',
        layout: 'text-only',
      }
    case 'question_text':
      return {
        question: 'Enter your question here',
        placeholder: null,
        max_length: 500,
        required: false,
      }
    case 'question_choice':
      return {
        question: 'Enter your question here',
        options: [
          { id: 'opt1', text: 'Option 1', order: 0 },
          { id: 'opt2', text: 'Option 2', order: 1 },
        ],
        allow_multiple: false,
        show_results: true,
      }
    case 'summary':
      return {
        title: 'Summary',
        summary_text: null,
        auto_generate: true,
        include_slides: 'all',
      }
    case 'conclusion':
      return {
        title: 'Key Takeaways',
        conclusions: [],
        auto_generate: false,
        thank_you_message: null,
      }
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * List all slides for a presentation.
 */
export async function listSlides(presentationId: string): Promise<SlideListResponse> {
  const response = await apiClient.get<SlideListResponse>(
    `/api/presentations/${presentationId}/slides`
  )
  return response.data
}

/**
 * Get a single slide by ID.
 */
export async function getSlide(slideId: string): Promise<Slide> {
  const response = await apiClient.get<Slide>(`/api/slides/${slideId}`)
  return response.data
}

/**
 * Create a new slide at the end of the presentation.
 */
export async function createSlide(
  presentationId: string,
  data: CreateSlideData
): Promise<Slide> {
  const response = await apiClient.post<Slide>(
    `/api/presentations/${presentationId}/slides`,
    data
  )
  return response.data
}

/**
 * Insert a slide at a specific position.
 */
export async function insertSlide(
  presentationId: string,
  position: number,
  data: CreateSlideData
): Promise<Slide> {
  const response = await apiClient.post<Slide>(
    `/api/presentations/${presentationId}/slides/insert/${position}`,
    data
  )
  return response.data
}

/**
 * Update a slide.
 */
export async function updateSlide(
  slideId: string,
  data: UpdateSlideData
): Promise<Slide> {
  const response = await apiClient.put<Slide>(`/api/slides/${slideId}`, data)
  return response.data
}

/**
 * Delete a slide.
 */
export async function deleteSlide(slideId: string): Promise<void> {
  await apiClient.delete(`/api/slides/${slideId}`)
}

/**
 * Duplicate a slide.
 */
export async function duplicateSlide(slideId: string): Promise<Slide> {
  const response = await apiClient.post<Slide>(`/api/slides/${slideId}/duplicate`)
  return response.data
}

/**
 * Reorder slides in a presentation.
 */
export async function reorderSlides(
  presentationId: string,
  data: ReorderSlidesData
): Promise<ReorderSlidesResponse> {
  const response = await apiClient.put<ReorderSlidesResponse>(
    `/api/presentations/${presentationId}/slides/reorder`,
    data
  )
  return response.data
}

// ============================================================================
// Upload Functions
// ============================================================================

/**
 * Upload an image for a slide.
 */
export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<{ url: string; filename: string }>(
    '/api/uploads/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

/**
 * Delete an uploaded image.
 */
export async function deleteImage(filename: string): Promise<void> {
  await apiClient.delete(`/api/uploads/images/${filename}`)
}
