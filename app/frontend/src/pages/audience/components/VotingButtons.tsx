/**
 * Voting Buttons Component
 *
 * Shown for question_choice slide types. Renders options as
 * large tappable buttons. Shows live vote counts after voting.
 */

import { triggerHaptic } from '../../../utils/haptic'
import styles from './VotingButtons.module.css'

interface VoteOption {
  id: string
  text: string
  order: number
}

interface VotingButtonsProps {
  question: string
  options: VoteOption[]
  hasResponded: boolean
  selectedOptionId: string | null
  voteCounts: Record<string, number> | null
  totalVotes: number
  onVote: (optionId: string) => void
}

export function VotingButtons({
  question,
  options,
  hasResponded,
  selectedOptionId,
  voteCounts,
  totalVotes,
  onVote,
}: VotingButtonsProps) {
  const sortedOptions = [...options].sort((a, b) => a.order - b.order)

  const handleVote = (optionId: string) => {
    if (hasResponded) return
    triggerHaptic('medium')
    onVote(optionId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.questionIcon}>?</div>
      <h2 className={styles.question}>{question}</h2>

      <div className={styles.options}>
        {sortedOptions.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx)
          const isSelected = selectedOptionId === opt.id
          const count = voteCounts?.[opt.id] || 0
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

          return (
            <button
              key={opt.id}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${hasResponded ? styles.optionDisabled : ''}`}
              onClick={() => handleVote(opt.id)}
              disabled={hasResponded}
            >
              <span className={`${styles.letter} ${isSelected ? styles.letterSelected : ''}`}>
                {letter}
              </span>
              <span className={styles.optionText}>{opt.text}</span>
              {hasResponded && voteCounts && (
                <span className={styles.voteCount}>{percentage}%</span>
              )}
              {hasResponded && voteCounts && (
                <div
                  className={styles.voteBar}
                  style={{ width: `${percentage}%` }}
                />
              )}
            </button>
          )
        })}
      </div>

      {hasResponded && (
        <p className={styles.totalVotes}>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </p>
      )}
    </div>
  )
}
