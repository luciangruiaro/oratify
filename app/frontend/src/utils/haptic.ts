/**
 * Haptic Feedback Utility
 *
 * Provides haptic feedback on mobile devices using the Vibration API.
 * Gracefully degrades on unsupported devices.
 */

type HapticPattern = 'light' | 'medium' | 'success' | 'error'

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  success: [15, 50, 15],
  error: [30, 50, 30, 50, 30],
}

export function triggerHaptic(pattern: HapticPattern = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patterns[pattern])
    } catch {
      // Silently fail on unsupported devices
    }
  }
}
