/**
 * Summary Slide Display Component
 *
 * Renders summary slides for the audience view.
 * Shows title and summary text, or a placeholder if auto_generate is pending.
 */

import styles from './SummarySlideDisplay.module.css'

interface SummarySlideDisplayProps {
  content: Record<string, unknown>
}

export function SummarySlideDisplay({ content }: SummarySlideDisplayProps) {
  const title = typeof content.title === 'string' ? content.title : 'Summary'
  const summaryText =
    typeof content.summary_text === 'string' ? content.summary_text : null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {summaryText ? (
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: summaryText }}
        />
      ) : (
        <p className={styles.placeholder}>
          {content.auto_generate
            ? 'AI-generated summary will appear shortly...'
            : 'No summary content available.'}
        </p>
      )}
    </div>
  )
}
