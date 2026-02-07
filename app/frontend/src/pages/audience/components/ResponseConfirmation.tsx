/**
 * Response Confirmation Component
 *
 * Shows a confirmation message after the audience member submits a response.
 * Displays a checkmark animation and "Response submitted!" message.
 */

import styles from './ResponseConfirmation.module.css'

interface ResponseConfirmationProps {
  isAlreadyResponded?: boolean
}

export function ResponseConfirmation({
  isAlreadyResponded = false,
}: ResponseConfirmationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="32"
          height="32"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>
      <p className={styles.message}>
        {isAlreadyResponded ? 'Already responded' : 'Response submitted!'}
      </p>
    </div>
  )
}
