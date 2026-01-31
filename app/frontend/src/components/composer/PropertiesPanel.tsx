/**
 * Properties Panel Component
 *
 * Side panel showing:
 * - Slide type info
 * - Speaker notes (presentation-level)
 * - Slide-specific settings
 */

import { useCallback } from 'react'
import { Slide, SlideType } from '@/api/slides'
import styles from './PropertiesPanel.module.css'

interface PropertiesPanelProps {
  slide: Slide | null
  speakerNotes: string
  onSpeakerNotesChange: (notes: string) => void
  disabled?: boolean
}

const SLIDE_TYPE_INFO: Record<SlideType, { label: string; description: string }> = {
  content: {
    label: 'Content Slide',
    description: 'Display text and/or images to your audience.',
  },
  question_text: {
    label: 'Text Question',
    description: 'Collect free-text responses from your audience.',
  },
  question_choice: {
    label: 'Multiple Choice',
    description: 'Run a poll with predefined options.',
  },
  summary: {
    label: 'Summary Slide',
    description: 'Display a summary of audience responses.',
  },
  conclusion: {
    label: 'Conclusion Slide',
    description: 'Present key takeaways from your session.',
  },
}

export function PropertiesPanel({
  slide,
  speakerNotes,
  onSpeakerNotesChange,
  disabled = false,
}: PropertiesPanelProps) {
  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onSpeakerNotesChange(e.target.value)
    },
    [onSpeakerNotesChange]
  )

  return (
    <div className={styles.panel}>
      {/* Slide Info */}
      {slide && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Slide Type</h3>
          <div className={styles.typeInfo}>
            <span className={styles.typeLabel}>
              {SLIDE_TYPE_INFO[slide.type].label}
            </span>
            <p className={styles.typeDescription}>
              {SLIDE_TYPE_INFO[slide.type].description}
            </p>
          </div>
        </section>
      )}

      {/* Speaker Notes */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Speaker Notes</h3>
        <p className={styles.sectionHint}>
          Notes for yourself during the presentation. These are also used as context
          for AI-powered features.
        </p>
        <textarea
          className={styles.notesInput}
          value={speakerNotes}
          onChange={handleNotesChange}
          placeholder="Add notes for this presentation..."
          disabled={disabled}
          rows={8}
        />
      </section>

      {/* Keyboard Shortcuts */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Keyboard Shortcuts</h3>
        <div className={styles.shortcuts}>
          <div className={styles.shortcut}>
            <kbd>Ctrl+S</kbd>
            <span>Save changes</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>Ctrl+D</kbd>
            <span>Duplicate slide</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>Delete</kbd>
            <span>Delete slide</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>Ctrl+P</kbd>
            <span>Toggle preview</span>
          </div>
          <div className={styles.shortcut}>
            <kbd>&uarr; / &darr;</kbd>
            <span>Navigate slides</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PropertiesPanel
