type Modifiers = { ctrlKey: boolean; metaKey: boolean; altKey: boolean }

/** True when a keypress should type into the target rather than drive page shortcuts. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as { tagName?: unknown; isContentEditable?: boolean } | null
  if (!element || typeof element.tagName !== 'string') return false
  if (element.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

/** Shift is allowed so `:` (Shift+;) still counts as a plain key. */
export function hasModifier(event: Modifiers): boolean {
  return event.ctrlKey || event.metaKey || event.altKey
}

export function nextIndex(current: number, step: 1 | -1, length: number): number {
  if (length === 0) return -1
  if (current < 0) return step === 1 ? 0 : length - 1
  return Math.min(length - 1, Math.max(0, current + step))
}
