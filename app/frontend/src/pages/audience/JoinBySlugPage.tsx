/**
 * Join By Slug Page
 *
 * Handles /s/:slug routes for joining by presentation slug.
 * Looks up active session for the presentation and redirects to join flow.
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSessionBySlug, SessionJoinInfo } from '@/api/sessions'
import { AxiosError } from 'axios'
import styles from './JoinBySlugPage.module.css'

export function JoinBySlugPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      navigate('/join', { replace: true })
      return
    }

    const lookupSession = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const session = await getSessionBySlug(slug)
        navigateToSession(session)
      } catch (err) {
        const axiosError = err as AxiosError<{ detail: string }>
        if (axiosError.response?.status === 404) {
          setError('No active session found for this presentation.')
        } else {
          setError('Something went wrong. Please try again.')
        }
        setIsLoading(false)
      }
    }

    lookupSession()
  }, [slug])

  const navigateToSession = (session: SessionJoinInfo) => {
    switch (session.status) {
      case 'pending':
        navigate('/join/waiting', { state: { session }, replace: true })
        break
      case 'active':
        navigate('/join/name', { state: { session }, replace: true })
        break
      case 'paused':
        navigate('/join/waiting', {
          state: { session, isPaused: true },
          replace: true,
        })
        break
      case 'ended':
        navigate('/join/ended', { state: { session }, replace: true })
        break
      default:
        navigate('/join/not-found', { replace: true })
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner} />
          <p className={styles.message}>Finding session...</p>
        </div>
      </div>
    )
  }

  if (error) {
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

          <h1 className={styles.title}>No Active Session</h1>
          <p className={styles.errorMessage}>{error}</p>

          <div className={styles.buttons}>
            <button
              className={styles.primaryButton}
              onClick={() => navigate('/join', { replace: true })}
            >
              Enter Code Manually
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default JoinBySlugPage
