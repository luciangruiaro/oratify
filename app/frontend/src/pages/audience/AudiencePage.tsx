/**
 * Audience Page (Placeholder)
 *
 * This is a placeholder for the audience view that will be
 * implemented in EPIC 12. It displays slides and allows
 * audience interaction.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SessionJoinInfo } from '@/api/sessions'
import styles from './AudiencePage.module.css'

interface LocationState {
  session: SessionJoinInfo
  displayName: string
}

export function AudiencePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  // Redirect if no session data
  useEffect(() => {
    if (!state?.session) {
      navigate('/join', { replace: true })
    }
  }, [state, navigate])

  if (!state?.session) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>
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

        <h1 className={styles.title}>You're In!</h1>

        <p className={styles.presentationTitle}>
          {state.session.presentation_title}
        </p>

        <p className={styles.displayName}>
          Joined as: <strong>{state.displayName}</strong>
        </p>

        <div className={styles.placeholder}>
          <p>Audience view coming in EPIC 12</p>
          <p className={styles.hint}>
            Slides and interaction features will appear here
          </p>
        </div>

        <button
          className={styles.leaveButton}
          onClick={() => navigate('/join', { replace: true })}
        >
          Leave Session
        </button>
      </div>
    </div>
  )
}

export default AudiencePage
