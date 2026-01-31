/**
 * Question Choice Editor
 *
 * Editor for multiple choice question slides with:
 * - Question text
 * - Options list with drag-and-drop reordering
 * - Allow multiple answers toggle
 * - Show results toggle
 */

import { useState, useCallback } from 'react'
import { ChoiceOption } from '@/api/slides'
import styles from './QuestionChoiceEditor.module.css'

interface QuestionChoiceEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

function generateOptionId(): string {
  return `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function QuestionChoiceEditor({
  content,
  onChange,
  disabled = false,
}: QuestionChoiceEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const question = (content.question as string) || ''
  const options = (content.options as ChoiceOption[]) || []
  const allowMultiple = (content.allow_multiple as boolean) || false
  const showResults = (content.show_results as boolean) ?? true

  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...content, question: e.target.value })
    },
    [content, onChange]
  )

  const handleOptionTextChange = useCallback(
    (index: number, text: string) => {
      const newOptions = [...options]
      newOptions[index] = { ...newOptions[index], text }
      onChange({ ...content, options: newOptions })
    },
    [content, options, onChange]
  )

  const handleAddOption = useCallback(() => {
    if (options.length >= 10) return
    const newOption: ChoiceOption = {
      id: generateOptionId(),
      text: `Option ${options.length + 1}`,
      order: options.length,
    }
    onChange({ ...content, options: [...options, newOption] })
  }, [content, options, onChange])

  const handleRemoveOption = useCallback(
    (index: number) => {
      if (options.length <= 2) return
      const newOptions = options
        .filter((_, i) => i !== index)
        .map((opt, i) => ({ ...opt, order: i }))
      onChange({ ...content, options: newOptions })
    },
    [content, options, onChange]
  )

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newOptions = [...options]
    const draggedItem = newOptions[draggedIndex]
    newOptions.splice(draggedIndex, 1)
    newOptions.splice(index, 0, draggedItem)
    newOptions.forEach((opt, i) => {
      opt.order = i
    })

    setDraggedIndex(index)
    onChange({ ...content, options: newOptions })
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleAllowMultipleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, allow_multiple: e.target.checked })
    },
    [content, onChange]
  )

  const handleShowResultsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...content, show_results: e.target.checked })
    },
    [content, onChange]
  )

  return (
    <div className={styles.container}>
      {/* Question */}
      <div className={styles.section}>
        <label className={styles.label} htmlFor="question-choice">
          Question
        </label>
        <textarea
          id="question-choice"
          className={styles.questionInput}
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter your poll question here..."
          disabled={disabled}
          rows={2}
          maxLength={500}
        />
        <span className={styles.charCount}>{question.length}/500</span>
      </div>

      {/* Options */}
      <div className={styles.section}>
        <label className={styles.label}>
          Options ({options.length}/10)
        </label>
        <div className={styles.optionsList}>
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`${styles.optionItem} ${
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
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              <input
                type="text"
                className={styles.optionInput}
                value={option.text}
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                disabled={disabled}
                maxLength={200}
              />
              <button
                className={styles.removeOption}
                onClick={() => handleRemoveOption(index)}
                disabled={disabled || options.length <= 2}
                title="Remove option"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        {options.length < 10 && (
          <button
            className={styles.addOption}
            onClick={handleAddOption}
            disabled={disabled}
          >
            + Add Option
          </button>
        )}
      </div>

      {/* Preview */}
      <div className={styles.preview}>
        <div className={styles.previewLabel}>Preview</div>
        <div className={styles.previewContent}>
          <p className={styles.previewQuestion}>
            {question || 'Your question will appear here'}
          </p>
          <div className={styles.previewOptions}>
            {options.map((option, index) => (
              <label key={option.id} className={styles.previewOption}>
                <input
                  type={allowMultiple ? 'checkbox' : 'radio'}
                  name="preview-option"
                  disabled
                />
                <span className={styles.previewOptionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className={styles.settings}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={allowMultiple}
            onChange={handleAllowMultipleChange}
            disabled={disabled}
          />
          <span>Allow multiple selections</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showResults}
            onChange={handleShowResultsChange}
            disabled={disabled}
          />
          <span>Show results to audience</span>
        </label>
      </div>
    </div>
  )
}

export default QuestionChoiceEditor
