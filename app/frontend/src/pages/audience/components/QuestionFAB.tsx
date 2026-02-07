/**
 * Question Floating Action Button
 *
 * Always-visible button (bottom-right) that opens the question modal
 * for audience members to ask questions during the session.
 */

import styles from './QuestionFAB.module.css'

interface QuestionFABProps {
  onClick: () => void
  disabled?: boolean
}

export function QuestionFAB({ onClick, disabled = false }: QuestionFABProps) {
  return (
    <button
      className={styles.fab}
      onClick={onClick}
      disabled={disabled}
      aria-label="Ask a question"
      title="Ask a question"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </button>
  )
}
