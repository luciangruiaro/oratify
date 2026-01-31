/**
 * Save Status Indicator
 *
 * Displays the current save status of the presentation.
 */

import { SaveStatus } from '@/features/slides/slidesSlice'
import styles from './SaveStatusIndicator.module.css'

interface SaveStatusIndicatorProps {
  status: SaveStatus
  lastSaved: string | null
}

function formatLastSaved(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)

  if (diffMinutes < 1) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

export function SaveStatusIndicator({ status, lastSaved }: SaveStatusIndicatorProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'saved':
        return '✓'
      case 'saving':
        return '⟳'
      case 'unsaved':
        return '●'
      case 'error':
        return '!'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'saved':
        return lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : 'Saved'
      case 'saving':
        return 'Saving...'
      case 'unsaved':
        return 'Unsaved changes'
      case 'error':
        return 'Save failed'
    }
  }

  return (
    <div className={`${styles.indicator} ${styles[status]}`}>
      <span className={styles.icon}>{getStatusIcon()}</span>
      <span className={styles.text}>{getStatusText()}</span>
    </div>
  )
}

export default SaveStatusIndicator
