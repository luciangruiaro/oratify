/**
 * Tests for presentationsSlice Redux reducer.
 *
 * Tests:
 * - Initial state
 * - Sync actions (setSearch, setStatusFilter, etc.)
 * - Selectors
 */

import { describe, it, expect } from 'vitest'
import presentationsReducer, {
  setSearch,
  setStatusFilter,
  setPage,
  clearCurrent,
  clearError,
  selectPresentationItems,
  selectCurrentPresentation,
  selectPresentationsLoading,
} from './presentationsSlice'
import type { Presentation } from '@/api/presentations'

// Mock presentation data
const mockPresentation: Presentation = {
  id: 'pres-1',
  speaker_id: 'user-1',
  title: 'Test Presentation',
  description: 'A test presentation',
  slug: 'test-presentation',
  speaker_notes: '',
  status: 'draft',
  slide_count: 0,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('presentationsSlice', () => {
  describe('initial state', () => {
    it('returns the initial state', () => {
      const state = presentationsReducer(undefined, { type: 'unknown' })

      expect(state.items).toEqual([])
      expect(state.current).toBeNull()
      expect(state.total).toBe(0)
      expect(state.page).toBe(1)
      expect(state.pageSize).toBe(20)
      expect(state.search).toBe('')
      expect(state.statusFilter).toBeNull()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setSearch', () => {
    it('sets search and resets page to 1', () => {
      const stateWithPage = {
        items: [],
        current: null,
        total: 0,
        page: 3,
        pageSize: 20,
        totalPages: 5,
        search: '',
        statusFilter: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
      }

      const state = presentationsReducer(stateWithPage, setSearch('test'))

      expect(state.search).toBe('test')
      expect(state.page).toBe(1)
    })
  })

  describe('setStatusFilter', () => {
    it('sets status filter and resets page to 1', () => {
      const stateWithPage = {
        items: [],
        current: null,
        total: 0,
        page: 3,
        pageSize: 20,
        totalPages: 5,
        search: '',
        statusFilter: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
      }

      const state = presentationsReducer(stateWithPage, setStatusFilter('active'))

      expect(state.statusFilter).toBe('active')
      expect(state.page).toBe(1)
    })

    it('can clear status filter by setting to null', () => {
      const stateWithFilter = {
        items: [],
        current: null,
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        search: '',
        statusFilter: 'active' as const,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
      }

      const state = presentationsReducer(stateWithFilter, setStatusFilter(null))

      expect(state.statusFilter).toBeNull()
    })
  })

  describe('setPage', () => {
    it('sets the page number', () => {
      const state = presentationsReducer(undefined, setPage(5))

      expect(state.page).toBe(5)
    })
  })

  describe('clearCurrent', () => {
    it('clears the current presentation', () => {
      const stateWithCurrent = {
        items: [mockPresentation],
        current: mockPresentation,
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
        search: '',
        statusFilter: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: null,
      }

      const state = presentationsReducer(stateWithCurrent, clearCurrent())

      expect(state.current).toBeNull()
    })
  })

  describe('clearError', () => {
    it('clears the error', () => {
      const stateWithError = {
        items: [],
        current: null,
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        search: '',
        statusFilter: null,
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        isDeleting: false,
        error: 'Some error',
      }

      const state = presentationsReducer(stateWithError, clearError())

      expect(state.error).toBeNull()
    })
  })
})

describe('presentationsSlice selectors', () => {
  const mockState = {
    presentations: {
      items: [mockPresentation],
      current: mockPresentation,
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
      search: 'test',
      statusFilter: 'draft' as const,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      error: null,
    },
  }

  describe('selectPresentationItems', () => {
    it('returns all presentations', () => {
      const items = selectPresentationItems(mockState)
      expect(items).toEqual([mockPresentation])
    })
  })

  describe('selectCurrentPresentation', () => {
    it('returns the current presentation', () => {
      const current = selectCurrentPresentation(mockState)
      expect(current).toEqual(mockPresentation)
    })

    it('returns null when no current presentation', () => {
      const noCurrentState = {
        presentations: { ...mockState.presentations, current: null },
      }
      expect(selectCurrentPresentation(noCurrentState)).toBeNull()
    })
  })

  describe('selectPresentationsLoading', () => {
    it('returns the loading state', () => {
      expect(selectPresentationsLoading(mockState)).toBe(false)

      const loadingState = {
        presentations: { ...mockState.presentations, isLoading: true },
      }
      expect(selectPresentationsLoading(loadingState)).toBe(true)
    })
  })
})
