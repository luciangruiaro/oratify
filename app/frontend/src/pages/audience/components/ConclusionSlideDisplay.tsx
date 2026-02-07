/**
 * Conclusion Slide Display Component
 *
 * Renders conclusion slides for the audience view.
 * Shows title, conclusions list, and optional thank you message.
 */

import styles from './ConclusionSlideDisplay.module.css'

interface ConclusionSlideDisplayProps {
  content: Record<string, unknown>
}

export function ConclusionSlideDisplay({
  content,
}: ConclusionSlideDisplayProps) {
  const title =
    typeof content.title === 'string' ? content.title : 'Key Takeaways'
  const conclusions = (content.conclusions as string[]) || []
  const thankYou =
    typeof content.thank_you_message === 'string'
      ? content.thank_you_message
      : null

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>

      {conclusions.length > 0 ? (
        <ul className={styles.list}>
          {conclusions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.placeholder}>
          {content.auto_generate
            ? 'AI-generated conclusions will appear shortly...'
            : 'No conclusions available.'}
        </p>
      )}

      {thankYou && <p className={styles.thankYou}>{thankYou}</p>}
    </div>
  )
}
