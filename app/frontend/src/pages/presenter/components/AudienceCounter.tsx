/**
 * Audience Counter Component
 *
 * Displays the number of connected audience members.
 */

import styles from './AudienceCounter.module.css'

interface AudienceCounterProps {
  count: number
}

export function AudienceCounter({ count }: AudienceCounterProps) {
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <span className={styles.count}>{count}</span>
      <span className={styles.label}>
        {count === 1 ? 'participant' : 'participants'}
      </span>
    </div>
  )
}

export default AudienceCounter
