import { describe, it, expect } from 'vitest'
import { cn, sanitizeInput, validateUrl, debounce, memoize } from '@/lib/utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    })
  })

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('')
    })

    it('should remove special characters', () => {
      expect(sanitizeInput('test<>"\'')).toBe('test')
    })

    it('should handle non-string input', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
      expect(sanitizeInput(123)).toBe('')
    })
  })

  describe('validateUrl', () => {
    it('should validate allowed domains', () => {
      expect(validateUrl('https://github.com/test')).toBe(true)
      expect(validateUrl('https://api.github.com/test')).toBe(true)
    })

    it('should reject invalid domains', () => {
      expect(validateUrl('https://malicious.com')).toBe(false)
    })

    it('should handle invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let count = 0
      const fn = debounce(() => count++, 100)

      fn()
      fn()
      fn()

      expect(count).toBe(0)

      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(count).toBe(1)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      let callCount = 0
      const fn = memoize((x: number) => {
        callCount++
        return x * 2
      })

      expect(fn(5)).toBe(10)
      expect(fn(5)).toBe(10)
      expect(callCount).toBe(1)
    })
  })
})
