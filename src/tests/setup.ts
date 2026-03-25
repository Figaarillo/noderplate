import { afterAll, afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

afterAll(() => {
  vi.resetAllMocks()
})
