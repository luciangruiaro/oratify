/**
 * Jump to Slide Modal Component
 *
 * Modal dialog for quickly navigating to a specific slide.
 */

import { useEffect, useRef, useState } from 'react'
import styles from './JumpToSlideModal.module.css'

interface SlideData {
  id: string
  type: string
  content: Record<string, unknown>
  order_index: number
}

interface JumpToSlideModalProps {
  slides: SlideData[]
  currentIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

export function JumpToSlideModal({
  slides,
  currentIndex,
  onSelect,
  onClose,
}: JumpToSlideModalProps) {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter') {
        const num = parseInt(search, 10)
        if (num >= 1 && num <= slides.length) {
          onSelect(num - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [search, slides.length, onSelect, onClose])

  const getSlidePreview = (slide: SlideData) => {
    const content = slide.content

    switch (slide.type) {
      case 'content':
        return (content.text as string)?.slice(0, 50) || 'Content slide'
      case 'question_text':
      case 'question_choice':
        return (content.question as string)?.slice(0, 50) || 'Question'
      case 'summary':
        return (content.title as string) || 'Summary'
      case 'conclusion':
        return (content.title as string) || 'Conclusion'
      default:
        return slide.type
    }
  }

  const filteredSlides = slides.filter((slide, idx) => {
    if (!search) return true
    const num = parseInt(search, 10)
    if (!isNaN(num)) {
      return idx + 1 === num
    }
    const preview = getSlidePreview(slide).toLowerCase()
    return preview.includes(search.toLowerCase())
  })

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Jump to Slide</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Enter slide number or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.slideList}>
          {filteredSlides.map((slide) => {
            const actualIndex = slides.indexOf(slide)
            return (
              <button
                key={slide.id}
                className={`${styles.slideItem} ${actualIndex === currentIndex ? styles.current : ''}`}
                onClick={() => onSelect(actualIndex)}
              >
                <span className={styles.slideNumber}>{actualIndex + 1}</span>
                <span className={styles.slideType}>{slide.type.replace('_', ' ')}</span>
                <span className={styles.slidePreview}>{getSlidePreview(slide)}</span>
                {actualIndex === currentIndex && (
                  <span className={styles.currentTag}>Current</span>
                )}
              </button>
            )
          })}

          {filteredSlides.length === 0 && (
            <div className={styles.noResults}>No matching slides</div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>
            Press <kbd>Enter</kbd> to go to slide • <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  )
}

export default JumpToSlideModal
