/**
 * Presenter View Page
 *
 * Main page for speakers to control live presentation sessions.
 * Provides slide navigation, session controls, and real-time response feed.
 *
 * Features:
 * - Current slide display with navigation
 * - Session start/pause/end controls
 * - Join code and QR code display
 * - Real-time audience responses
 * - Keyboard shortcuts for navigation
 */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import type { RootState } from '../../store'
import { fetchSlides } from '../../features/slides/slidesSlice'
import { useWebSocket } from '../../hooks/useWebSocket'
import type { SlideInfo, QuestionAsked } from '../../hooks/useWebSocket'
import apiClient from '../../api/client'
import { PresenterHeader } from './components/PresenterHeader'
import { CurrentSlideDisplay } from './components/CurrentSlideDisplay'
import { SlideNavigationControls } from './components/SlideNavigationControls'
import { SlideThumbnailStrip } from './components/SlideThumbnailStrip'
import { SessionControls } from './components/SessionControls'
import { JoinCodePanel } from './components/JoinCodePanel'
import { AudienceCounter } from './components/AudienceCounter'
import { SessionTimer } from './components/SessionTimer'
import { ResponseFeed } from './components/ResponseFeed'
import { JumpToSlideModal } from './components/JumpToSlideModal'
import { ConnectionStatus } from '../../components/common/ConnectionStatus'
import styles from './PresenterPage.module.css'

interface SessionData {
  id: string
  presentation_id: string
  join_code: string
  status: 'pending' | 'active' | 'paused' | 'ended'
  current_slide_id: string | null
  started_at: string | null
  ended_at: string | null
}

interface ResponseItem {
  response_id: string
  slide_id: string
  participant_id: string | null
  display_name: string | null
  content: Record<string, unknown>
  created_at: string
}

export function PresenterPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Redux state
  const slides = useAppSelector((state: RootState) => state.slides.items)
  const slidesLoading = useAppSelector((state: RootState) => state.slides.isLoading)

  // Local state
  const [session, setSession] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)
  const [responses, setResponses] = useState<ResponseItem[]>([])
  const [questions, setQuestions] = useState<QuestionAsked[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [showJumpModal, setShowJumpModal] = useState(false)
  const [responseFilter, setResponseFilter] = useState<'all' | 'current'>('current')

  // Get auth token
  const token = localStorage.getItem('access_token')

  // Sort slides by order_index
  const sortedSlides = [...slides].sort((a, b) => a.order_index - b.order_index)
  const currentSlide = sortedSlides[currentSlideIndex] || null

  // WebSocket connection
  const {
    connect,
    disconnect,
    isConnected,
    sessionState,
  } = useWebSocket({
    onSessionState: (state) => {
      setParticipantCount(state.participant_count)
      if (state.current_slide) {
        const idx = sortedSlides.findIndex(s => s.id === state.current_slide?.id)
        if (idx >= 0) setCurrentSlideIndex(idx)
      }
    },
    onSlideChanged: (_slide: SlideInfo, index: number) => {
      setCurrentSlideIndex(index)
    },
    onParticipantCount: (count: number) => {
      setParticipantCount(count)
    },
    onParticipantJoined: (_, __, count) => {
      setParticipantCount(count)
    },
    onParticipantLeft: (_, count) => {
      setParticipantCount(count)
    },
    onResponseReceived: (response) => {
      setResponses(prev => [response, ...prev])
    },
    onQuestionAsked: (question) => {
      setQuestions(prev => [question, ...prev])
    },
    onSessionEnded: () => {
      setSession(prev => prev ? { ...prev, status: 'ended' } : null)
    },
    onSessionPaused: () => {
      setSession(prev => prev ? { ...prev, status: 'paused' } : null)
    },
    onSessionResumed: () => {
      setSession(prev => prev ? { ...prev, status: 'active' } : null)
    },
  })

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return

      try {
        setLoading(true)
        const response = await apiClient.get(`/api/sessions/${sessionId}`)
        const sessionData = response.data
        setSession(sessionData)

        // Fetch slides for the presentation
        dispatch(fetchSlides(sessionData.presentation_id))

        // Find current slide index
        if (sessionData.current_slide_id && slides.length > 0) {
          const idx = sortedSlides.findIndex(s => s.id === sessionData.current_slide_id)
          if (idx >= 0) setCurrentSlideIndex(idx)
        }
      } catch (err) {
        console.error('Failed to fetch session:', err)
        setError('Failed to load session')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId, dispatch])

  // Connect to WebSocket when session is loaded
  useEffect(() => {
    if (session && token && !isConnected) {
      connect(session.join_code, {
        type: 'join_speaker',
        token,
      })
    }

    return () => {
      disconnect()
    }
  }, [session?.join_code, token])

  // Update current slide index when slides load
  useEffect(() => {
    if (session?.current_slide_id && sortedSlides.length > 0) {
      const idx = sortedSlides.findIndex(s => s.id === session.current_slide_id)
      if (idx >= 0) setCurrentSlideIndex(idx)
    }
  }, [slides, session?.current_slide_id])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modal is open or input is focused
      if (showJumpModal) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
          e.preventDefault()
          handleNextSlide()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault()
          handlePrevSlide()
          break
        case 'Home':
          e.preventDefault()
          handleGoToSlide(0)
          break
        case 'End':
          e.preventDefault()
          handleGoToSlide(sortedSlides.length - 1)
          break
        case 'g':
          e.preventDefault()
          setShowJumpModal(true)
          break
        case 'f':
          e.preventDefault()
          toggleFullScreen()
          break
        case 'Escape':
          if (isFullScreen) {
            e.preventDefault()
            setIsFullScreen(false)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showJumpModal, isFullScreen, sortedSlides.length, currentSlideIndex])

  // Navigation handlers
  const handleNextSlide = useCallback(async () => {
    if (currentSlideIndex >= sortedSlides.length - 1) return
    const nextIndex = currentSlideIndex + 1
    const nextSlide = sortedSlides[nextIndex]
    if (!nextSlide || !session) return

    try {
      await apiClient.put(`/api/sessions/${session.id}/current-slide`, {
        slide_id: nextSlide.id,
      })
      setCurrentSlideIndex(nextIndex)
    } catch (err) {
      console.error('Failed to change slide:', err)
    }
  }, [currentSlideIndex, sortedSlides, session])

  const handlePrevSlide = useCallback(async () => {
    if (currentSlideIndex <= 0) return
    const prevIndex = currentSlideIndex - 1
    const prevSlide = sortedSlides[prevIndex]
    if (!prevSlide || !session) return

    try {
      await apiClient.put(`/api/sessions/${session.id}/current-slide`, {
        slide_id: prevSlide.id,
      })
      setCurrentSlideIndex(prevIndex)
    } catch (err) {
      console.error('Failed to change slide:', err)
    }
  }, [currentSlideIndex, sortedSlides, session])

  const handleGoToSlide = useCallback(async (index: number) => {
    if (index < 0 || index >= sortedSlides.length) return
    const slide = sortedSlides[index]
    if (!slide || !session) return

    try {
      await apiClient.put(`/api/sessions/${session.id}/current-slide`, {
        slide_id: slide.id,
      })
      setCurrentSlideIndex(index)
    } catch (err) {
      console.error('Failed to change slide:', err)
    }
  }, [sortedSlides, session])

  // Session control handlers
  const handleStartSession = async () => {
    if (!session) return
    try {
      const response = await apiClient.post(`/api/sessions/${session.id}/start`)
      setSession(response.data)
    } catch (err) {
      console.error('Failed to start session:', err)
    }
  }

  const handlePauseSession = async () => {
    if (!session) return
    try {
      const response = await apiClient.post(`/api/sessions/${session.id}/pause`)
      setSession(response.data)
    } catch (err) {
      console.error('Failed to pause session:', err)
    }
  }

  const handleResumeSession = async () => {
    if (!session) return
    try {
      const response = await apiClient.post(`/api/sessions/${session.id}/resume`)
      setSession(response.data)
    } catch (err) {
      console.error('Failed to resume session:', err)
    }
  }

  const handleEndSession = async () => {
    if (!session) return
    if (!window.confirm('Are you sure you want to end this session? This cannot be undone.')) {
      return
    }
    try {
      const response = await apiClient.post(`/api/sessions/${session.id}/end`)
      setSession(response.data)
    } catch (err) {
      console.error('Failed to end session:', err)
    }
  }

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullScreen(!isFullScreen)
  }

  // Filter responses for current slide
  const filteredResponses = responseFilter === 'current' && currentSlide
    ? responses.filter(r => r.slide_id === currentSlide.id)
    : responses

  if (loading || slidesLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading presenter view...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={styles.error}>
        <h2>Session Not Found</h2>
        <p>The session you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${isFullScreen ? styles.fullScreen : ''}`}>
      <PresenterHeader
        presentationTitle={sessionState?.presentation_title || 'Presentation'}
        sessionStatus={session.status}
        onBack={() => navigate('/dashboard')}
        isFullScreen={isFullScreen}
      />

      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.slideArea}>
            <CurrentSlideDisplay
              slide={currentSlide}
              slideIndex={currentSlideIndex}
              totalSlides={sortedSlides.length}
            />

            <SlideNavigationControls
              currentIndex={currentSlideIndex}
              totalSlides={sortedSlides.length}
              onPrev={handlePrevSlide}
              onNext={handleNextSlide}
              onJump={() => setShowJumpModal(true)}
            />
          </div>

          <SlideThumbnailStrip
            slides={sortedSlides}
            currentIndex={currentSlideIndex}
            onSelect={handleGoToSlide}
          />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.statusBar}>
            <ConnectionStatus isConnected={isConnected} size="small" />
            <AudienceCounter count={participantCount} />
            <SessionTimer
              startedAt={session.started_at}
              status={session.status}
            />
          </div>

          <SessionControls
            status={session.status}
            onStart={handleStartSession}
            onPause={handlePauseSession}
            onResume={handleResumeSession}
            onEnd={handleEndSession}
            onFullScreen={toggleFullScreen}
            isFullScreen={isFullScreen}
          />

          <JoinCodePanel
            joinCode={session.join_code}
            status={session.status}
          />

          <div className={styles.responseSection}>
            <div className={styles.responseHeader}>
              <h3>Responses</h3>
              <div className={styles.responseFilters}>
                <button
                  className={responseFilter === 'current' ? styles.active : ''}
                  onClick={() => setResponseFilter('current')}
                >
                  Current Slide ({filteredResponses.length})
                </button>
                <button
                  className={responseFilter === 'all' ? styles.active : ''}
                  onClick={() => setResponseFilter('all')}
                >
                  All ({responses.length})
                </button>
              </div>
            </div>

            <ResponseFeed
              responses={filteredResponses}
              questions={questions}
              currentSlideId={currentSlide?.id}
            />
          </div>
        </div>
      </div>

      {showJumpModal && (
        <JumpToSlideModal
          slides={sortedSlides}
          currentIndex={currentSlideIndex}
          onSelect={(index) => {
            handleGoToSlide(index)
            setShowJumpModal(false)
          }}
          onClose={() => setShowJumpModal(false)}
        />
      )}
    </div>
  )
}

export default PresenterPage
