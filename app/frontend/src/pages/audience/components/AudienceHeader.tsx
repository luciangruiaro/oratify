/**
 * Audience Header Component
 *
 * Displays presentation title, slide counter, and connection status
 * in the audience view.
 */

import { ConnectionStatus } from '../../../components/common/ConnectionStatus'
import styles from './AudienceHeader.module.css'

interface AudienceHeaderProps {
  presentationTitle: string
  currentSlideIndex: number
  totalSlides: number
  isConnected: boolean
  sessionStatus: string
}

export function AudienceHeader({
  presentationTitle,
  currentSlideIndex,
  totalSlides,
  isConnected,
  sessionStatus,
}: AudienceHeaderProps) {
  const getStatusLabel = () => {
    switch (sessionStatus) {
      case 'active':
        return 'Live'
      case 'paused':
        return 'Paused'
      case 'ended':
        return 'Ended'
      default:
        return 'Waiting'
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

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{presentationTitle}</h1>
        <span className={`${styles.status} ${getStatusClass()}`}>
          {sessionStatus === 'active' && <span className={styles.liveDot} />}
          {getStatusLabel()}
        </span>
      </div>
      <div className={styles.right}>
        {totalSlides > 0 && (
          <span className={styles.slideCounter}>
            {currentSlideIndex + 1}/{totalSlides}
          </span>
        )}
        <ConnectionStatus isConnected={isConnected} size="small" />
      </div>
    </header>
  )
}
