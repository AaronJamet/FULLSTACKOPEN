import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Resets jsdom, which is the web browser simulator, after each test done
afterEach(() => {
  cleanup()
})