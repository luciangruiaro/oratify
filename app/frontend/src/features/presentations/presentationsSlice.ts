/**
 * Redux slice for presentations state.
 *
 * Manages:
 * - List of presentations
 * - Current presentation being edited
 * - Loading and error states
 * - CRUD operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  Presentation,
  PresentationStatus,
  CreatePresentationData,
  UpdatePresentationData,
  ListPresentationsParams,
  listPresentations as apiListPresentations,
  getPresentation as apiGetPresentation,
  createPresentation as apiCreatePresentation,
  updatePresentation as apiUpdatePresentation,
  deletePresentation as apiDeletePresentation,
  duplicatePresentation as apiDuplicatePresentation,
} from '@/api/presentations'

interface PresentationsState {
  items: Presentation[]
  current: Presentation | null
  total: number
  page: number
  pageSize: number
  totalPages: number
  search: string
  statusFilter: PresentationStatus | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
}

const initialState: PresentationsState = {
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
  error: null,
}

/**
 * Fetch presentations with current filters.
 */
export const fetchPresentations = createAsyncThunk(
  'presentations/fetchPresentations',
  async (params: ListPresentationsParams | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { presentations: PresentationsState }
      const { page, pageSize, search, statusFilter } = state.presentations

      const response = await apiListPresentations({
        page: params?.page ?? page,
        page_size: params?.page_size ?? pageSize,
        search: params?.search ?? (search || undefined),
        status: params?.status ?? (statusFilter ?? undefined),
      })

      return response
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch presentations')
    }
  }
)

/**
 * Fetch a single presentation by ID.
 */
export const fetchPresentation = createAsyncThunk(
  'presentations/fetchPresentation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiGetPresentation(id)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to fetch presentation')
    }
  }
)

/**
 * Create a new presentation.
 */
export const createPresentation = createAsyncThunk(
  'presentations/createPresentation',
  async (data: CreatePresentationData, { rejectWithValue }) => {
    try {
      return await apiCreatePresentation(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to create presentation')
    }
  }
)

/**
 * Update a presentation.
 */
export const updatePresentation = createAsyncThunk(
  'presentations/updatePresentation',
  async ({ id, data }: { id: string; data: UpdatePresentationData }, { rejectWithValue }) => {
    try {
      return await apiUpdatePresentation(id, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to update presentation')
    }
  }
)

/**
 * Delete a presentation.
 */
export const deletePresentation = createAsyncThunk(
  'presentations/deletePresentation',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiDeletePresentation(id)
      return id
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to delete presentation')
    }
  }
)

/**
 * Duplicate a presentation.
 */
export const duplicatePresentation = createAsyncThunk(
  'presentations/duplicatePresentation',
  async ({ id, newTitle }: { id: string; newTitle?: string }, { rejectWithValue }) => {
    try {
      return await apiDuplicatePresentation(id, newTitle)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } }
      return rejectWithValue(err.response?.data?.detail || 'Failed to duplicate presentation')
    }
  }
)

const presentationsSlice = createSlice({
  name: 'presentations',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      state.page = 1 // Reset to first page on search
    },
    setStatusFilter: (state, action: PayloadAction<PresentationStatus | null>) => {
      state.statusFilter = action.payload
      state.page = 1 // Reset to first page on filter change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    clearCurrent: (state) => {
      state.current = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch presentations
    builder
      .addCase(fetchPresentations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPresentations.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.page_size
        state.totalPages = action.payload.total_pages
        state.isLoading = false
      })
      .addCase(fetchPresentations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Fetch single presentation
    builder
      .addCase(fetchPresentation.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPresentation.fulfilled, (state, action) => {
        state.current = action.payload
        state.isLoading = false
      })
      .addCase(fetchPresentation.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Create presentation
    builder
      .addCase(createPresentation.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createPresentation.fulfilled, (state, action) => {
        state.items.unshift(action.payload) // Add to beginning
        state.total += 1
        state.isCreating = false
      })
      .addCase(createPresentation.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })

    // Update presentation
    builder
      .addCase(updatePresentation.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updatePresentation.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.current?.id === action.payload.id) {
          state.current = action.payload
        }
        state.isUpdating = false
      })
      .addCase(updatePresentation.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    // Delete presentation
    builder
      .addCase(deletePresentation.pending, (state) => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deletePresentation.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
        state.total -= 1
        if (state.current?.id === action.payload) {
          state.current = null
        }
        state.isDeleting = false
      })
      .addCase(deletePresentation.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload as string
      })

    // Duplicate presentation
    builder
      .addCase(duplicatePresentation.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(duplicatePresentation.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
        state.total += 1
        state.isCreating = false
      })
      .addCase(duplicatePresentation.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })
  },
})

export const { setSearch, setStatusFilter, setPage, clearCurrent, clearError } =
  presentationsSlice.actions

export default presentationsSlice.reducer

// Selectors
export const selectPresentations = (state: { presentations: PresentationsState }) =>
  state.presentations
export const selectPresentationItems = (state: { presentations: PresentationsState }) =>
  state.presentations.items
export const selectCurrentPresentation = (state: { presentations: PresentationsState }) =>
  state.presentations.current
export const selectPresentationsLoading = (state: { presentations: PresentationsState }) =>
  state.presentations.isLoading
