/**
 * Not Found Screen
 *
 * Displayed when:
 * - Session code is invalid
 * - Session no longer exists
 * - No active session for a presentation slug
 */

import { useNavigate } from 'react-router-dom'
import styles from './NotFoundScreen.module.css'

export function NotFoundScreen() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="48"
            height="48"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <h1 className={styles.title}>Session Not Found</h1>

        <p className={styles.message}>
          We couldn't find the session you're looking for. The code may be
          incorrect, or the session may have been removed.
        </p>

        <button
          className={styles.backButton}
          onClick={() => navigate('/join', { replace: true })}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default NotFoundScreen
