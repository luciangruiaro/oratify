/**
 * Session Timer Component
 *
 * Displays elapsed time since session started.
 */

import { useEffect, useState } from 'react'
import styles from './SessionTimer.module.css'

interface SessionTimerProps {
  startedAt: string | null
  status: 'pending' | 'active' | 'paused' | 'ended'
}

export function SessionTimer({ startedAt, status }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startedAt || status === 'pending') {
      setElapsed(0)
      return
    }

    const startTime = new Date(startedAt).getTime()

    const updateElapsed = () => {
      const now = Date.now()
      setElapsed(Math.floor((now - startTime) / 1000))
    }

    updateElapsed()

    if (status === 'active') {
      const interval = setInterval(updateElapsed, 1000)
      return () => clearInterval(interval)
    }
  }, [startedAt, status])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className={`${styles.time} ${status === 'paused' ? styles.paused : ''}`}>
        {formatTime(elapsed)}
      </span>
      {status === 'paused' && (
        <span className={styles.pausedLabel}>PAUSED</span>
      )}
    </div>
  )
}

export default SessionTimer
