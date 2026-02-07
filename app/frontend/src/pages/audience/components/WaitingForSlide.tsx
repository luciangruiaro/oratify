/**
 * Waiting for Slide Component
 *
 * Shown during slide transitions or when no current slide is available.
 * Displays an animated waiting indicator.
 */

import styles from './WaitingForSlide.module.css'

interface WaitingForSlideProps {
  message?: string
}

export function WaitingForSlide({
  message = 'Waiting for presenter...',
}: WaitingForSlideProps) {
  return (
    <div className={styles.container}>
      <div className={styles.dots}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
      <p className={styles.message}>{message}</p>
    </div>
  )
}
