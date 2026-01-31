/**
 * Question Text Editor
 *
 * Editor for free-text question slides with:
 * - Question text
 * - Placeholder text
 * - Max length setting
 * - Required toggle
 */

import { useCallback } from 'react'
import styles from './QuestionTextEditor.module.css'

interface QuestionTextEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

export function QuestionTextEditor({
  content,
  onChange,
  disabled = false,
}: QuestionTextEditorProps) {
  const question = (content.question as string) || ''
  const placeholder = (content.placeholder as string) || ''
  const maxLength = (content.max_length as number) || 500
  const required = (content.required as boolean) || false

  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...content, question: e.target.value })
    },
    [content, onChange]
  )

  const handlePlaceholderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, placeholder: e.target.value || null })
    },
    [content, onChange]
  )

  const handleMaxLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10)
      if (!isNaN(value) && value > 0 && value <= 5000) {
        onChange({ ...content, max_length: value })
      }
    },
    [content, onChange]
  )

  const handleRequiredChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, required: e.target.checked })
    },
    [content, onChange]
  )

  return (
    <div className={styles.container}>
      {/* Question */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="question-text">
          Question
        </label>
        <textarea
          id="question-text"
          className={styles.questionInput}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your question here..."
          disabled={disabled}
          rows={3}
          maxLength={500}
        />
        <span className={styles.charCount}>{question.length}/500</span>
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewLabel}>Preview</div>
        <div className={styles.previewContent}>
          <p className={styles.previewQuestion}>
            {question || 'Your question will appear here'}
            {required && <span className={styles.requiredBadge}>*</span>}
          </p>
          <textarea
            className={styles.previewAnswer}
            placeholder={placeholder || 'Audience response will go here...'}
            disabled
            rows={4}
          />
        </div>
      </div>

      {/* Settings */}
      <div className={styles.settings}>
        <div className={styles.settingItem}>
          <label className={styles.label} htmlFor="placeholder-text">
            Placeholder text
          </label>
          <input
            id="placeholder-text"
            type="text"
            className={styles.textInput}
            value={placeholder}
            onChange={handlePlaceholderChange}
            placeholder="Enter placeholder text..."
            disabled={disabled}
            maxLength={200}
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingItem}>
            <label className={styles.label} htmlFor="max-length">
              Max response length
            </label>
            <input
              id="max-length"
              type="number"
              className={styles.numberInput}
              value={maxLength}
              onChange={handleMaxLengthChange}
              min={1}
              max={5000}
              disabled={disabled}
            />
          </div>

          <div className={styles.settingItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={required}
                onChange={handleRequiredChange}
                disabled={disabled}
              />
              <span>Required response</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionTextEditor
