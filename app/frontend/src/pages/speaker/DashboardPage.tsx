/**
 * Speaker Dashboard Page
 *
 * Main dashboard for authenticated speakers.
 * Features:
 * - Presentation list with cards
 * - Search and filter
 * - Create presentation modal
 * - Pagination
 */

import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  fetchPresentations,
  createPresentation,
  deletePresentation,
  duplicatePresentation,
  setSearch,
  setStatusFilter,
  setPage,
  selectPresentations,
} from '@/features/presentations/presentationsSlice'
import type { PresentationStatus } from '@/api/presentations'
import { PresentationCard } from '@/components/presentations/PresentationCard'
import { CreatePresentationModal } from '@/components/presentations/CreatePresentationModal'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { speaker, logout, isLoading: isAuthLoading } = useAuth()
  const {
    items: presentations,
    total,
    page,
    totalPages,
    search,
    statusFilter,
    isLoading,
    isCreating,
    error,
  } = useAppSelector(selectPresentations)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchInput, setSearchInput] = useState(search)

  // Fetch presentations on mount and when filters change
  useEffect(() => {
    dispatch(fetchPresentations({}))
  }, [dispatch, search, statusFilter, page])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        dispatch(setSearch(searchInput))
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, search, dispatch])

  const handleLogout = async () => {
    await logout()
  }

  const handleCreate = useCallback(
    async (title: string, description?: string) => {
      const result = await dispatch(createPresentation({ title, description }))
      if (createPresentation.fulfilled.match(result)) {
        setShowCreateModal(false)
        // Navigate to composer
        navigate(`/presentations/${result.payload.id}/edit`)
      }
    },
    [dispatch, navigate]
  )

  const handleDuplicate = useCallback(
    async (id: string) => {
      await dispatch(duplicatePresentation({ id }))
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deletePresentation(id))
    },
    [dispatch]
  )

  const handleStatusFilter = (status: PresentationStatus | null) => {
    dispatch(setStatusFilter(status))
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Oratify</h1>
        <div className={styles.userSection}>
          <span className={styles.userName}>{speaker?.name || speaker?.email}</span>
          <button
            onClick={handleLogout}
            disabled={isAuthLoading}
            className={styles.logoutButton}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.searchSection}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search presentations..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${statusFilter === null ? styles.active : ''}`}
              onClick={() => handleStatusFilter(null)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === 'draft' ? styles.active : ''}`}
              onClick={() => handleStatusFilter('draft')}
            >
              Drafts
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === 'active' ? styles.active : ''}`}
              onClick={() => handleStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`${styles.filterButton} ${statusFilter === 'archived' ? styles.active : ''}`}
              onClick={() => handleStatusFilter('archived')}
            >
              Archived
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createButton}
          >
            + New Presentation
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {isLoading && presentations.length === 0 ? (
          <div className={styles.loadingState}>
            <div className="loading-spinner" />
            <p>Loading presentations...</p>
          </div>
        ) : presentations.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <h2>No Presentations Yet</h2>
            <p>Create your first interactive presentation to get started.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className={styles.emptyCreateButton}
            >
              Create Presentation
            </button>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {presentations.map((presentation) => (
                <PresentationCard
                  key={presentation.id}
                  presentation={presentation}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={styles.pageButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {page} of {totalPages} ({total} total)
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={styles.pageButton}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <CreatePresentationModal
        isOpen={showCreateModal}
        isCreating={isCreating}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default DashboardPage
