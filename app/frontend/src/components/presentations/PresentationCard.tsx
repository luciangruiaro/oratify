/**
 * Presentation Card Component
 *
 * Displays a presentation as a card with:
 * - Title and description
 * - Status badge
 * - Slide count
 * - Last updated time
 * - Action menu (edit, duplicate, delete)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Presentation } from '@/api/presentations'
import styles from './PresentationCard.module.css'

interface PresentationCardProps {
  presentation: Presentation
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function PresentationCard({
  presentation,
  onDuplicate,
  onDelete,
}: PresentationCardProps) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive
      case 'archived':
        return styles.statusArchived
      default:
        return styles.statusDraft
    }
  }

  const handleEdit = () => {
    navigate(`/presentations/${presentation.id}/edit`)
  }

  const handlePresent = () => {
    navigate(`/presentations/${presentation.id}/present`)
  }

  const handleDuplicate = () => {
    setShowMenu(false)
    onDuplicate(presentation.id)
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false)
    onDelete(presentation.id)
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.status} ${getStatusColor(presentation.status)}`}>
          {presentation.status}
        </span>
        <div className={styles.menuContainer}>
          <button
            className={styles.menuButton}
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
          >
            ⋮
          </button>
          {showMenu && (
            <>
              <div className={styles.menuBackdrop} onClick={() => setShowMenu(false)} />
              <div className={styles.menu}>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handlePresent}>Present</button>
                <button onClick={handleDuplicate}>Duplicate</button>
                <button className={styles.deleteOption} onClick={handleDeleteClick}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.content} onClick={handleEdit}>
        <h3 className={styles.title}>{presentation.title}</h3>
        {presentation.description && (
          <p className={styles.description}>{presentation.description}</p>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.slideCount}>
          {presentation.slide_count} {presentation.slide_count === 1 ? 'slide' : 'slides'}
        </span>
        <span className={styles.date}>Updated {formatDate(presentation.updated_at)}</span>
      </div>

      {showDeleteConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmModal}>
            <h4>Delete Presentation?</h4>
            <p>This will permanently delete "{presentation.title}" and all its slides.</p>
            <div className={styles.confirmButtons}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button className={styles.deleteButton} onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PresentationCard
