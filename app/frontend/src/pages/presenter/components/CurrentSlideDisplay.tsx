/**
 * Current Slide Display Component
 *
 * Displays the current slide content in the presenter view.
 * Handles different slide types (content, question, summary, conclusion).
 */

import styles from './CurrentSlideDisplay.module.css'

interface SlideData {
  id: string
  type: string
  content: Record<string, unknown>
  order_index: number
}

interface CurrentSlideDisplayProps {
  slide: SlideData | null
  slideIndex: number
  totalSlides: number
}

export function CurrentSlideDisplay({
  slide,
  slideIndex,
  totalSlides,
}: CurrentSlideDisplayProps) {
  if (!slide) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No slide selected</p>
        </div>
      </div>
    )
  }

  const renderSlideContent = () => {
    const content = slide.content

    switch (slide.type) {
      case 'content':
        return (
          <div className={styles.contentSlide}>
            {typeof content.image_url === 'string' && content.image_url && (
              <div className={styles.imageContainer}>
                <img
                  src={content.image_url}
                  alt="Slide image"
                  className={styles.image}
                />
              </div>
            )}
            {typeof content.text === 'string' && content.text && (
              <div
                className={styles.text}
                dangerouslySetInnerHTML={{ __html: content.text }}
              />
            )}
          </div>
        )

      case 'question_text':
        return (
          <div className={styles.questionSlide}>
            <div className={styles.questionIcon}>?</div>
            <h2 className={styles.questionText}>{content.question as string}</h2>
            <p className={styles.questionHint}>Free text response</p>
          </div>
        )

      case 'question_choice':
        const options = (content.options as Array<{ id: string; text: string; order: number }>) || []
        return (
          <div className={styles.questionSlide}>
            <div className={styles.questionIcon}>?</div>
            <h2 className={styles.questionText}>{content.question as string}</h2>
            <div className={styles.options}>
              {options.sort((a, b) => a.order - b.order).map((opt, idx) => (
                <div key={opt.id} className={styles.option}>
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={styles.optionText}>{opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'summary':
        return (
          <div className={styles.summarySlide}>
            <h2 className={styles.summaryTitle}>
              {typeof content.title === 'string' ? content.title : 'Summary'}
            </h2>
            {content.summary_text && typeof content.summary_text === 'string' ? (
              <div
                className={styles.summaryText}
                dangerouslySetInnerHTML={{ __html: content.summary_text }}
              />
            ) : (
              <p className={styles.summaryHint}>
                {content.auto_generate
                  ? 'AI-generated summary will appear here'
                  : 'No summary content'}
              </p>
            )}
          </div>
        )

      case 'conclusion':
        const conclusions = (content.conclusions as string[]) || []
        return (
          <div className={styles.conclusionSlide}>
            <h2 className={styles.conclusionTitle}>
              {(content.title as string) || 'Key Takeaways'}
            </h2>
            {conclusions.length > 0 ? (
              <ul className={styles.conclusionList}>
                {conclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.conclusionHint}>
                {content.auto_generate
                  ? 'AI-generated conclusions will appear here'
                  : 'No conclusions added'}
              </p>
            )}
            {typeof content.thank_you_message === 'string' && content.thank_you_message && (
              <p className={styles.thankYou}>{content.thank_you_message}</p>
            )}
          </div>
        )

      default:
        return (
          <div className={styles.unknownSlide}>
            <p>Unknown slide type: {slide.type}</p>
          </div>
        )
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.slideCounter}>
        Slide {slideIndex + 1} of {totalSlides}
      </div>
      <div className={styles.slideContent}>
        {renderSlideContent()}
      </div>
      <div className={styles.slideType}>
        {slide.type.replace('_', ' ')}
      </div>
    </div>
  )
}

export default CurrentSlideDisplay
