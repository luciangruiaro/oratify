/**
 * Slide Editor Component
 *
 * Main editor component that renders the appropriate editor based on slide type.
 */

import { Slide } from '@/api/slides'
import { ContentEditor } from './editors/ContentEditor'
import { QuestionTextEditor } from './editors/QuestionTextEditor'
import { QuestionChoiceEditor } from './editors/QuestionChoiceEditor'
import { SummaryEditor } from './editors/SummaryEditor'
import { ConclusionEditor } from './editors/ConclusionEditor'
import styles from './SlideEditor.module.css'

interface SlideEditorProps {
  slide: Slide
  onContentChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

export function SlideEditor({ slide, onContentChange, disabled = false }: SlideEditorProps) {
  const renderEditor = () => {
    switch (slide.type) {
      case 'content':
        return (
          <ContentEditor
            content={slide.content}
            onChange={onContentChange}
            disabled={disabled}
          />
        )
      case 'question_text':
        return (
          <QuestionTextEditor
            content={slide.content}
            onChange={onContentChange}
            disabled={disabled}
          />
        )
      case 'question_choice':
        return (
          <QuestionChoiceEditor
            content={slide.content}
            onChange={onContentChange}
            disabled={disabled}
          />
        )
      case 'summary':
        return (
          <SummaryEditor
            content={slide.content}
            onChange={onContentChange}
            disabled={disabled}
          />
        )
      case 'conclusion':
        return (
          <ConclusionEditor
            content={slide.content}
            onChange={onContentChange}
            disabled={disabled}
          />
        )
      default:
        return <div className={styles.unsupported}>Unsupported slide type</div>
    }
  }

  return <div className={styles.editor}>{renderEditor()}</div>
}

export default SlideEditor
