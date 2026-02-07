/**
 * Content Slide Display Component
 *
 * Renders content slides (text + optional image) for the audience view.
 * Mobile-optimized with scrollable text area.
 */

import styles from './ContentSlideDisplay.module.css'

interface ContentSlideDisplayProps {
  content: Record<string, unknown>
}

export function ContentSlideDisplay({ content }: ContentSlideDisplayProps) {
  return (
    <div className={styles.container}>
      {typeof content.image_url === 'string' && content.image_url && (
        <div className={styles.imageContainer}>
          <img
            src={content.image_url}
            alt="Slide image"
            className={styles.image}
          />
        </div>
      )}
      {typeof content.text === 'string' && content.text && (
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: content.text }}
        />
      )}
    </div>
  )
}
