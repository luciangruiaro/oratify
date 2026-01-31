/**
 * Create Presentation Modal
 *
 * Modal form for creating a new presentation.
 */

import { useState, FormEvent } from 'react'
import styles from './CreatePresentationModal.module.css'

interface CreatePresentationModalProps {
  isOpen: boolean
  isCreating: boolean
  onClose: () => void
  onCreate: (title: string, description?: string) => void
}

export function CreatePresentationModal({
  isOpen,
  isCreating,
  onClose,
  onCreate,
}: CreatePresentationModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onCreate(title.trim(), description.trim() || undefined)
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Create Presentation</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Presentation"
              required
              maxLength={200}
              autoFocus
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.optional}>(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your presentation..."
              maxLength={2000}
              rows={3}
              className={styles.textarea}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isCreating}
              className={styles.createButton}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePresentationModal
