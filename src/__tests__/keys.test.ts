import { describe, expect, it } from 'vitest'
import { hasModifier, isTypingTarget, nextIndex } from '@/lib/keys'

describe('isTypingTarget', () => {
  it('is true for form fields and editable content', () => {
    expect(isTypingTarget({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true)
    expect(isTypingTarget({ tagName: 'TEXTAREA' } as unknown as EventTarget)).toBe(true)
    expect(isTypingTarget({ tagName: 'SELECT' } as unknown as EventTarget)).toBe(true)
    expect(
      isTypingTarget({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)
    ).toBe(true)
  })

  it('is false for links, the page and nothing', () => {
    expect(isTypingTarget({ tagName: 'A' } as unknown as EventTarget)).toBe(false)
    expect(isTypingTarget({} as EventTarget)).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})

describe('hasModifier', () => {
  it('ignores shift but not ctrl, meta or alt', () => {
    const none = { ctrlKey: false, metaKey: false, altKey: false }
    expect(hasModifier(none)).toBe(false)
    expect(hasModifier({ ...none, ctrlKey: true })).toBe(true)
    expect(hasModifier({ ...none, metaKey: true })).toBe(true)
    expect(hasModifier({ ...none, altKey: true })).toBe(true)
  })
})

describe('nextIndex', () => {
  it('enters the list at the start going down and at the end going up', () => {
    expect(nextIndex(-1, 1, 5)).toBe(0)
    expect(nextIndex(-1, -1, 5)).toBe(4)
  })

  it('moves by one and stops at either end', () => {
    expect(nextIndex(2, 1, 5)).toBe(3)
    expect(nextIndex(4, 1, 5)).toBe(4)
    expect(nextIndex(0, -1, 5)).toBe(0)
  })

  it('returns -1 for an empty list', () => {
    expect(nextIndex(0, 1, 0)).toBe(-1)
  })
})
