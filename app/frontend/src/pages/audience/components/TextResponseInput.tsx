/**
 * Text Response Input Component
 *
 * Shown for question_text slide types. Provides a textarea
 * with character counter and submit button.
 */

import { useState } from 'react'
import { triggerHaptic } from '../../../utils/haptic'
import styles from './TextResponseInput.module.css'

const MAX_CHARS = 500

interface TextResponseInputProps {
  question: string
  hasResponded: boolean
  onSubmit: (text: string) => void
}

export function TextResponseInput({
  question,
  hasResponded,
  onSubmit,
}: TextResponseInputProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || hasResponded || isSubmitting) return
    setIsSubmitting(true)
    triggerHaptic('success')
    onSubmit(trimmed)
  }

  const remaining = MAX_CHARS - text.length

  return (
    <div className={styles.container}>
      <div className={styles.questionIcon}>?</div>
      <h2 className={styles.question}>{question}</h2>

      {hasResponded ? (
        <p className={styles.responded}>You have already responded to this question.</p>
      ) : (
        <div className={styles.inputArea}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Type your response..."
            rows={4}
            disabled={isSubmitting}
          />
          <div className={styles.footer}>
            <span className={`${styles.charCount} ${remaining < 50 ? styles.charCountLow : ''}`}>
              {remaining} characters remaining
            </span>
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!text.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
