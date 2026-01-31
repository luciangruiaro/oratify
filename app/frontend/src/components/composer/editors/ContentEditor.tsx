/**
 * Content Slide Editor
 *
 * Editor for content slides with:
 * - Text content with rich formatting
 * - Image upload with preview
 * - Layout selection
 */

import { useState, useCallback, useRef } from 'react'
import { LayoutType, uploadImage } from '@/api/slides'
import styles from './ContentEditor.module.css'

interface ContentEditorProps {
  content: Record<string, unknown>
  onChange: (content: Record<string, unknown>) => void
  disabled?: boolean
}

const LAYOUT_OPTIONS: { value: LayoutType; label: string; icon: string }[] = [
  { value: 'text-only', label: 'Text Only', icon: 'T' },
  { value: 'image-left', label: 'Image Left', icon: 'L' },
  { value: 'image-right', label: 'Image Right', icon: 'R' },
  { value: 'image-top', label: 'Image Top', icon: 'U' },
]

export function ContentEditor({ content, onChange, disabled = false }: ContentEditorProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const text = (content.text as string) || ''
  const imageUrl = content.image_url as string | null
  const layout = (content.layout as LayoutType) || 'text-only'

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...content, text: e.target.value })
    },
    [content, onChange]
  )

  const handleLayoutChange = useCallback(
    (newLayout: LayoutType) => {
      onChange({ ...content, layout: newLayout })
    },
    [content, onChange]
  )

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file')
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Image must be less than 10MB')
        return
      }

      setIsUploading(true)
      setUploadError(null)

      try {
        const result = await uploadImage(file)
        onChange({ ...content, image_url: result.url })
      } catch (err) {
        setUploadError('Failed to upload image. Please try again.')
        console.error('Upload error:', err)
      } finally {
        setIsUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [content, onChange]
  )

  const handleRemoveImage = useCallback(() => {
    onChange({ ...content, image_url: null })
  }, [content, onChange])

  const showImageSection = layout !== 'text-only'

  return (
    <div className={styles.container}>
      {/* Layout Selector */}
      <div className={styles.layoutSection}>
        <label className={styles.sectionLabel}>Layout</label>
        <div className={styles.layoutOptions}>
          {LAYOUT_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`${styles.layoutOption} ${
                layout === option.value ? styles.active : ''
              }`}
              onClick={() => handleLayoutChange(option.value)}
              disabled={disabled}
              title={option.label}
            >
              <span className={styles.layoutIcon}>{option.icon}</span>
              <span className={styles.layoutLabel}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Layout */}
      <div className={`${styles.previewContainer} ${styles[`layout-${layout}`]}`}>
        {/* Image Section */}
        {showImageSection && (
          <div className={styles.imageSection}>
            {imageUrl ? (
              <div className={styles.imagePreview}>
                <img src={imageUrl} alt="Slide image" />
                <button
                  className={styles.removeImage}
                  onClick={handleRemoveImage}
                  disabled={disabled}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ) : (
              <div className={styles.uploadArea}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={disabled || isUploading}
                  className={styles.fileInput}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className={styles.uploadLabel}>
                  {isUploading ? (
                    <>
                      <div className={styles.uploadSpinner} />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.uploadIcon}>+</span>
                      <span>Click to upload image</span>
                      <span className={styles.uploadHint}>PNG, JPG up to 10MB</span>
                    </>
                  )}
                </label>
                {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
              </div>
            )}
          </div>
        )}

        {/* Text Section */}
        <div className={styles.textSection}>
          <textarea
            className={styles.textInput}
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your slide content here..."
            disabled={disabled}
            rows={showImageSection ? 8 : 12}
          />
        </div>
      </div>
    </div>
  )
}

export default ContentEditor
