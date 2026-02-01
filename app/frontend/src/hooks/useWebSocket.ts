/**
 * WebSocket Hook for Live Sessions
 *
 * Provides WebSocket connection management for live presentation sessions.
 * Handles connection, reconnection, message sending, and event listeners.
 *
 * Usage:
 *   const { connect, disconnect, sendMessage, isConnected, sessionState } = useWebSocket()
 *   connect('ABC123', { type: 'join', display_name: 'John' })
 */

import { useCallback, useEffect, useRef, useState } from 'react'

// Message types from server
export type WSMessageType =
  | 'session_state'
  | 'slide_changed'
  | 'participant_joined'
  | 'participant_left'
  | 'participant_count'
  | 'session_started'
  | 'session_paused'
  | 'session_resumed'
  | 'session_ended'
  | 'response_received'
  | 'error'
  | 'pong'

export interface SlideInfo {
  id: string
  order_index: number
  type: string
  content: Record<string, unknown>
}

export interface SessionState {
  session_id: string
  join_code: string
  status: string
  presentation_title: string
  current_slide: SlideInfo | null
  total_slides: number
  participant_count: number
}

export interface WSMessage {
  type: WSMessageType
  [key: string]: unknown
}

export interface UseWebSocketOptions {
  onSessionState?: (state: SessionState) => void
  onSlideChanged?: (slide: SlideInfo, index: number) => void
  onParticipantJoined?: (
    participantId: string,
    displayName: string | null,
    count: number
  ) => void
  onParticipantLeft?: (participantId: string, count: number) => void
  onParticipantCount?: (count: number) => void
  onSessionStarted?: (startedAt: string, slide: SlideInfo | null) => void
  onSessionPaused?: () => void
  onSessionResumed?: () => void
  onSessionEnded?: (endedAt: string) => void
  onResponseReceived?: (response: {
    response_id: string
    slide_id: string
    participant_id: string | null
    display_name: string | null
    content: Record<string, unknown>
    created_at: string
  }) => void
  onError?: (code: string, message: string) => void
  onConnect?: () => void
  onDisconnect?: () => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000'

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onSessionState,
    onSlideChanged,
    onParticipantJoined,
    onParticipantLeft,
    onParticipantCount,
    onSessionStarted,
    onSessionPaused,
    onSessionResumed,
    onSessionEnded,
    onResponseReceived,
    onError,
    onConnect,
    onDisconnect,
    reconnectAttempts = 3,
    reconnectInterval = 2000,
  } = options

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectCountRef = useRef(0)
  const joinCodeRef = useRef<string | null>(null)
  const joinMessageRef = useRef<Record<string, unknown> | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [error, setError] = useState<{ code: string; message: string } | null>(
    null
  )

  // Handle incoming messages
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const message: WSMessage = JSON.parse(event.data)

        // Type guard helper
        const getData = <T>(msg: WSMessage): T => msg as unknown as T

        switch (message.type) {
          case 'session_state': {
            const state = getData<SessionState & { type: string }>(message)
            setSessionState({
              session_id: state.session_id,
              join_code: state.join_code,
              status: state.status,
              presentation_title: state.presentation_title,
              current_slide: state.current_slide,
              total_slides: state.total_slides,
              participant_count: state.participant_count,
            })
            onSessionState?.(state as SessionState)
            break
          }

          case 'slide_changed': {
            const data = getData<{ slide: SlideInfo; slide_index: number }>(
              message
            )
            if (sessionState) {
              setSessionState((prev) =>
                prev ? { ...prev, current_slide: data.slide } : null
              )
            }
            onSlideChanged?.(data.slide, data.slide_index)
            break
          }

          case 'participant_joined': {
            const data = getData<{
              participant_id: string
              display_name: string | null
              participant_count: number
            }>(message)
            setSessionState((prev) =>
              prev
                ? { ...prev, participant_count: data.participant_count }
                : null
            )
            onParticipantJoined?.(
              data.participant_id,
              data.display_name,
              data.participant_count
            )
            break
          }

          case 'participant_left': {
            const data = getData<{
              participant_id: string
              participant_count: number
            }>(message)
            setSessionState((prev) =>
              prev
                ? { ...prev, participant_count: data.participant_count }
                : null
            )
            onParticipantLeft?.(data.participant_id, data.participant_count)
            break
          }

          case 'participant_count': {
            const data = getData<{ participant_count: number }>(message)
            setSessionState((prev) =>
              prev
                ? { ...prev, participant_count: data.participant_count }
                : null
            )
            onParticipantCount?.(data.participant_count)
            break
          }

          case 'session_started': {
            const data = getData<{
              started_at: string
              current_slide: SlideInfo | null
            }>(message)
            setSessionState((prev) =>
              prev
                ? {
                    ...prev,
                    status: 'active',
                    current_slide: data.current_slide,
                  }
                : null
            )
            onSessionStarted?.(data.started_at, data.current_slide)
            break
          }

          case 'session_paused': {
            setSessionState((prev) =>
              prev ? { ...prev, status: 'paused' } : null
            )
            onSessionPaused?.()
            break
          }

          case 'session_resumed': {
            setSessionState((prev) =>
              prev ? { ...prev, status: 'active' } : null
            )
            onSessionResumed?.()
            break
          }

          case 'session_ended': {
            const data = getData<{ ended_at: string }>(message)
            setSessionState((prev) =>
              prev ? { ...prev, status: 'ended' } : null
            )
            onSessionEnded?.(data.ended_at)
            break
          }

          case 'response_received': {
            const data = getData<{
              response_id: string
              slide_id: string
              participant_id: string | null
              display_name: string | null
              content: Record<string, unknown>
              created_at: string
            }>(message)
            onResponseReceived?.(data)
            break
          }

          case 'error': {
            const data = getData<{ code: string; message: string }>(message)
            setError(data)
            onError?.(data.code, data.message)
            break
          }

          case 'pong':
            // Keep-alive response, no action needed
            break

          default:
            console.warn('Unknown WebSocket message type:', message.type)
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e)
      }
    },
    [
      sessionState,
      onSessionState,
      onSlideChanged,
      onParticipantJoined,
      onParticipantLeft,
      onParticipantCount,
      onSessionStarted,
      onSessionPaused,
      onSessionResumed,
      onSessionEnded,
      onResponseReceived,
      onError,
    ]
  )

  // Connect to WebSocket
  const connect = useCallback(
    (
      joinCode: string,
      joinMessage: { type: 'join' | 'join_speaker'; [key: string]: unknown }
    ) => {
      // Store for reconnection
      joinCodeRef.current = joinCode
      joinMessageRef.current = joinMessage

      // Close existing connection
      if (wsRef.current) {
        wsRef.current.close()
      }

      const wsUrl = `${WS_URL}/ws/session/${joinCode.toUpperCase()}`
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        setIsConnected(true)
        setError(null)
        reconnectCountRef.current = 0

        // Send join message
        ws.send(JSON.stringify(joinMessage))
        onConnect?.()
      }

      ws.onmessage = handleMessage

      ws.onclose = (event) => {
        setIsConnected(false)
        wsRef.current = null

        // Check if we should reconnect
        if (
          event.code !== 1000 && // Normal closure
          event.code !== 4003 && // Session ended
          event.code !== 4004 && // Session not found
          reconnectCountRef.current < reconnectAttempts &&
          joinCodeRef.current &&
          joinMessageRef.current
        ) {
          reconnectCountRef.current++
          console.log(
            `WebSocket disconnected, attempting reconnect ${reconnectCountRef.current}/${reconnectAttempts}`
          )
          setTimeout(() => {
            if (joinCodeRef.current && joinMessageRef.current) {
              connect(
                joinCodeRef.current,
                joinMessageRef.current as { type: 'join' | 'join_speaker' }
              )
            }
          }, reconnectInterval)
        } else {
          onDisconnect?.()
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
      }

      wsRef.current = ws
    },
    [
      handleMessage,
      onConnect,
      onDisconnect,
      reconnectAttempts,
      reconnectInterval,
    ]
  )

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    joinCodeRef.current = null
    joinMessageRef.current = null
    reconnectCountRef.current = reconnectAttempts // Prevent reconnection

    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
      wsRef.current = null
    }

    setIsConnected(false)
    setSessionState(null)
  }, [reconnectAttempts])

  // Send message through WebSocket
  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  // Submit response to current slide
  const submitResponse = useCallback(
    (slideId: string, content: Record<string, unknown>) => {
      sendMessage({
        type: 'submit_response',
        slide_id: slideId,
        content,
      })
    },
    [sendMessage]
  )

  // Send ping to keep connection alive
  const ping = useCallback(() => {
    sendMessage({ type: 'ping' })
  }, [sendMessage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Set up ping interval when connected
  useEffect(() => {
    if (!isConnected) return

    const pingInterval = setInterval(() => {
      ping()
    }, 30000) // Ping every 30 seconds

    return () => clearInterval(pingInterval)
  }, [isConnected, ping])

  return {
    connect,
    disconnect,
    sendMessage,
    submitResponse,
    ping,
    isConnected,
    sessionState,
    error,
  }
}

export default useWebSocket
