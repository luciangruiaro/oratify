/**
 * Presentation Settings Page
 *
 * Edit presentation metadata:
 * - Title, description
 * - Speaker notes for AI context
 * - Status (draft, active, archived)
 */

import { useEffect, useState, FormEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  fetchPresentation,
  updatePresentation,
  deletePresentation,
  selectCurrentPresentation,
  selectPresentationsLoading,
} from '@/features/presentations/presentationsSlice'
import type { PresentationStatus } from '@/api/presentations'
import styles from './PresentationSettingsPage.module.css'

export function PresentationSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const presentation = useAppSelector(selectCurrentPresentation)
  const isLoading = useAppSelector(selectPresentationsLoading)
  const { isUpdating, isDeleting } = useAppSelector((state) => state.presentations)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [speakerNotes, setSpeakerNotes] = useState('')
  const [status, setStatus] = useState<PresentationStatus>('draft')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchPresentation(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (presentation) {
      setTitle(presentation.title)
      setDescription(presentation.description || '')
      setSpeakerNotes(presentation.speaker_notes || '')
      setStatus(presentation.status)
    }
  }, [presentation])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id || !title.trim()) return

    const result = await dispatch(
      updatePresentation({
        id,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          speaker_notes: speakerNotes.trim() || undefined,
          status,
        },
      })
    )

    if (updatePresentation.fulfilled.match(result)) {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    const result = await dispatch(deletePresentation(id))
    if (deletePresentation.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }

  if (isLoading && !presentation) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner" />
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!presentation) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Presentation Not Found</h2>
          <Link to="/dashboard" className={styles.backLink}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link
            to={`/presentations/${presentation.id}/edit`}
            className={styles.backButton}
          >
            &larr; Back to Editor
          </Link>
          <h1 className={styles.pageTitle}>Presentation Settings</h1>
        </div>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>General</h2>

            <div className={styles.field}>
              <label htmlFor="title" className={styles.label}>
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description" className={styles.label}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={3}
                className={styles.textarea}
                placeholder="A brief description of your presentation..."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="status" className={styles.label}>
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PresentationStatus)}
                className={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
              <p className={styles.hint}>
                Active presentations can be presented to an audience.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>AI Context</h2>
            <p className={styles.sectionDescription}>
              Speaker notes provide context for the AI when answering audience questions.
              Include key facts, talking points, and any information you want the AI to use.
            </p>

            <div className={styles.field}>
              <label htmlFor="speakerNotes" className={styles.label}>
                Speaker Notes
              </label>
              <textarea
                id="speakerNotes"
                value={speakerNotes}
                onChange={(e) => setSpeakerNotes(e.target.value)}
                maxLength={50000}
                rows={10}
                className={styles.textarea}
                placeholder="Enter your speaker notes, talking points, key facts, and context that the AI should use when answering audience questions..."
              />
              <p className={styles.hint}>
                {speakerNotes.length.toLocaleString()} / 50,000 characters
              </p>
            </div>
          </section>

          <div className={styles.actions}>
            <button
              type="submit"
              disabled={isUpdating || !title.trim()}
              className={styles.saveButton}
            >
              {isUpdating ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>

        <section className={styles.dangerZone}>
          <h2 className={styles.dangerTitle}>Danger Zone</h2>
          <p>
            Deleting a presentation is permanent and cannot be undone.
            All slides, sessions, and responses will be deleted.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className={styles.deleteButton}
          >
            Delete Presentation
          </button>
        </section>
      </main>

      {showDeleteConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h3>Delete Presentation?</h3>
            <p>
              This will permanently delete "{presentation.title}" and all its slides.
              This action cannot be undone.
            </p>
            <div className={styles.confirmButtons}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={styles.cancelButton}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.confirmDeleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresentationSettingsPage
