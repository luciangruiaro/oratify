/**
 * QR Code Component
 *
 * Displays a QR code for audience to scan and join a session.
 * Used in presenter view to show join URL/code.
 *
 * Props:
 * - value: The URL or text to encode
 * - size: Size of the QR code in pixels (default: 200)
 * - bgColor: Background color (default: white)
 * - fgColor: Foreground color (default: dark)
 */

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  includeMargin?: boolean
  className?: string
}

export function QRCode({
  value,
  size = 200,
  bgColor = '#FFFFFF',
  fgColor = '#1E1E1E',
  includeMargin = true,
  className,
}: QRCodeProps) {
  return (
    <div className={className}>
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        includeMargin={includeMargin}
        level="M"
      />
    </div>
  )
}

/**
 * Utility to generate join URL for a session.
 */
export function generateJoinUrl(
  code: string,
  baseUrl: string = window.location.origin
): string {
  return `${baseUrl}/join/${code}`
}

/**
 * Utility to generate slug-based join URL.
 */
export function generateSlugUrl(
  slug: string,
  baseUrl: string = window.location.origin
): string {
  return `${baseUrl}/s/${slug}`
}

export default QRCode
