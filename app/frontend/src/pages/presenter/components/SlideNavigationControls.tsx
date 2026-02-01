/**
 * Slide Navigation Controls Component
 *
 * Provides prev/next buttons and jump to slide functionality.
 */

import styles from './SlideNavigationControls.module.css'

interface SlideNavigationControlsProps {
  currentIndex: number
  totalSlides: number
  onPrev: () => void
  onNext: () => void
  onJump: () => void
}

export function SlideNavigationControls({
  currentIndex,
  totalSlides,
  onPrev,
  onNext,
  onJump,
}: SlideNavigationControlsProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex >= totalSlides - 1

  return (
    <div className={styles.container}>
      <button
        className={styles.navButton}
        onClick={onPrev}
        disabled={isFirst}
        title="Previous slide (Left Arrow)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button
        className={styles.jumpButton}
        onClick={onJump}
        title="Jump to slide (G)"
      >
        <span className={styles.slideNumber}>{currentIndex + 1}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalSlides}>{totalSlides}</span>
      </button>

      <button
        className={styles.navButton}
        onClick={onNext}
        disabled={isLast}
        title="Next slide (Right Arrow)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}

export default SlideNavigationControls
