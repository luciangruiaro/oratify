/**
 * Tests for slidesSlice Redux reducer.
 *
 * Tests:
 * - Initial state
 * - Sync actions (selectSlide, clearSlides, etc.)
 * - Selectors
 */

import { describe, it, expect } from 'vitest'
import slidesReducer, {
  selectSlide,
  clearSlides,
  clearError,
  setSaveStatus,
  setPreviewMode,
  updateSlideContent,
  reorderSlidesLocal,
  selectSlideItems,
  selectSelectedSlide,
  selectSaveStatus,
  selectPreviewMode,
} from './slidesSlice'
import { Slide } from '@/api/slides'

// Mock slide data
const mockSlide: Slide = {
  id: 'slide-1',
  presentation_id: 'pres-1',
  order_index: 0,
  type: 'content',
  content: { text: 'Test content', layout: 'text-only' },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockSlide2: Slide = {
  id: 'slide-2',
  presentation_id: 'pres-1',
  order_index: 1,
  type: 'question_text',
  content: { question: 'Test question?' },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('slidesSlice', () => {
  describe('initial state', () => {
    it('returns the initial state', () => {
      const state = slidesReducer(undefined, { type: 'unknown' })

      expect(state.items).toEqual([])
      expect(state.selectedId).toBeNull()
      expect(state.presentationId).toBeNull()
      expect(state.total).toBe(0)
      expect(state.isLoading).toBe(false)
      expect(state.saveStatus).toBe('saved')
      expect(state.previewMode).toBe(false)
    })
  })

  describe('selectSlide', () => {
    it('sets the selected slide ID', () => {
      const state = slidesReducer(undefined, selectSlide('slide-1'))

      expect(state.selectedId).toBe('slide-1')
    })

    it('can set selectedId to null', () => {
      const stateWithSelection = slidesReducer(undefined, selectSlide('slide-1'))
      const state = slidesReducer(stateWithSelection, selectSlide(null))

      expect(state.selectedId).toBeNull()
    })
  })

  describe('clearSlides', () => {
    it('resets slides state', () => {
      const stateWithData = {
        items: [mockSlide],
        selectedId: 'slide-1',
        presentationId: 'pres-1',
        total: 1,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isReordering: false,
        saveStatus: 'unsaved' as const,
        lastSaved: '2024-01-01T00:00:00Z',
        error: 'Some error',
        previewMode: true,
      }

      const state = slidesReducer(stateWithData, clearSlides())

      expect(state.items).toEqual([])
      expect(state.selectedId).toBeNull()
      expect(state.presentationId).toBeNull()
      expect(state.total).toBe(0)
      expect(state.saveStatus).toBe('saved')
      expect(state.error).toBeNull()
    })
  })

  describe('clearError', () => {
    it('clears the error state', () => {
      const stateWithError = {
        items: [],
        selectedId: null,
        presentationId: null,
        total: 0,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isReordering: false,
        saveStatus: 'error' as const,
        lastSaved: null,
        error: 'Some error',
        previewMode: false,
      }

      const state = slidesReducer(stateWithError, clearError())

      expect(state.error).toBeNull()
    })
  })

  describe('setSaveStatus', () => {
    it('sets the save status', () => {
      let state = slidesReducer(undefined, setSaveStatus('saving'))
      expect(state.saveStatus).toBe('saving')

      state = slidesReducer(state, setSaveStatus('saved'))
      expect(state.saveStatus).toBe('saved')

      state = slidesReducer(state, setSaveStatus('unsaved'))
      expect(state.saveStatus).toBe('unsaved')

      state = slidesReducer(state, setSaveStatus('error'))
      expect(state.saveStatus).toBe('error')
    })
  })

  describe('setPreviewMode', () => {
    it('toggles preview mode', () => {
      let state = slidesReducer(undefined, setPreviewMode(true))
      expect(state.previewMode).toBe(true)

      state = slidesReducer(state, setPreviewMode(false))
      expect(state.previewMode).toBe(false)
    })
  })

  describe('updateSlideContent', () => {
    it('updates slide content and sets status to unsaved', () => {
      const stateWithSlide = {
        items: [mockSlide],
        selectedId: 'slide-1',
        presentationId: 'pres-1',
        total: 1,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isReordering: false,
        saveStatus: 'saved' as const,
        lastSaved: null,
        error: null,
        previewMode: false,
      }

      const state = slidesReducer(
        stateWithSlide,
        updateSlideContent({
          slideId: 'slide-1',
          content: { text: 'Updated content', layout: 'text-only' },
        })
      )

      expect(state.items[0].content).toEqual({
        text: 'Updated content',
        layout: 'text-only',
      })
      expect(state.saveStatus).toBe('unsaved')
    })

    it('does nothing if slide not found', () => {
      const stateWithSlide = {
        items: [mockSlide],
        selectedId: 'slide-1',
        presentationId: 'pres-1',
        total: 1,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isReordering: false,
        saveStatus: 'saved' as const,
        lastSaved: null,
        error: null,
        previewMode: false,
      }

      const state = slidesReducer(
        stateWithSlide,
        updateSlideContent({
          slideId: 'nonexistent',
          content: { text: 'Updated' },
        })
      )

      expect(state.items[0].content).toEqual(mockSlide.content)
      expect(state.saveStatus).toBe('saved')
    })
  })

  describe('reorderSlidesLocal', () => {
    it('reorders slides and updates order_index', () => {
      const stateWithSlides = {
        items: [mockSlide, mockSlide2],
        selectedId: null,
        presentationId: 'pres-1',
        total: 2,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        isReordering: false,
        saveStatus: 'saved' as const,
        lastSaved: null,
        error: null,
        previewMode: false,
      }

      // Reverse order
      const state = slidesReducer(
        stateWithSlides,
        reorderSlidesLocal(['slide-2', 'slide-1'])
      )

      expect(state.items[0].id).toBe('slide-2')
      expect(state.items[0].order_index).toBe(0)
      expect(state.items[1].id).toBe('slide-1')
      expect(state.items[1].order_index).toBe(1)
      expect(state.saveStatus).toBe('unsaved')
    })
  })
})

describe('slidesSlice selectors', () => {
  const mockState = {
    slides: {
      items: [mockSlide, mockSlide2],
      selectedId: 'slide-1',
      presentationId: 'pres-1',
      total: 2,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      isReordering: false,
      saveStatus: 'saved' as const,
      lastSaved: '2024-01-01T00:00:00Z',
      error: null,
      previewMode: true,
    },
  }

  describe('selectSlideItems', () => {
    it('returns all slides', () => {
      const items = selectSlideItems(mockState)
      expect(items).toEqual([mockSlide, mockSlide2])
    })
  })

  describe('selectSelectedSlide', () => {
    it('returns the selected slide', () => {
      const slide = selectSelectedSlide(mockState)
      expect(slide).toEqual(mockSlide)
    })

    it('returns null if no slide selected', () => {
      const stateNoSelection = {
        slides: { ...mockState.slides, selectedId: null },
      }
      const slide = selectSelectedSlide(stateNoSelection)
      expect(slide).toBeNull()
    })

    it('returns null if selected slide not found', () => {
      const stateWrongId = {
        slides: { ...mockState.slides, selectedId: 'nonexistent' },
      }
      const slide = selectSelectedSlide(stateWrongId)
      expect(slide).toBeNull()
    })
  })

  describe('selectSaveStatus', () => {
    it('returns the save status', () => {
      expect(selectSaveStatus(mockState)).toBe('saved')
    })
  })

  describe('selectPreviewMode', () => {
    it('returns the preview mode', () => {
      expect(selectPreviewMode(mockState)).toBe(true)
    })
  })
})
