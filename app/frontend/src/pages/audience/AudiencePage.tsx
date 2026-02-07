/**
 * Audience Page (Orchestrator)
 *
 * Main page for audience members in a live session.
 * Connects via WebSocket, manages local state, and renders
 * sub-components based on current slide type and session status.
 *
 * Stories: 12.1-12.17
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SessionJoinInfo } from '@/api/sessions'
import { useWebSocket } from '@/hooks/useWebSocket'
import type {
  SlideInfo,
  AIResponse,
  VoteUpdate,
} from '@/hooks/useWebSocket'
import { AudienceHeader } from './components/AudienceHeader'
import { ContentSlideDisplay } from './components/ContentSlideDisplay'
import { TextResponseInput } from './components/TextResponseInput'
import { VotingButtons } from './components/VotingButtons'
import { WaitingForSlide } from './components/WaitingForSlide'
import { ResponseConfirmation } from './components/ResponseConfirmation'
import { QuestionFAB } from './components/QuestionFAB'
import { QuestionModal } from './components/QuestionModal'
import { AIResponseDisplay } from './components/AIResponseDisplay'
import { SessionEndedView } from './components/SessionEndedView'
import { SummarySlideDisplay } from './components/SummarySlideDisplay'
import { ConclusionSlideDisplay } from './components/ConclusionSlideDisplay'
import styles from './AudiencePage.module.css'

interface LocationState {
  session: SessionJoinInfo
  displayName: string
}

export function AudiencePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  // Local state
  const [currentSlide, setCurrentSlide] = useState<SlideInfo | null>(null)
  const [totalSlides, setTotalSlides] = useState(0)
  const [sessionStatus, setSessionStatus] = useState<string>(
    state?.session?.status || 'pending'
  )
  const [presentationTitle, setPresentationTitle] = useState(
    state?.session?.presentation_title || ''
  )
  const [respondedSlides] = useState<Set<string>>(() => new Set())
  const [hasRespondedCurrent, setHasRespondedCurrent] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [voteCounts, setVoteCounts] = useState<Record<string, number> | null>(null)
  const [totalVotes, setTotalVotes] = useState(0)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const confirmationTimerRef = useRef<ReturnType<typeof setTimeout>>()

  // Redirect if no session data
  useEffect(() => {
    if (!state?.session) {
      navigate('/join', { replace: true })
    }
  }, [state, navigate])

  // When slide changes, reset per-slide state
  const resetSlideState = useCallback(
    (slide: SlideInfo | null) => {
      setCurrentSlide(slide)
      setShowConfirmation(false)
      setSelectedOptionId(null)
      setVoteCounts(null)
      setTotalVotes(0)
      setAiResponse(null)
      setAiLoading(false)
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current)
      }
      // Check if already responded to this slide
      setHasRespondedCurrent(slide ? respondedSlides.has(slide.id) : false)
    },
    [respondedSlides]
  )

  // WebSocket connection
  const {
    connect,
    disconnect,
    submitResponse,
    askQuestion,
    isConnected,
    sessionState,
  } = useWebSocket({
    onSessionState: (wsState) => {
      setSessionStatus(wsState.status)
      setTotalSlides(wsState.total_slides)
      setPresentationTitle(wsState.presentation_title)
      resetSlideState(wsState.current_slide)
    },
    onSlideChanged: (slide: SlideInfo) => {
      resetSlideState(slide)
    },
    onSessionStarted: (_startedAt, slide) => {
      setSessionStatus('active')
      if (slide) resetSlideState(slide)
    },
    onSessionPaused: () => {
      setSessionStatus('paused')
    },
    onSessionResumed: () => {
      setSessionStatus('active')
    },
    onSessionEnded: () => {
      setSessionStatus('ended')
    },
    onVoteUpdate: (update: VoteUpdate) => {
      if (currentSlide && update.slide_id === currentSlide.id) {
        setVoteCounts(update.votes)
        setTotalVotes(update.total_votes)
      }
    },
    onAIResponse: (response: AIResponse) => {
      setAiResponse(response)
      setAiLoading(response.is_streaming && !response.is_complete)
    },
    onError: (code, message) => {
      console.error(`WebSocket error [${code}]: ${message}`)
    },
  })

  // Connect to WebSocket on mount
  useEffect(() => {
    if (!state?.session) return

    connect(state.session.join_code, {
      type: 'join',
      display_name: state.displayName,
    })

    return () => {
      disconnect()
    }
  }, [state?.session?.join_code])

  // Handle text response submission
  const handleTextSubmit = useCallback(
    (text: string) => {
      if (!currentSlide) return
      submitResponse(currentSlide.id, { text })
      respondedSlides.add(currentSlide.id)
      setHasRespondedCurrent(true)
      setShowConfirmation(true)
      confirmationTimerRef.current = setTimeout(
        () => setShowConfirmation(false),
        3000
      )
    },
    [currentSlide, submitResponse, respondedSlides]
  )

  // Handle vote submission
  const handleVote = useCallback(
    (optionId: string) => {
      if (!currentSlide) return
      submitResponse(currentSlide.id, { option_id: optionId })
      respondedSlides.add(currentSlide.id)
      setHasRespondedCurrent(true)
      setSelectedOptionId(optionId)
    },
    [currentSlide, submitResponse, respondedSlides]
  )

  // Handle question submission
  const handleAskQuestion = useCallback(
    (questionText: string) => {
      if (!currentSlide) return
      askQuestion(currentSlide.id, questionText)
      setAiLoading(true)
      setShowQuestionModal(false)
    },
    [currentSlide, askQuestion]
  )

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current)
      }
    }
  }, [])

  if (!state?.session) {
    return null
  }

  // Session ended
  if (sessionStatus === 'ended') {
    return (
      <div className={styles.container}>
        <SessionEndedView presentationTitle={presentationTitle} />
      </div>
    )
  }

  // Render slide content based on type
  const renderSlideContent = () => {
    // Paused session
    if (sessionStatus === 'paused') {
      return <WaitingForSlide message="Session paused. Please wait..." />
    }

    // No current slide
    if (!currentSlide) {
      return <WaitingForSlide />
    }

    // Show confirmation briefly after submission (for text responses)
    if (showConfirmation && currentSlide.type === 'question_text') {
      return <ResponseConfirmation />
    }

    switch (currentSlide.type) {
      case 'content':
        return <ContentSlideDisplay content={currentSlide.content} />

      case 'question_text':
        return (
          <TextResponseInput
            question={currentSlide.content.question as string}
            hasResponded={hasRespondedCurrent}
            onSubmit={handleTextSubmit}
          />
        )

      case 'question_choice': {
        const options =
          (currentSlide.content.options as Array<{
            id: string
            text: string
            order: number
          }>) || []
        return (
          <VotingButtons
            question={currentSlide.content.question as string}
            options={options}
            hasResponded={hasRespondedCurrent}
            selectedOptionId={selectedOptionId}
            voteCounts={voteCounts}
            totalVotes={totalVotes}
            onVote={handleVote}
          />
        )
      }

      case 'summary':
        return <SummarySlideDisplay content={currentSlide.content} />

      case 'conclusion':
        return <ConclusionSlideDisplay content={currentSlide.content} />

      default:
        return <ContentSlideDisplay content={currentSlide.content} />
    }
  }

  const currentSlideIndex = currentSlide?.order_index ?? -1

  return (
    <div className={styles.container}>
      <AudienceHeader
        presentationTitle={
          sessionState?.presentation_title || presentationTitle
        }
        currentSlideIndex={currentSlideIndex}
        totalSlides={sessionState?.total_slides || totalSlides}
        isConnected={isConnected}
        sessionStatus={sessionStatus}
      />

      <main className={styles.main}>
        <div className={styles.slideArea}>{renderSlideContent()}</div>

        <AIResponseDisplay response={aiResponse} isLoading={aiLoading} />
      </main>

      {sessionStatus === 'active' && (
        <QuestionFAB
          onClick={() => setShowQuestionModal(true)}
          disabled={!currentSlide}
        />
      )}

      {showQuestionModal && (
        <QuestionModal
          onSubmit={handleAskQuestion}
          onClose={() => setShowQuestionModal(false)}
        />
      )}
    </div>
  )
}

export default AudiencePage
