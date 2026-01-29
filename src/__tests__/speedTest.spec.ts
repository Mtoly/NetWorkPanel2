import { describe, it, expect } from 'vitest'
import { formatter, urlParser, checkUrl } from '@/services/speedTest'

describe('speedTest service', () => {
  describe('formatter', () => {
    it('formats bytes correctly', () => {
      expect(formatter(1024, 0, [0, 0, 0, 0, 0, 0])).toBe('1KB')
      expect(formatter(1048576, 0, [0, 0, 0, 0, 0, 0])).toBe('1MB')
      expect(formatter(1073741824, 0, [0, 0, 0, 0, 0, 0])).toBe('1GB')
    })

    it('formats speed correctly', () => {
      expect(formatter(1024, 1, [0, 0, 0, 0, 0, 0])).toBe('1KB/s')
      expect(formatter(1048576, 1, [0, 0, 0, 0, 0, 0])).toBe('1MB/s')
    })

    it('formats bits correctly', () => {
      expect(formatter(1024, 2, [0, 0, 0, 0, 0, 0])).toBe('1Kbps')
      expect(formatter(1048576, 2, [0, 0, 0, 0, 0, 0])).toBe('1Mbps')
    })
  })

  describe('urlParser', () => {
    it('parses valid HTTP URLs', () => {
      expect(urlParser('http://example.com')).toBe('http://example.com')
      expect(urlParser('https://example.com/path')).toBe('https://example.com/path')
    })

    it('extracts URLs from text', () => {
      expect(urlParser('Check out https://example.com for more')).toBe('https://example.com')
    })

    it('returns empty string for invalid URLs', () => {
      expect(urlParser('not a url')).toBe('')
      expect(urlParser('ftp://example.com')).toBe('')
    })

    it('validates hostname length', () => {
      const longHost = 'a'.repeat(254)
      expect(urlParser(`https://${longHost}.com`)).toBe('')
    })
  })
})
