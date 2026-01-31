/**
 * Conclusion Slide Editor
 *
 * Editor for conclusion slides with:
 * - Title
 * - Key takeaways list
 * - Thank you message
 * - Auto-generate toggle
 */

import { useState, useCallback } from 'react'
import styles from './ConclusionEditor.module.css'

interface ConclusionEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

export function ConclusionEditor({
  content,
  onChange,
  disabled = false,
}: ConclusionEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const title = (content.title as string) || 'Key Takeaways'
  const conclusions = (content.conclusions as string[]) || []
  const autoGenerate = (content.auto_generate as boolean) || false
  const thankYouMessage = (content.thank_you_message as string) || ''

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, title: e.target.value })
    },
    [content, onChange]
  )

  const handleConclusionChange = useCallback(
    (index: number, text: string) => {
      const newConclusions = [...conclusions]
      newConclusions[index] = text
      onChange({ ...content, conclusions: newConclusions })
    },
    [content, conclusions, onChange]
  )

  const handleAddConclusion = useCallback(() => {
    if (conclusions.length >= 10) return
    onChange({ ...content, conclusions: [...conclusions, ''] })
  }, [content, conclusions, onChange])

  const handleRemoveConclusion = useCallback(
    (index: number) => {
      const newConclusions = conclusions.filter((_, i) => i !== index)
      onChange({ ...content, conclusions: newConclusions })
    },
    [content, conclusions, onChange]
  )

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newConclusions = [...conclusions]
    const draggedItem = newConclusions[draggedIndex]
    newConclusions.splice(draggedIndex, 1)
    newConclusions.splice(index, 0, draggedItem)

    setDraggedIndex(index)
    onChange({ ...content, conclusions: newConclusions })
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleAutoGenerateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, auto_generate: e.target.checked })
    },
    [content, onChange]
  )

  const handleThankYouChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, thank_you_message: e.target.value || null })
    },
    [content, onChange]
  )

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="conclusion-title">
          Title
        </label>
        <input
          id="conclusion-title"
          type="text"
          className={styles.titleInput}
          value={title}
          onChange={handleTitleChange}
          placeholder="Key Takeaways"
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
          <span>Auto-generate conclusions using AI</span>
        </label>
        {autoGenerate && (
          <p className={styles.hint}>
            The AI will analyze the session and generate key takeaways.
          </p>
        )}
      </div>

      {/* Conclusions List */}
      {!autoGenerate && (
        <div className={styles.section}>
          <label className={styles.label}>
            Key Takeaways ({conclusions.length}/10)
          </label>
          <div className={styles.conclusionsList}>
            {conclusions.map((conclusion, index) => (
              <div
                key={index}
                className={`${styles.conclusionItem} ${
                  draggedIndex === index ? styles.dragging : ''
                }`}
                draggable={!disabled}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <span className={styles.dragHandle} title="Drag to reorder">
                  &#9776;
                </span>
                <span className={styles.bulletPoint}>{index + 1}</span>
                <input
                  type="text"
                  className={styles.conclusionInput}
                  value={conclusion}
                  onChange={(e) => handleConclusionChange(index, e.target.value)}
                  placeholder={`Takeaway ${index + 1}`}
                  disabled={disabled}
                  maxLength={500}
                />
                <button
                  className={styles.removeConclusion}
                  onClick={() => handleRemoveConclusion(index)}
                  disabled={disabled}
                  title="Remove takeaway"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          {conclusions.length < 10 && (
            <button
              className={styles.addConclusion}
              onClick={handleAddConclusion}
              disabled={disabled}
            >
              + Add Takeaway
            </button>
          )}
        </div>
      )}

      {/* Thank You Message */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="thank-you">
          Thank You Message (optional)
        </label>
        <input
          id="thank-you"
          type="text"
          className={styles.textInput}
          value={thankYouMessage}
          onChange={handleThankYouChange}
          placeholder="Thank you for participating!"
          disabled={disabled}
          maxLength={500}
        />
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewLabel}>Preview</div>
        <div className={styles.previewContent}>
          <h2 className={styles.previewTitle}>{title || 'Key Takeaways'}</h2>
          {autoGenerate ? (
            <div className={styles.aiPlaceholder}>
              <span className={styles.aiIcon}>C</span>
              <p>AI-generated conclusions will appear here during the live session</p>
            </div>
          ) : (
            <ul className={styles.previewList}>
              {conclusions.length > 0 ? (
                conclusions.map((conclusion, index) => (
                  <li key={index}>{conclusion || `Takeaway ${index + 1}`}</li>
                ))
              ) : (
                <li className={styles.placeholder}>Add your key takeaways above</li>
              )}
            </ul>
          )}
          {thankYouMessage && (
            <p className={styles.previewThankYou}>{thankYouMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConclusionEditor
