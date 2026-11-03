import { describe, it, expect } from 'vitest'
import { cn, sanitizeInput } from '@/lib/utils'

describe('cn', () => {
  it('merges classes and drops falsy values', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  it('lets the later Tailwind class win', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})

describe('sanitizeInput', () => {
  it('removes script blocks and markup', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('')
    expect(sanitizeInput('<b>hi</b>')).toBe('hi')
  })

  it('removes special characters', () => {
    expect(sanitizeInput('test<>"\'')).toBe('test')
  })

  it('returns an empty string for non-strings', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(123)).toBe('')
  })
})
