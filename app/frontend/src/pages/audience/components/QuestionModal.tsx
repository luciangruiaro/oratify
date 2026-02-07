/**
 * Question Modal Component
 *
 * Modal for audience members to submit questions about the presentation.
 * Includes textarea with character limit and submit button.
 */

import { useState } from 'react'
import { triggerHaptic } from '../../../utils/haptic'
import styles from './QuestionModal.module.css'

const MAX_CHARS = 300

interface QuestionModalProps {
  onSubmit: (questionText: string) => void
  onClose: () => void
}

export function QuestionModal({ onSubmit, onClose }: QuestionModalProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || isSubmitting) return
    setIsSubmitting(true)
    triggerHaptic('success')
    onSubmit(trimmed)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const remaining = MAX_CHARS - text.length

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Ask a Question</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="What would you like to ask?"
          rows={4}
          disabled={isSubmitting}
          autoFocus
        />

        <div className={styles.footer}>
          <span className={`${styles.charCount} ${remaining < 30 ? styles.charCountLow : ''}`}>
            {remaining}
          </span>
          <div className={styles.actions}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!text.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
