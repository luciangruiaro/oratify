/**
 * Response Feed Component
 *
 * Real-time feed of audience responses and questions.
 */

import styles from './ResponseFeed.module.css'

interface ResponseItem {
  response_id: string
  slide_id: string
  participant_id: string | null
  display_name: string | null
  content: Record<string, unknown>
  created_at: string
}

interface QuestionItem {
  question_id: string
  slide_id: string
  participant_id: string | null
  display_name: string | null
  question_text: string
  created_at: string
}

interface ResponseFeedProps {
  responses: ResponseItem[]
  questions: QuestionItem[]
  currentSlideId?: string
}

export function ResponseFeed({
  responses,
  questions,
  currentSlideId,
}: ResponseFeedProps) {
  // Combine and sort responses and questions by time
  const allItems = [
    ...responses.map(r => ({ ...r, itemType: 'response' as const })),
    ...questions.map(q => ({ ...q, itemType: 'question' as const })),
  ].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime()
    const timeB = new Date(b.created_at).getTime()
    return timeB - timeA // Most recent first
  })

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderResponseContent = (content: Record<string, unknown>) => {
    // Handle multiple choice
    if (content.selected) {
      const selected = content.selected
      if (Array.isArray(selected)) {
        return <span className={styles.choiceValue}>Selected: {selected.join(', ')}</span>
      }
      return <span className={styles.choiceValue}>Selected: {selected as string}</span>
    }

    // Handle text response
    if (content.text) {
      return <span className={styles.textValue}>{content.text as string}</span>
    }

    // Fallback
    return <span className={styles.textValue}>{JSON.stringify(content)}</span>
  }

  if (allItems.length === 0) {
    return (
      <div className={styles.empty}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>No responses yet</p>
        <span>Responses will appear here in real-time</span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {allItems.map((item) => (
        <div
          key={item.itemType === 'response' ? item.response_id : item.question_id}
          className={`${styles.item} ${item.itemType === 'question' ? styles.question : ''}`}
        >
          <div className={styles.itemHeader}>
            <span className={styles.author}>
              {item.display_name || 'Anonymous'}
            </span>
            <span className={styles.time}>{formatTime(item.created_at)}</span>
          </div>

          <div className={styles.itemContent}>
            {item.itemType === 'response' ? (
              renderResponseContent((item as ResponseItem).content)
            ) : (
              <div className={styles.questionContent}>
                <span className={styles.questionLabel}>Q:</span>
                <span>{(item as QuestionItem).question_text}</span>
              </div>
            )}
          </div>

          {item.slide_id === currentSlideId && (
            <span className={styles.currentSlideTag}>Current slide</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default ResponseFeed
