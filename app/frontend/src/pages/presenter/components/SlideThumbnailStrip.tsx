/**
 * Slide Thumbnail Strip Component
 *
 * Horizontal scrollable strip of slide thumbnails for quick navigation.
 */

import { useEffect, useRef } from 'react'
import styles from './SlideThumbnailStrip.module.css'

interface SlideData {
  id: string
  type: string
  content: Record<string, unknown>
  order_index: number
}

interface SlideThumbnailStripProps {
  slides: SlideData[]
  currentIndex: number
  onSelect: (index: number) => void
}

export function SlideThumbnailStrip({
  slides,
  currentIndex,
  onSelect,
}: SlideThumbnailStripProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current
      const active = activeRef.current
      const containerRect = container.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()

      if (activeRect.left < containerRect.left || activeRect.right > containerRect.right) {
        active.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [currentIndex])

  const getSlideIcon = (type: string) => {
    switch (type) {
      case 'content':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
          </svg>
        )
      case 'question_text':
      case 'question_choice':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        )
      case 'summary':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </svg>
        )
      case 'conclusion':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )
    }
  }

  const getSlidePreview = (slide: SlideData) => {
    const content = slide.content

    switch (slide.type) {
      case 'content':
        return (content.text as string)?.slice(0, 30) || 'Content slide'
      case 'question_text':
      case 'question_choice':
        return (content.question as string)?.slice(0, 30) || 'Question'
      case 'summary':
        return (content.title as string) || 'Summary'
      case 'conclusion':
        return (content.title as string) || 'Conclusion'
      default:
        return slide.type
    }
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {slides.map((slide, index) => (
        <button
          key={slide.id}
          ref={index === currentIndex ? activeRef : null}
          className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
          onClick={() => onSelect(index)}
          title={`Go to slide ${index + 1}`}
        >
          <span className={styles.number}>{index + 1}</span>
          <span className={styles.icon}>{getSlideIcon(slide.type)}</span>
          <span className={styles.preview}>{getSlidePreview(slide)}</span>
        </button>
      ))}
    </div>
  )
}

export default SlideThumbnailStrip
