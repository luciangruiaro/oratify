/**
 * Add Slide Dropdown Component
 *
 * Dropdown menu for adding new slides of different types.
 */

import { useState, useRef, useEffect } from 'react'
import { SlideType } from '@/api/slides'
import styles from './AddSlideDropdown.module.css'

interface AddSlideDropdownProps {
  onAddSlide: (type: SlideType) => void
  disabled?: boolean
}

interface SlideTypeOption {
  type: SlideType
  label: string
  description: string
  icon: string
}

const SLIDE_OPTIONS: SlideTypeOption[] = [
  {
    type: 'content',
    label: 'Content',
    description: 'Text and image content',
    icon: 'T',
  },
  {
    type: 'question_text',
    label: 'Text Question',
    description: 'Free-text audience response',
    icon: '?',
  },
  {
    type: 'question_choice',
    label: 'Multiple Choice',
    description: 'Poll with options',
    icon: 'A',
  },
  {
    type: 'summary',
    label: 'Summary',
    description: 'AI-generated summary',
    icon: 'S',
  },
  {
    type: 'conclusion',
    label: 'Conclusion',
    description: 'Key takeaways',
    icon: 'C',
  },
]

export function AddSlideDropdown({ onAddSlide, disabled = false }: AddSlideDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (type: SlideType) => {
    onAddSlide(type)
    setIsOpen(false)
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.icon}>+</span>
        <span>Add Slide</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {SLIDE_OPTIONS.map((option) => (
            <button
              key={option.type}
              className={styles.option}
              onClick={() => handleSelect(option.type)}
              role="menuitem"
            >
              <span className={styles.optionIcon}>{option.icon}</span>
              <div className={styles.optionContent}>
                <span className={styles.optionLabel}>{option.label}</span>
                <span className={styles.optionDescription}>{option.description}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddSlideDropdown
