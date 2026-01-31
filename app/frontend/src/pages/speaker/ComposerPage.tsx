/**
 * Presentation Composer Page
 *
 * Editor for creating and editing presentation slides.
 * Full implementation in Epic 5/6.
 */

import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {
  fetchPresentation,
  selectCurrentPresentation,
  selectPresentationsLoading,
} from '@/features/presentations/presentationsSlice'
import styles from './ComposerPage.module.css'

export function ComposerPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const presentation = useAppSelector(selectCurrentPresentation)
  const isLoading = useAppSelector(selectPresentationsLoading)

  useEffect(() => {
    if (id) {
      dispatch(fetchPresentation(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className="loading-spinner" />
          <p>Loading presentation...</p>
        </div>
      </div>
    )
  }

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
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button
            onClick={() => navigate('/dashboard')}
            className={styles.backButton}
          >
            &larr; Back
          </button>
          <h1 className={styles.title}>{presentation.title}</h1>
          <span className={styles.status}>{presentation.status}</span>
        </div>
        <div className={styles.headerRight}>
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

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.slidesList}>
            <div className={styles.emptySlides}>
              <p>No slides yet</p>
              <button className={styles.addSlideButton} disabled>
                + Add Slide
              </button>
            </div>
          </div>
        </aside>

        <section className={styles.editor}>
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>🎨</div>
            <h2>Slide Editor</h2>
            <p>The slide editor will be implemented in Epic 5 & 6.</p>
            <p className={styles.hint}>
              Select a slide from the sidebar to edit, or create a new slide.
            </p>
          </div>
        </section>

        <aside className={styles.properties}>
          <h3>Properties</h3>
          <div className={styles.propertyPlaceholder}>
            <p>Slide properties will appear here</p>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default ComposerPage
