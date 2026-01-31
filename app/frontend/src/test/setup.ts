/**
 * Test Setup
 *
 * Configures the testing environment for Vitest + React Testing Library.
 */

import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
