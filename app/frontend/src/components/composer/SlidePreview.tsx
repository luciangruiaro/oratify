/**
 * Slide Preview Component
 *
 * Renders a slide in preview mode (as it would appear during presentation).
 */

import { Slide } from '@/api/slides'
import styles from './SlidePreview.module.css'

interface SlidePreviewProps {
  slide: Slide
}

export function SlidePreview({ slide }: SlidePreviewProps) {
  const renderContent = () => {
    switch (slide.type) {
      case 'content':
        return <ContentPreview content={slide.content} />
      case 'question_text':
        return <QuestionTextPreview content={slide.content} />
      case 'question_choice':
        return <QuestionChoicePreview content={slide.content} />
      case 'summary':
        return <SummaryPreview content={slide.content} />
      case 'conclusion':
        return <ConclusionPreview content={slide.content} />
      default:
        return <div className={styles.unsupported}>Unknown slide type</div>
    }
  }

  return (
    <div className={styles.preview}>
      <div className={styles.slide}>{renderContent()}</div>
    </div>
  )
}

// Sub-components for each slide type
function ContentPreview({ content }: { content: Record<string, unknown> }) {
  const text = (content.text as string) || ''
  const imageUrl = content.image_url as string | null
  const layout = (content.layout as string) || 'text-only'

  return (
    <div className={`${styles.contentSlide} ${styles[`layout-${layout}`]}`}>
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt="Slide content" />
        </div>
      )}
      {text && (
        <div className={styles.textContainer}>
          <p className={styles.text}>{text}</p>
        </div>
      )}
      {!text && !imageUrl && (
        <div className={styles.empty}>
          <p>Empty slide</p>
        </div>
      )}
    </div>
  )
}

function QuestionTextPreview({ content }: { content: Record<string, unknown> }) {
  const question = (content.question as string) || ''
  const placeholder = (content.placeholder as string) || 'Type your answer...'
  const required = content.required as boolean

  return (
    <div className={styles.questionSlide}>
      <h2 className={styles.question}>
        {question}
        {required && <span className={styles.required}>*</span>}
      </h2>
      <div className={styles.answerBox}>
        <p className={styles.placeholder}>{placeholder}</p>
      </div>
    </div>
  )
}

function QuestionChoicePreview({ content }: { content: Record<string, unknown> }) {
  const question = (content.question as string) || ''
  const options = (content.options as { id: string; text: string; order: number }[]) || []
  const allowMultiple = content.allow_multiple as boolean

  return (
    <div className={styles.questionSlide}>
      <h2 className={styles.question}>{question}</h2>
      <div className={styles.options}>
        {options.map((option, index) => (
          <div key={option.id} className={styles.option}>
            <span className={styles.optionLetter}>
              {String.fromCharCode(65 + index)}
            </span>
            <span className={styles.optionText}>{option.text}</span>
            <input
              type={allowMultiple ? 'checkbox' : 'radio'}
              name="preview-choice"
              disabled
            />
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryPreview({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Summary'
  const summaryText = content.summary_text as string | null
  const autoGenerate = content.auto_generate as boolean

  return (
    <div className={styles.summarySlide}>
      <h2 className={styles.slideTitle}>{title}</h2>
      {autoGenerate ? (
        <div className={styles.aiContent}>
          <span className={styles.aiIcon}>S</span>
          <p>AI-generated summary will appear here</p>
        </div>
      ) : (
        <p className={styles.summaryText}>{summaryText || 'No summary content'}</p>
      )}
    </div>
  )
}

function ConclusionPreview({ content }: { content: Record<string, unknown> }) {
  const title = (content.title as string) || 'Key Takeaways'
  const conclusions = (content.conclusions as string[]) || []
  const autoGenerate = content.auto_generate as boolean
  const thankYouMessage = content.thank_you_message as string | null

  return (
    <div className={styles.conclusionSlide}>
      <h2 className={styles.slideTitle}>{title}</h2>
      {autoGenerate ? (
        <div className={styles.aiContent}>
          <span className={styles.aiIcon}>C</span>
          <p>AI-generated conclusions will appear here</p>
        </div>
      ) : (
        <ul className={styles.conclusions}>
          {conclusions.map((conclusion, index) => (
            <li key={index}>{conclusion}</li>
          ))}
          {conclusions.length === 0 && (
            <li className={styles.empty}>No conclusions added</li>
          )}
        </ul>
      )}
      {thankYouMessage && (
        <p className={styles.thankYou}>{thankYouMessage}</p>
      )}
    </div>
  )
}

export default SlidePreview
