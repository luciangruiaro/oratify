/**
 * Slide Thumbnail Component
 *
 * Displays a compact preview of a slide in the sidebar.
 * Shows:
 * - Slide number
 * - Type icon
 * - Content preview
 * - Selection state
 */

import { memo } from 'react'
import { Slide, SlideType } from '@/api/slides'
import styles from './SlideThumbnail.module.css'

interface SlideThumbnailProps {
  slide: Slide
  index: number
  isSelected: boolean
  isDragging?: boolean
  onClick: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

// Icons for each slide type
const SLIDE_TYPE_ICONS: Record<SlideType, string> = {
  content: 'T',
  question_text: '?',
  question_choice: 'A',
  summary: 'S',
  conclusion: 'C',
}

const SLIDE_TYPE_LABELS: Record<SlideType, string> = {
  content: 'Content',
  question_text: 'Text Question',
  question_choice: 'Multiple Choice',
  summary: 'Summary',
  conclusion: 'Conclusion',
}

function getSlidePreview(slide: Slide): string {
  const content = slide.content
  switch (slide.type) {
    case 'content':
      return (content.text as string) || 'Empty content slide'
    case 'question_text':
    case 'question_choice':
      return (content.question as string) || 'Empty question'
    case 'summary':
      return (content.title as string) || 'Summary'
    case 'conclusion':
      return (content.title as string) || 'Conclusion'
    default:
      return 'Slide'
  }
}

export const SlideThumbnail = memo(function SlideThumbnail({
  slide,
  index,
  isSelected,
  isDragging = false,
  onClick,
  onDelete,
  onDuplicate,
}: SlideThumbnailProps) {
  const preview = getSlidePreview(slide)
  const typeIcon = SLIDE_TYPE_ICONS[slide.type]
  const typeLabel = SLIDE_TYPE_LABELS[slide.type]

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // Context menu handled by parent
  }

  return (
    <div
      className={`${styles.thumbnail} ${isSelected ? styles.selected : ''} ${
        isDragging ? styles.dragging : ''
      }`}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Slide ${index + 1}: ${typeLabel}`}
    >
      <div className={styles.header}>
        <span className={styles.number}>{index + 1}</span>
        <span className={styles.typeIcon} title={typeLabel}>
          {typeIcon}
        </span>
      </div>

      <div className={styles.preview}>
        {slide.type === 'content' &&
          typeof slide.content.image_url === 'string' &&
          slide.content.image_url && (
            <div className={styles.imagePreview}>
              <img
                src={slide.content.image_url}
                alt="Slide preview"
                loading="lazy"
              />
            </div>
          )}
        <p className={styles.previewText}>{preview}</p>
      </div>

      <div className={styles.actions}>
        {onDuplicate && (
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate()
            }}
            title="Duplicate slide"
            aria-label="Duplicate slide"
          >
            <span>+</span>
          </button>
        )}
        {onDelete && (
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            title="Delete slide"
            aria-label="Delete slide"
          >
            <span>&times;</span>
          </button>
        )}
      </div>
    </div>
  )
})

export default SlideThumbnail
