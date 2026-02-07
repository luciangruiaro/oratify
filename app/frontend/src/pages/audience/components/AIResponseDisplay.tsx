/**
 * AI Response Display Component
 *
 * Renders AI-generated answers in the audience view.
 * Supports streaming responses with progressive text reveal
 * and a typing indicator for loading state.
 */

import type { AIResponse } from '../../../hooks/useWebSocket'
import styles from './AIResponseDisplay.module.css'

interface AIResponseDisplayProps {
  response: AIResponse | null
  isLoading: boolean
}

export function AIResponseDisplay({
  response,
  isLoading,
}: AIResponseDisplayProps) {
  if (!response && !isLoading) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>AI</span>
        {response?.question_text && (
          <span className={styles.question}>{response.question_text}</span>
        )}
      </div>

      {isLoading && !response?.response_text ? (
        <div className={styles.typing}>
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      ) : (
        <div className={styles.responseText}>
          {response?.response_text}
          {response?.is_streaming && !response.is_complete && (
            <span className={styles.cursor} />
          )}
        </div>
      )}
    </div>
  )
}
