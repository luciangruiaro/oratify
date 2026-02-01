/**
 * Waiting Screen
 *
 * Displayed when:
 * - Session status is 'pending' (not started yet)
 * - Session status is 'paused' (temporarily paused)
 *
 * Features:
 * - Shows presentation title
 * - Loading animation
 * - Auto-polling to check for session start (future enhancement)
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getSessionByCode, SessionJoinInfo } from '@/api/sessions'
import styles from './WaitingScreen.module.css'

interface LocationState {
  session: SessionJoinInfo
  isPaused?: boolean
}

export function WaitingScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [session, setSession] = useState<SessionJoinInfo | null>(
    state?.session || null
  )
  const isPaused = state?.isPaused || false

  // Redirect if no session data
  useEffect(() => {
    if (!session) {
      navigate('/join', { replace: true })
    }
  }, [session, navigate])

  // Poll for session status changes
  useEffect(() => {
    if (!session) return

    const pollInterval = setInterval(async () => {
      try {
        const updatedSession = await getSessionByCode(session.join_code)
        setSession(updatedSession)

        // Navigate when session becomes active
        if (updatedSession.status === 'active') {
          navigate('/join/name', { state: { session: updatedSession } })
        } else if (updatedSession.status === 'ended') {
          navigate('/join/ended', { state: { session: updatedSession } })
        }
      } catch {
        // Session no longer exists
        navigate('/join/not-found', { replace: true })
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(pollInterval)
  }, [session, navigate])

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.spinner} />

        <h1 className={styles.title}>
          {isPaused ? 'Session Paused' : 'Waiting for Session'}
        </h1>

        <p className={styles.presentationTitle}>{session.presentation_title}</p>

        <p className={styles.message}>
          {isPaused
            ? 'The presenter has paused the session. Please wait...'
            : 'The presenter will start the session shortly. Please wait...'}
        </p>

        <button
          className={styles.backButton}
          onClick={() => navigate('/join', { replace: true })}
        >
          Enter a Different Code
        </button>
      </div>
    </div>
  )
}

export default WaitingScreen
