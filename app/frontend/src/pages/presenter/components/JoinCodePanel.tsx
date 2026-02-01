/**
 * Join Code Panel Component
 *
 * Displays the session join code and QR code for audience to join.
 */

import { useState } from 'react'
import { QRCode } from '../../../components/common/QRCode'
import styles from './JoinCodePanel.module.css'

interface JoinCodePanelProps {
  joinCode: string
  status: 'pending' | 'active' | 'paused' | 'ended'
}

export function JoinCodePanel({ joinCode, status }: JoinCodePanelProps) {
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const joinUrl = `${window.location.origin}/join/${joinCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const isActive = status === 'active' || status === 'pending' || status === 'paused'

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Join Code</h3>
        <button
          className={styles.qrToggle}
          onClick={() => setShowQR(!showQR)}
          title={showQR ? 'Hide QR code' : 'Show QR code'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>

      <div className={styles.codeDisplay}>
        <span className={`${styles.code} ${!isActive ? styles.inactive : ''}`}>
          {joinCode}
        </span>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          title="Copy join code"
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>

      {showQR && (
        <div className={styles.qrSection}>
          <div className={styles.qrCode}>
            <QRCode value={joinUrl} size={160} />
          </div>
          <button className={styles.urlButton} onClick={handleCopyUrl}>
            <span className={styles.urlText}>{joinUrl}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      )}

      {!isActive && (
        <div className={styles.endedNotice}>
          This session has ended
        </div>
      )}
    </div>
  )
}

export default JoinCodePanel
