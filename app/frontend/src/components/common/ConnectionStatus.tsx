/**
 * Connection Status Indicator
 *
 * Displays WebSocket connection status with visual feedback.
 * Shows connected/disconnected state with optional reconnecting animation.
 *
 * Usage:
 *   <ConnectionStatus isConnected={true} />
 *   <ConnectionStatus isConnected={false} isReconnecting={true} />
 */

import styles from './ConnectionStatus.module.css'

interface ConnectionStatusProps {
  isConnected: boolean
  isReconnecting?: boolean
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function ConnectionStatus({
  isConnected,
  isReconnecting = false,
  showLabel = true,
  size = 'medium',
  className = '',
}: ConnectionStatusProps) {
  const getStatusText = () => {
    if (isConnected) return 'Connected'
    if (isReconnecting) return 'Reconnecting...'
    return 'Disconnected'
  }

  const getStatusClass = () => {
    if (isConnected) return styles.connected
    if (isReconnecting) return styles.reconnecting
    return styles.disconnected
  }

  return (
    <div
      className={`${styles.container} ${styles[size]} ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`${styles.indicator} ${getStatusClass()}`}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={styles.label}>{getStatusText()}</span>
      )}
    </div>
  )
}

export default ConnectionStatus
