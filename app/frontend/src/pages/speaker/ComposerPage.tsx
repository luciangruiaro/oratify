/**
 * Presentation Composer Page
 *
 * Full editor for creating and editing presentation slides.
 * Features:
 * - Slide thumbnail sidebar with drag-and-drop
 * - Type-specific slide editors
 * - Auto-save with debounce
 * - Preview mode
 * - Keyboard shortcuts
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import { useParams, useNavigate, Link, useBlocker } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  fetchPresentation,
  selectCurrentPresentation,
  selectPresentationsLoading,
  updatePresentation,
} from '@/features/presentations/presentationsSlice'
import {
  fetchSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  duplicateSlide,
  reorderSlides,
  selectSlide,
  selectSlideItems,
  selectSelectedSlide,
  selectSelectedSlideId,
  selectSlidesLoading,
  selectSaveStatus,
  selectLastSaved,
  selectPreviewMode,
  setPreviewMode,
  updateSlideContent,
  reorderSlidesLocal,
} from '@/features/slides/slidesSlice'
import { SlideType, getDefaultContent } from '@/api/slides'
import {
  SlideThumbnail,
  AddSlideDropdown,
  SlideEditor,
  SlidePreview,
  SaveStatusIndicator,
  PropertiesPanel,
} from '@/components/composer'
import styles from './ComposerPage.module.css'

// Debounce delay for auto-save (ms)
const AUTO_SAVE_DELAY = 1500

export function ComposerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Selectors
  const presentation = useAppSelector(selectCurrentPresentation)
  const isLoadingPresentation = useAppSelector(selectPresentationsLoading)
  const slides = useAppSelector(selectSlideItems)
  const selectedSlide = useAppSelector(selectSelectedSlide)
  const selectedSlideId = useAppSelector(selectSelectedSlideId)
  const isLoadingSlides = useAppSelector(selectSlidesLoading)
  const saveStatus = useAppSelector(selectSaveStatus)
  const lastSaved = useAppSelector(selectLastSaved)
  const previewMode = useAppSelector(selectPreviewMode)

  // Local state
  const [speakerNotes, setSpeakerNotes] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null)

  // Refs for debouncing
  const saveTimeoutRef = useRef<number | null>(null)
  const speakerNotesTimeoutRef = useRef<number | null>(null)

  // Load presentation and slides
  useEffect(() => {
    if (id) {
      dispatch(fetchPresentation(id))
      dispatch(fetchSlides(id))
    }
  }, [dispatch, id])

  // Sync speaker notes from presentation
  useEffect(() => {
    if (presentation) {
      setSpeakerNotes(presentation.speaker_notes || '')
    }
  }, [presentation])

  // Block navigation if there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      saveStatus === 'unsaved' && currentLocation.pathname !== nextLocation.pathname
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSaveAll()
      }
      // Ctrl+P: Toggle preview
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault()
        dispatch(setPreviewMode(!previewMode))
      }
      // Ctrl+D: Duplicate slide
      if (e.ctrlKey && e.key === 'd' && selectedSlideId) {
        e.preventDefault()
        handleDuplicateSlide(selectedSlideId)
      }
      // Delete: Delete slide
      if (e.key === 'Delete' && selectedSlideId && !deleteConfirm) {
        e.preventDefault()
        setDeleteConfirm(selectedSlideId)
      }
      // Arrow keys: Navigate slides
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const target = e.target as HTMLElement
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
          return
        }
        e.preventDefault()
        const currentIndex = slides.findIndex((s) => s.id === selectedSlideId)
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          dispatch(selectSlide(slides[currentIndex - 1].id))
        } else if (e.key === 'ArrowDown' && currentIndex < slides.length - 1) {
          dispatch(selectSlide(slides[currentIndex + 1].id))
        }
      }
      // Escape: Cancel delete confirm
      if (e.key === 'Escape') {
        setDeleteConfirm(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, previewMode, selectedSlideId, slides, deleteConfirm])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      if (speakerNotesTimeoutRef.current) {
        clearTimeout(speakerNotesTimeoutRef.current)
      }
    }
  }, [])

  // Save all pending changes
  const handleSaveAll = useCallback(() => {
    if (selectedSlide && saveStatus === 'unsaved') {
      dispatch(updateSlide({ slideId: selectedSlide.id, data: { content: selectedSlide.content } }))
    }
  }, [dispatch, selectedSlide, saveStatus])

  // Handle slide content change with auto-save
  const handleContentChange = useCallback(
    (content: Record<string, unknown>) => {
      if (!selectedSlide) return

      // Update local state immediately
      dispatch(updateSlideContent({ slideId: selectedSlide.id, content }))

      // Debounce API call
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = window.setTimeout(() => {
        dispatch(updateSlide({ slideId: selectedSlide.id, data: { content } }))
      }, AUTO_SAVE_DELAY)
    },
    [dispatch, selectedSlide]
  )

  // Handle speaker notes change with debounced save
  const handleSpeakerNotesChange = useCallback(
    (notes: string) => {
      setSpeakerNotes(notes)

      if (speakerNotesTimeoutRef.current) {
        clearTimeout(speakerNotesTimeoutRef.current)
      }
      speakerNotesTimeoutRef.current = window.setTimeout(() => {
        if (presentation) {
          dispatch(updatePresentation({ id: presentation.id, data: { speaker_notes: notes } }))
        }
      }, AUTO_SAVE_DELAY)
    },
    [dispatch, presentation]
  )

  // Add new slide
  const handleAddSlide = useCallback(
    (type: SlideType) => {
      if (!id) return
      dispatch(createSlide({ presentationId: id, data: { type, content: getDefaultContent(type) } }))
    },
    [dispatch, id]
  )

  // Delete slide
  const handleDeleteSlide = useCallback(
    (slideId: string) => {
      if (deleteConfirm === slideId) {
        dispatch(deleteSlide(slideId))
        setDeleteConfirm(null)
      } else {
        setDeleteConfirm(slideId)
      }
    },
    [dispatch, deleteConfirm]
  )

  // Duplicate slide
  const handleDuplicateSlide = useCallback(
    (slideId: string) => {
      dispatch(duplicateSlide(slideId))
    },
    [dispatch]
  )

  // Handle slide selection
  const handleSelectSlide = useCallback(
    (slideId: string) => {
      dispatch(selectSlide(slideId))
    },
    [dispatch]
  )

  // Drag and drop handlers
  const handleDragStart = useCallback((slideId: string) => {
    setDraggedSlideId(slideId)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      if (!draggedSlideId || draggedSlideId === targetId) return

      const currentOrder = slides.map((s) => s.id)
      const draggedIndex = currentOrder.indexOf(draggedSlideId)
      const targetIndex = currentOrder.indexOf(targetId)

      if (draggedIndex === -1 || targetIndex === -1) return

      const newOrder = [...currentOrder]
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedSlideId)

      dispatch(reorderSlidesLocal(newOrder))
    },
    [dispatch, slides, draggedSlideId]
  )

  const handleDragEnd = useCallback(() => {
    if (draggedSlideId && id) {
      const slideIds = slides.map((s) => s.id)
      dispatch(reorderSlides({ presentationId: id, slideIds }))
    }
    setDraggedSlideId(null)
  }, [dispatch, id, slides, draggedSlideId])

  // Loading state
  if (isLoadingPresentation || isLoadingSlides) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner" />
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!presentation) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Presentation Not Found</h2>
          <p>The presentation you're looking for doesn't exist or you don't have access.</p>
          <Link to="/dashboard" className={styles.backLink}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            &larr; Back
          </button>
          <h1 className={styles.title}>{presentation.title}</h1>
          <span className={styles.status}>{presentation.status}</span>
          <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
        </div>
        <div className={styles.headerRight}>
          <button
            className={`${styles.previewToggle} ${previewMode ? styles.active : ''}`}
            onClick={() => dispatch(setPreviewMode(!previewMode))}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <Link
            to={`/presentations/${presentation.id}/settings`}
            className={styles.settingsButton}
          >
            Settings
          </Link>
          <Link
            to={`/presentations/${presentation.id}/present`}
            className={styles.presentButton}
          >
            Present
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.main}>
        {/* Sidebar with slide thumbnails */}
        <aside className={styles.sidebar}>
          <div className={styles.slidesList}>
            {slides.length === 0 ? (
              <div className={styles.emptySlides}>
                <p>No slides yet</p>
                <p className={styles.emptyHint}>Add your first slide below</p>
              </div>
            ) : (
              slides.map((slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={() => handleDragStart(slide.id)}
                  onDragOver={(e) => handleDragOver(e, slide.id)}
                  onDragEnd={handleDragEnd}
                >
                  <SlideThumbnail
                    slide={slide}
                    index={index}
                    isSelected={slide.id === selectedSlideId}
                    isDragging={slide.id === draggedSlideId}
                    onClick={() => handleSelectSlide(slide.id)}
                    onDelete={() => handleDeleteSlide(slide.id)}
                    onDuplicate={() => handleDuplicateSlide(slide.id)}
                  />
                  {deleteConfirm === slide.id && (
                    <div className={styles.deleteConfirm}>
                      <p>Delete this slide?</p>
                      <div className={styles.deleteActions}>
                        <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        <button
                          className={styles.deleteConfirmButton}
                          onClick={() => handleDeleteSlide(slide.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className={styles.addSlideContainer}>
            <AddSlideDropdown onAddSlide={handleAddSlide} />
          </div>
        </aside>

        {/* Editor or Preview */}
        <section className={styles.editor}>
          {selectedSlide ? (
            previewMode ? (
              <SlidePreview slide={selectedSlide} />
            ) : (
              <SlideEditor
                slide={selectedSlide}
                onContentChange={handleContentChange}
              />
            )
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>+</div>
              <h2>Create Your First Slide</h2>
              <p>Click "Add Slide" in the sidebar to get started</p>
            </div>
          )}
        </section>

        {/* Properties panel */}
        <aside className={styles.properties}>
          <PropertiesPanel
            slide={selectedSlide}
            speakerNotes={speakerNotes}
            onSpeakerNotesChange={handleSpeakerNotesChange}
          />
        </aside>
      </main>

      {/* Unsaved changes modal */}
      {blocker.state === 'blocked' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Unsaved Changes</h3>
            <p>You have unsaved changes. Do you want to leave without saving?</p>
            <div className={styles.modalActions}>
              <button onClick={() => blocker.reset?.()}>Stay</button>
              <button
                className={styles.dangerButton}
                onClick={() => blocker.proceed?.()}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComposerPage
