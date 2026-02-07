/**
 * Session Ended View Component
 *
 * Displayed when the session ends. Shows a thank you message
 * and a link to return to the join page.
 */

import { useNavigate } from 'react-router-dom'
import styles from './SessionEndedView.module.css'

interface SessionEndedViewProps {
  presentationTitle: string
}

export function SessionEndedView({
  presentationTitle,
}: SessionEndedViewProps) {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="48"
          height="48"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>

      <h1 className={styles.title}>Session Ended</h1>

      <p className={styles.presentationTitle}>{presentationTitle}</p>

      <p className={styles.message}>
        Thank you for participating! This session has concluded.
      </p>

      <button
        className={styles.button}
        onClick={() => navigate('/join', { replace: true })}
      >
        Join Another Session
      </button>
    </div>
  )
}
