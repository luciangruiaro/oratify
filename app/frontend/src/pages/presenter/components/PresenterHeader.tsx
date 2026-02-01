/**
 * Presenter Header Component
 *
 * Displays presentation title, session status, and navigation controls.
 */

import styles from './PresenterHeader.module.css'

interface PresenterHeaderProps {
  presentationTitle: string
  sessionStatus: 'pending' | 'active' | 'paused' | 'ended'
  onBack: () => void
  isFullScreen: boolean
}

export function PresenterHeader({
  presentationTitle,
  sessionStatus,
  onBack,
  isFullScreen,
}: PresenterHeaderProps) {
  const getStatusLabel = () => {
    switch (sessionStatus) {
      case 'pending':
        return 'Not Started'
      case 'active':
        return 'Live'
      case 'paused':
        return 'Paused'
      case 'ended':
        return 'Ended'
      default:
        return sessionStatus
    }
  }

  const getStatusClass = () => {
    switch (sessionStatus) {
      case 'active':
        return styles.statusLive
      case 'paused':
        return styles.statusPaused
      case 'ended':
        return styles.statusEnded
      default:
        return styles.statusPending
    }
  }

  if (isFullScreen) {
    return null
  }

  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className={styles.titleSection}>
        <h1 className={styles.title}>{presentationTitle}</h1>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {sessionStatus === 'active' && (
            <span className={styles.liveDot} />
          )}
          {getStatusLabel()}
        </span>
      </div>

      <div className={styles.spacer} />
    </header>
  )
}

export default PresenterHeader
