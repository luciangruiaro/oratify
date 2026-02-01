/**
 * Session Controls Component
 *
 * Provides session lifecycle controls: start, pause/resume, end, fullscreen.
 */

import styles from './SessionControls.module.css'

interface SessionControlsProps {
  status: 'pending' | 'active' | 'paused' | 'ended'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
  onFullScreen: () => void
  isFullScreen: boolean
}

export function SessionControls({
  status,
  onStart,
  onPause,
  onResume,
  onEnd,
  onFullScreen,
  isFullScreen,
}: SessionControlsProps) {
  const isEnded = status === 'ended'

  return (
    <div className={styles.container}>
      {status === 'pending' && (
        <button className={styles.startButton} onClick={onStart}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start Session
        </button>
      )}

      {status === 'active' && (
        <button className={styles.pauseButton} onClick={onPause}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
          Pause
        </button>
      )}

      {status === 'paused' && (
        <button className={styles.resumeButton} onClick={onResume}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Resume
        </button>
      )}

      {(status === 'active' || status === 'paused') && (
        <button className={styles.endButton} onClick={onEnd}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          End Session
        </button>
      )}

      {isEnded && (
        <div className={styles.endedMessage}>
          Session has ended
        </div>
      )}

      <button
        className={styles.fullscreenButton}
        onClick={onFullScreen}
        title={isFullScreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
      >
        {isFullScreen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default SessionControls
