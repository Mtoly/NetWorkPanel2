import { describe, it, expect, vi, afterEach } from 'vitest'
import { isSafeExternalUrl, safeOpenExternalUrl } from '@/services/url'

describe('url security helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('allows http and https urls', () => {
    expect(isSafeExternalUrl('https://example.com')).toBe(true)
    expect(isSafeExternalUrl('http://example.com/path?a=1')).toBe(true)
  })

  it('rejects dangerous or invalid protocols', () => {
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeExternalUrl('data:text/html;base64,PHNjcmlwdA==')).toBe(false)
    expect(isSafeExternalUrl('file:///etc/passwd')).toBe(false)
    expect(isSafeExternalUrl('not a url')).toBe(false)
    expect(isSafeExternalUrl('/relative/path')).toBe(false)
  })

  it('opens safe urls with noopener and noreferrer', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    expect(safeOpenExternalUrl('https://example.com')).toBe(true)
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer')
  })

  it('does not open unsafe urls', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null)

    expect(safeOpenExternalUrl('javascript:alert(1)')).toBe(false)
    expect(openSpy).not.toHaveBeenCalled()
  })
})
