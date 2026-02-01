/**
 * Ended Screen
 *
 * Displayed when a session has ended.
 * Informs the audience that the presentation is over.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SessionJoinInfo } from '@/api/sessions'
import styles from './EndedScreen.module.css'

interface LocationState {
  session: SessionJoinInfo
}

export function EndedScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const session = state?.session

  // Redirect if no session data
  useEffect(() => {
    if (!session) {
      navigate('/join', { replace: true })
    }
  }, [session, navigate])

  if (!session) {
    return null
  }

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
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>

        <h1 className={styles.title}>Session Ended</h1>

        <p className={styles.presentationTitle}>{session.presentation_title}</p>

        <p className={styles.message}>
          This presentation session has concluded. Thank you for participating!
        </p>

        <button
          className={styles.backButton}
          onClick={() => navigate('/join', { replace: true })}
        >
          Join Another Session
        </button>
      </div>
    </div>
  )
}

export default EndedScreen
