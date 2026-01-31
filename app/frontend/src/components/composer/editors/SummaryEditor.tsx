/**
 * Summary Slide Editor
 *
 * Editor for summary slides with:
 * - Title
 * - Summary text (manual or auto-generated)
 * - Auto-generate toggle
 * - Slide selection for summary
 */

import { useCallback } from 'react'
import styles from './SummaryEditor.module.css'

interface SummaryEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

export function SummaryEditor({ content, onChange, disabled = false }: SummaryEditorProps) {
  const title = (content.title as string) || 'Summary'
  const summaryText = (content.summary_text as string) || ''
  const autoGenerate = (content.auto_generate as boolean) ?? true

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, title: e.target.value })
    },
    [content, onChange]
  )

  const handleSummaryTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...content, summary_text: e.target.value || null })
    },
    [content, onChange]
  )

  const handleAutoGenerateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, auto_generate: e.target.checked })
    },
    [content, onChange]
  )

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="summary-title">
          Title
        </label>
        <input
          id="summary-title"
          type="text"
          className={styles.titleInput}
          value={title}
          onChange={handleTitleChange}
          placeholder="Summary"
          disabled={disabled}
          maxLength={200}
        />
      </div>

      {/* Auto-generate Toggle */}
      <div className={styles.toggleSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={handleAutoGenerateChange}
            disabled={disabled}
          />
          <span>Auto-generate summary using AI</span>
        </label>
        {autoGenerate && (
          <p className={styles.hint}>
            The AI will analyze audience responses and generate a summary during the
            live session.
          </p>
        )}
      </div>

      {/* Manual Summary Text */}
      {!autoGenerate && (
        <div className={styles.section}>
          <label className={styles.label} htmlFor="summary-text">
            Summary Content
          </label>
          <textarea
            id="summary-text"
            className={styles.textInput}
            value={summaryText}
            onChange={handleSummaryTextChange}
            placeholder="Enter your summary content here..."
            disabled={disabled}
            rows={8}
            maxLength={10000}
          />
        </div>
      )}

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewLabel}>Preview</div>
        <div className={styles.previewContent}>
          <h2 className={styles.previewTitle}>{title || 'Summary'}</h2>
          {autoGenerate ? (
            <div className={styles.aiPlaceholder}>
              <span className={styles.aiIcon}>S</span>
              <p>AI-generated summary will appear here during the live session</p>
            </div>
          ) : (
            <p className={styles.previewText}>
              {summaryText || 'Your summary content will appear here'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummaryEditor
