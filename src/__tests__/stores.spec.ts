import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSpeedTestStore } from '@/stores/speedTest'

describe('SpeedTest Store', () => {
  beforeEach(() => {
    const storageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key]
        }),
        clear: vi.fn(() => {
          store = {}
        })
      }
    })()

    vi.stubGlobal('localStorage', storageMock)
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes with default values', () => {
    const store = useSpeedTestStore()
    expect(store.threadNum).toBe(8)
    expect(store.isRunning).toBe(false)
    expect(store.runBackground).toBe(false)
    expect(store.autoStart).toBe(false)
  })

  it('updates thread number', () => {
    const store = useSpeedTestStore()
    store.setThreadNum(16)
    expect(store.threadNum).toBe(16)
    expect(localStorage.getItem('threadNum')).toBe('16')
  })

  it('updates run background setting', () => {
    const store = useSpeedTestStore()
    store.setRunBackground(true)
    expect(store.runBackground).toBe(true)
    expect(localStorage.getItem('runBackground')).toBe('true')
  })

  it('updates max use setting', () => {
    const store = useSpeedTestStore()
    store.setMaxUse(1073741824)
    expect(store.state.maxUse).toBe(1073741824)
    expect(localStorage.getItem('maxUse')).toBe('1073741824')
  })
})
