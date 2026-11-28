'use client'

import { useEffect } from 'react'
import { hasModifier, isTypingTarget, nextIndex } from '@/lib/keys'

/** j/k move focus through [data-nav-stop] links on the homepage. */
export function HomeKeys() {
  useEffect(() => {
    let current = -1
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'j' && event.key !== 'k') return
      if (hasModifier(event) || isTypingTarget(event.target)) return
      if (document.querySelector('dialog[open]')) return
      if (event.target instanceof Element && event.target.closest('[role="radiogroup"]')) return

      const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-stop]')).filter(
        (stop) => getComputedStyle(stop).visibility === 'visible'
      )
      const focused = stops.indexOf(document.activeElement as HTMLElement)
      current = nextIndex(
        focused >= 0 ? focused : current,
        event.key === 'j' ? 1 : -1,
        stops.length
      )
      if (current < 0) return

      event.preventDefault()
      stops.forEach((stop, index) => stop.toggleAttribute('data-nav-current', index === current))
      const target = stops[current]
      target.focus({ preventScroll: true })
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
    }
    // Focus that moves anywhere other than the marked stop (Tab, click) clears the mark.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && target.hasAttribute('data-nav-current')) return
      document
        .querySelectorAll('[data-nav-current]')
        .forEach((stop) => stop.removeAttribute('data-nav-current'))
      current = -1
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [])

  return null
}
