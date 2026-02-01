/**
 * Join Page
 *
 * Main entry point for audience members to join a presentation session.
 * Features:
 * - Code input with auto-formatting (uppercase, max 6 chars)
 * - Submit button disabled until 6 characters
 * - Navigate to appropriate screen based on session status
 */

import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSessionByCode, SessionJoinInfo } from '@/api/sessions'
import { AxiosError } from 'axios'
import styles from './JoinPage.module.css'

export function JoinPage() {
  const navigate = useNavigate()
  const { code: urlCode } = useParams<{ code?: string }>()

  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If code is in URL, auto-submit
  useEffect(() => {
    if (urlCode && urlCode.length === 6) {
      setCode(urlCode.toUpperCase())
      handleJoin(urlCode)
    }
  }, [urlCode])

  const handleCodeChange = (value: string) => {
    // Auto-capitalize and limit to 6 alphanumeric characters
    const formatted = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)
    setCode(formatted)
    setError(null)
  }

  const handleJoin = async (joinCode: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const session = await getSessionByCode(joinCode)
      navigateToSession(session)
    } catch (err) {
      const axiosError = err as AxiosError<{ detail: string }>
      if (axiosError.response?.status === 404) {
        setError('Session not found. Please check your code and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToSession = (session: SessionJoinInfo) => {
    // Navigate based on session status
    switch (session.status) {
      case 'pending':
        navigate('/join/waiting', { state: { session } })
        break
      case 'active':
        // For now, go to name entry (audience view is EPIC 12)
        navigate('/join/name', { state: { session } })
        break
      case 'paused':
        navigate('/join/waiting', { state: { session, isPaused: true } })
        break
      case 'ended':
        navigate('/join/ended', { state: { session } })
        break
      default:
        navigate('/join/not-found')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      handleJoin(code)
    }
  }

  const isValid = code.length === 6

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Join Session</h1>
        <p className={styles.subtitle}>Enter the 6-character code to join</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.codeInputWrapper}>
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="ABC123"
              className={styles.codeInput}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Joining...' : 'Join'}
          </button>
        </form>

        <p className={styles.hint}>
          The code is displayed on the presenter's screen
        </p>
      </div>
    </div>
  )
}

export default JoinPage
