/**
 * Presenter Components Tests
 *
 * Tests for the presenter view UI components.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AudienceCounter } from './AudienceCounter'
import { SessionTimer } from './SessionTimer'
import { SlideNavigationControls } from './SlideNavigationControls'
import { SessionControls } from './SessionControls'
import { PresenterHeader } from './PresenterHeader'
import { CurrentSlideDisplay } from './CurrentSlideDisplay'
import { ResponseFeed } from './ResponseFeed'

describe('AudienceCounter', () => {
  it('displays singular participant text for count of 1', () => {
    render(<AudienceCounter count={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('participant')).toBeInTheDocument()
  })

  it('displays plural participants text for count > 1', () => {
    render(<AudienceCounter count={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('participants')).toBeInTheDocument()
  })

  it('displays 0 participants correctly', () => {
    render(<AudienceCounter count={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('participants')).toBeInTheDocument()
  })
})

describe('SessionTimer', () => {
  it('shows 0:00 when session has not started', () => {
    render(<SessionTimer startedAt={null} status="pending" />)
    expect(screen.getByText('0:00')).toBeInTheDocument()
  })

  it('shows PAUSED label when session is paused', () => {
    const startedAt = new Date(Date.now() - 60000).toISOString()
    render(<SessionTimer startedAt={startedAt} status="paused" />)
    expect(screen.getByText('PAUSED')).toBeInTheDocument()
  })
})

describe('SlideNavigationControls', () => {
  it('disables prev button on first slide', () => {
    const onPrev = vi.fn()
    const onNext = vi.fn()
    const onJump = vi.fn()

    render(
      <SlideNavigationControls
        currentIndex={0}
        totalSlides={5}
        onPrev={onPrev}
        onNext={onNext}
        onJump={onJump}
      />
    )

    const prevButton = screen.getAllByRole('button')[0]
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last slide', () => {
    const onPrev = vi.fn()
    const onNext = vi.fn()
    const onJump = vi.fn()

    render(
      <SlideNavigationControls
        currentIndex={4}
        totalSlides={5}
        onPrev={onPrev}
        onNext={onNext}
        onJump={onJump}
      />
    )

    const nextButton = screen.getAllByRole('button')[2]
    expect(nextButton).toBeDisabled()
  })

  it('shows current slide number', () => {
    render(
      <SlideNavigationControls
        currentIndex={2}
        totalSlides={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onJump={vi.fn()}
      />
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onJump when jump button is clicked', () => {
    const onJump = vi.fn()

    render(
      <SlideNavigationControls
        currentIndex={2}
        totalSlides={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onJump={onJump}
      />
    )

    const jumpButton = screen.getByText('3').closest('button')
    fireEvent.click(jumpButton!)
    expect(onJump).toHaveBeenCalled()
  })
})

describe('SessionControls', () => {
  it('shows Start Session button when pending', () => {
    render(
      <SessionControls
        status="pending"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onEnd={vi.fn()}
        onFullScreen={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Start Session')).toBeInTheDocument()
  })

  it('shows Pause and End buttons when active', () => {
    render(
      <SessionControls
        status="active"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onEnd={vi.fn()}
        onFullScreen={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Pause')).toBeInTheDocument()
    expect(screen.getByText('End Session')).toBeInTheDocument()
  })

  it('shows Resume button when paused', () => {
    render(
      <SessionControls
        status="paused"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onEnd={vi.fn()}
        onFullScreen={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Resume')).toBeInTheDocument()
  })

  it('shows ended message when session ended', () => {
    render(
      <SessionControls
        status="ended"
        onStart={vi.fn()}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onEnd={vi.fn()}
        onFullScreen={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Session has ended')).toBeInTheDocument()
  })

  it('calls onStart when Start button is clicked', () => {
    const onStart = vi.fn()

    render(
      <SessionControls
        status="pending"
        onStart={onStart}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onEnd={vi.fn()}
        onFullScreen={vi.fn()}
        isFullScreen={false}
      />
    )

    fireEvent.click(screen.getByText('Start Session'))
    expect(onStart).toHaveBeenCalled()
  })
})

describe('PresenterHeader', () => {
  it('displays presentation title', () => {
    render(
      <PresenterHeader
        presentationTitle="My Presentation"
        sessionStatus="pending"
        onBack={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('My Presentation')).toBeInTheDocument()
  })

  it('shows Live status when active', () => {
    render(
      <PresenterHeader
        presentationTitle="Test"
        sessionStatus="active"
        onBack={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Live')).toBeInTheDocument()
  })

  it('shows Paused status when paused', () => {
    render(
      <PresenterHeader
        presentationTitle="Test"
        sessionStatus="paused"
        onBack={vi.fn()}
        isFullScreen={false}
      />
    )

    expect(screen.getByText('Paused')).toBeInTheDocument()
  })

  it('returns null when in fullscreen mode', () => {
    const { container } = render(
      <PresenterHeader
        presentationTitle="Test"
        sessionStatus="active"
        onBack={vi.fn()}
        isFullScreen={true}
      />
    )

    expect(container.firstChild).toBeNull()
  })
})

describe('CurrentSlideDisplay', () => {
  it('shows no slide selected when slide is null', () => {
    render(
      <CurrentSlideDisplay
        slide={null}
        slideIndex={0}
        totalSlides={5}
      />
    )

    expect(screen.getByText('No slide selected')).toBeInTheDocument()
  })

  it('shows slide counter', () => {
    render(
      <CurrentSlideDisplay
        slide={{ id: '1', type: 'content', content: { text: 'Hello' }, order_index: 0 }}
        slideIndex={2}
        totalSlides={5}
      />
    )

    expect(screen.getByText('Slide 3 of 5')).toBeInTheDocument()
  })

  it('renders question text slide', () => {
    render(
      <CurrentSlideDisplay
        slide={{
          id: '1',
          type: 'question_text',
          content: { question: 'What do you think?' },
          order_index: 0,
        }}
        slideIndex={0}
        totalSlides={1}
      />
    )

    expect(screen.getByText('What do you think?')).toBeInTheDocument()
    expect(screen.getByText('Free text response')).toBeInTheDocument()
  })
})

describe('ResponseFeed', () => {
  it('shows empty state when no responses', () => {
    render(
      <ResponseFeed
        responses={[]}
        questions={[]}
        currentSlideId="slide-1"
      />
    )

    expect(screen.getByText('No responses yet')).toBeInTheDocument()
  })

  it('renders text responses', () => {
    render(
      <ResponseFeed
        responses={[
          {
            response_id: 'r1',
            slide_id: 'slide-1',
            participant_id: 'p1',
            display_name: 'John',
            content: { text: 'Great presentation!' },
            created_at: new Date().toISOString(),
          },
        ]}
        questions={[]}
        currentSlideId="slide-1"
      />
    )

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Great presentation!')).toBeInTheDocument()
  })

  it('shows Anonymous for responses without display name', () => {
    render(
      <ResponseFeed
        responses={[
          {
            response_id: 'r1',
            slide_id: 'slide-1',
            participant_id: 'p1',
            display_name: null,
            content: { text: 'Hello' },
            created_at: new Date().toISOString(),
          },
        ]}
        questions={[]}
        currentSlideId="slide-1"
      />
    )

    expect(screen.getByText('Anonymous')).toBeInTheDocument()
  })

  it('renders questions with Q label', () => {
    render(
      <ResponseFeed
        responses={[]}
        questions={[
          {
            question_id: 'q1',
            slide_id: 'slide-1',
            participant_id: 'p1',
            display_name: 'Jane',
            question_text: 'Can you explain more?',
            created_at: new Date().toISOString(),
          },
        ]}
        currentSlideId="slide-1"
      />
    )

    expect(screen.getByText('Q:')).toBeInTheDocument()
    expect(screen.getByText('Can you explain more?')).toBeInTheDocument()
  })

  it('shows current slide tag for matching responses', () => {
    render(
      <ResponseFeed
        responses={[
          {
            response_id: 'r1',
            slide_id: 'slide-1',
            participant_id: 'p1',
            display_name: 'John',
            content: { text: 'Nice!' },
            created_at: new Date().toISOString(),
          },
        ]}
        questions={[]}
        currentSlideId="slide-1"
      />
    )

    expect(screen.getByText('Current slide')).toBeInTheDocument()
  })
})
