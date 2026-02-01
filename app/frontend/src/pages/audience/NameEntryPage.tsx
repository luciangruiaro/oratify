/**
 * Name Entry Page
 *
 * Optional screen for audience members to enter their display name.
 * Features:
 * - Optional name input
 * - Skip button to proceed anonymously
 * - Continue button to join with name
 */

import { useState, FormEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SessionJoinInfo } from '@/api/sessions'
import styles from './NameEntryPage.module.css'

interface LocationState {
  session: SessionJoinInfo
}

export function NameEntryPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null
  const session = state?.session

  const [displayName, setDisplayName] = useState('')

  // Redirect if no session data
  useEffect(() => {
    if (!session) {
      navigate('/join', { replace: true })
    }
  }, [session, navigate])

  const handleContinue = (name: string) => {
    // TODO: In EPIC 12, this will connect to WebSocket and join the session
    // For now, we'll just show a placeholder
    navigate('/join/audience', {
      state: {
        session,
        displayName: name || 'Anonymous',
      },
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleContinue(displayName.trim())
  }

  const handleSkip = () => {
    handleContinue('')
  }

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Almost There!</h1>

        <p className={styles.presentationTitle}>{session.presentation_title}</p>

        <p className={styles.subtitle}>
          Enter your name so the presenter can see who's participating
          (optional)
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className={styles.input}
              autoComplete="name"
              maxLength={50}
            />
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.continueButton}>
              {displayName.trim() ? 'Continue' : 'Join Anonymously'}
            </button>

            {displayName.trim() && (
              <button
                type="button"
                onClick={handleSkip}
                className={styles.skipButton}
              >
                Skip
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default NameEntryPage
