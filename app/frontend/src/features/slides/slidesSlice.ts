/**
 * Redux slice for slides state.
 *
 * Manages:
 * - List of slides for current presentation
 * - Currently selected slide
 * - Loading and error states
 * - CRUD operations
 * - Auto-save state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  Slide,
  SlideType,
  CreateSlideData,
  UpdateSlideData,
  listSlides as apiListSlides,
  createSlide as apiCreateSlide,
  updateSlide as apiUpdateSlide,
  deleteSlide as apiDeleteSlide,
  duplicateSlide as apiDuplicateSlide,
  reorderSlides as apiReorderSlides,
  getDefaultContent,
} from '@/api/slides'

// ============================================================================
// Types
// ============================================================================

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface SlidesState {
  items: Slide[]
  selectedId: string | null
  presentationId: string | null
  total: number
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isReordering: boolean
  saveStatus: SaveStatus
  lastSaved: string | null
  error: string | null
  previewMode: boolean
}

const initialState: SlidesState = {
  items: [],
  selectedId: null,
  presentationId: null,
  total: 0,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isReordering: false,
  saveStatus: 'saved',
  lastSaved: null,
  error: null,
  previewMode: false,
}

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch slides for a presentation.
 */
export const fetchSlides = createAsyncThunk(
  'slides/fetchSlides',
  async (presentationId: string, { rejectWithValue }) => {
    try {
      const response = await apiListSlides(presentationId)
      return { ...response, presentationId }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch slides')
    }
  }
)

/**
 * Create a new slide.
 */
export const createSlide = createAsyncThunk(
  'slides/createSlide',
  async (
    { presentationId, data }: { presentationId: string; data: CreateSlideData },
    { rejectWithValue }
  ) => {
    try {
      return await apiCreateSlide(presentationId, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to create slide')
    }
  }
)

/**
 * Update a slide.
 */
export const updateSlide = createAsyncThunk(
  'slides/updateSlide',
  async (
    { slideId, data }: { slideId: string; data: UpdateSlideData },
    { rejectWithValue }
  ) => {
    try {
      return await apiUpdateSlide(slideId, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to update slide')
    }
  }
)

/**
 * Delete a slide.
 */
export const deleteSlide = createAsyncThunk(
  'slides/deleteSlide',
  async (slideId: string, { rejectWithValue }) => {
    try {
      await apiDeleteSlide(slideId)
      return slideId
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete slide')
    }
  }
)

/**
 * Duplicate a slide.
 */
export const duplicateSlide = createAsyncThunk(
  'slides/duplicateSlide',
  async (slideId: string, { rejectWithValue }) => {
    try {
      return await apiDuplicateSlide(slideId)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to duplicate slide')
    }
  }
)

/**
 * Reorder slides.
 */
export const reorderSlides = createAsyncThunk(
  'slides/reorderSlides',
  async (
    { presentationId, slideIds }: { presentationId: string; slideIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiReorderSlides(presentationId, { slide_ids: slideIds })
      return response.slides
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to reorder slides')
    }
  }
)

// ============================================================================
// Slice
// ============================================================================

const slidesSlice = createSlice({
  name: 'slides',
  initialState,
  reducers: {
    selectSlide: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload
    },
    clearSlides: (state) => {
      state.items = []
      state.selectedId = null
      state.presentationId = null
      state.total = 0
      state.saveStatus = 'saved'
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
    setSaveStatus: (state, action: PayloadAction<SaveStatus>) => {
      state.saveStatus = action.payload
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload
    },
    // Optimistic local update for content changes (before API call)
    updateSlideContent: (
      state,
      action: PayloadAction<{ slideId: string; content: Record<string, unknown> }>
    ) => {
      const slide = state.items.find((s) => s.id === action.payload.slideId)
      if (slide) {
        slide.content = action.payload.content
        state.saveStatus = 'unsaved'
      }
    },
    // Optimistic local reorder (before API call)
    reorderSlidesLocal: (state, action: PayloadAction<string[]>) => {
      const orderedSlides = action.payload
        .map((id) => state.items.find((s) => s.id === id))
        .filter((s): s is Slide => s !== undefined)
        .map((slide, index) => ({ ...slide, order_index: index }))
      state.items = orderedSlides
      state.saveStatus = 'unsaved'
    },
    // Add a slide locally (optimistic)
    addSlideLocal: (state, action: PayloadAction<{ type: SlideType; afterId?: string }>) => {
      const { type, afterId } = action.payload
      const tempId = `temp-${Date.now()}`
      const newSlide: Slide = {
        id: tempId,
        presentation_id: state.presentationId || '',
        order_index: state.items.length,
        type,
        content: getDefaultContent(type),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (afterId) {
        const index = state.items.findIndex((s) => s.id === afterId)
        if (index !== -1) {
          state.items.splice(index + 1, 0, newSlide)
          // Update order indices
          state.items.forEach((s, i) => {
            s.order_index = i
          })
        } else {
          state.items.push(newSlide)
        }
      } else {
        state.items.push(newSlide)
      }

      state.total = state.items.length
      state.selectedId = tempId
      state.saveStatus = 'unsaved'
    },
  },
  extraReducers: (builder) => {
    // Fetch slides
    builder
      .addCase(fetchSlides.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSlides.fulfilled, (state, action) => {
        state.items = action.payload.items.sort((a, b) => a.order_index - b.order_index)
        state.total = action.payload.total
        state.presentationId = action.payload.presentationId
        state.isLoading = false
        state.saveStatus = 'saved'
        // Auto-select first slide if none selected
        if (!state.selectedId && state.items.length > 0) {
          state.selectedId = state.items[0].id
        }
      })
      .addCase(fetchSlides.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create slide
    builder
      .addCase(createSlide.pending, (state) => {
        state.isCreating = true
        state.error = null
        state.saveStatus = 'saving'
      })
      .addCase(createSlide.fulfilled, (state, action) => {
        // Replace temp slide or add new
        const tempIndex = state.items.findIndex((s) => s.id.startsWith('temp-'))
        if (tempIndex !== -1) {
          state.items[tempIndex] = action.payload
        } else {
          state.items.push(action.payload)
        }
        state.items.sort((a, b) => a.order_index - b.order_index)
        state.total = state.items.length
        state.selectedId = action.payload.id
        state.isCreating = false
        state.saveStatus = 'saved'
        state.lastSaved = new Date().toISOString()
      })
      .addCase(createSlide.rejected, (state, action) => {
        // Remove temp slide on failure
        state.items = state.items.filter((s) => !s.id.startsWith('temp-'))
        state.total = state.items.length
        state.isCreating = false
        state.saveStatus = 'error'
        state.error = action.payload as string
      })

    // Update slide
    builder
      .addCase(updateSlide.pending, (state) => {
        state.isUpdating = true
        state.error = null
        state.saveStatus = 'saving'
      })
      .addCase(updateSlide.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.isUpdating = false
        state.saveStatus = 'saved'
        state.lastSaved = new Date().toISOString()
      })
      .addCase(updateSlide.rejected, (state, action) => {
        state.isUpdating = false
        state.saveStatus = 'error'
        state.error = action.payload as string
      })

    // Delete slide
    builder
      .addCase(deleteSlide.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        const deletedIndex = state.items.findIndex((s) => s.id === action.payload)
        state.items = state.items.filter((s) => s.id !== action.payload)
        // Update order indices
        state.items.forEach((s, i) => {
          s.order_index = i
        })
        state.total = state.items.length
        // Select adjacent slide
        if (state.selectedId === action.payload) {
          if (state.items.length > 0) {
            const newIndex = Math.min(deletedIndex, state.items.length - 1)
            state.selectedId = state.items[newIndex].id
          } else {
            state.selectedId = null
          }
        }
        state.isDeleting = false
      })
      .addCase(deleteSlide.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload as string
      })

    // Duplicate slide
    builder
      .addCase(duplicateSlide.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(duplicateSlide.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.items.sort((a, b) => a.order_index - b.order_index)
        state.total = state.items.length
        state.selectedId = action.payload.id
        state.isCreating = false
      })
      .addCase(duplicateSlide.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })

    // Reorder slides
    builder
      .addCase(reorderSlides.pending, (state) => {
        state.isReordering = true
        state.error = null
        state.saveStatus = 'saving'
      })
      .addCase(reorderSlides.fulfilled, (state, action) => {
        state.items = action.payload.sort((a, b) => a.order_index - b.order_index)
        state.isReordering = false
        state.saveStatus = 'saved'
        state.lastSaved = new Date().toISOString()
      })
      .addCase(reorderSlides.rejected, (state, action) => {
        state.isReordering = false
        state.saveStatus = 'error'
        state.error = action.payload as string
      })
  },
})

export const {
  selectSlide,
  clearSlides,
  clearError,
  setSaveStatus,
  setPreviewMode,
  updateSlideContent,
  reorderSlidesLocal,
  addSlideLocal,
} = slidesSlice.actions

export default slidesSlice.reducer

// ============================================================================
// Selectors
// ============================================================================

export const selectSlides = (state: { slides: SlidesState }) => state.slides
export const selectSlideItems = (state: { slides: SlidesState }) => state.slides.items
export const selectSelectedSlideId = (state: { slides: SlidesState }) => state.slides.selectedId
export const selectSelectedSlide = (state: { slides: SlidesState }) =>
  state.slides.items.find((s) => s.id === state.slides.selectedId) || null
export const selectSlidesLoading = (state: { slides: SlidesState }) => state.slides.isLoading
export const selectSaveStatus = (state: { slides: SlidesState }) => state.slides.saveStatus
export const selectLastSaved = (state: { slides: SlidesState }) => state.slides.lastSaved
export const selectPreviewMode = (state: { slides: SlidesState }) => state.slides.previewMode
export const selectSlidesError = (state: { slides: SlidesState }) => state.slides.error
