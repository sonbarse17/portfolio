'use client'

import { flushSync } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PortfolioFinder } from '@/components/portfolio-finder'
import { hasModifier, isTypingTarget } from '@/lib/keys'

export function FinderTrigger() {
  const [open, setOpen] = useState(false)
  const [initial, setInitial] = useState('')
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setInitial('')
        setOpen(true)
        return
      }
      if (
        event.key === ':' &&
        !event.isComposing &&
        !hasModifier(event) &&
        !isTypingTarget(event.target) &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault()
        // Mount the finder inside this keydown so characters typed straight after `:` reach it.
        flushSync(() => {
          setInitial(':')
          setOpen(true)
        })
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])

  return (
    <>
      <button
        type="button"
        ref={trigger}
        className="header-tool"
        title="Find in portfolio (Ctrl or Command + K)"
        aria-label="Find in portfolio"
        aria-keyshortcuts="Control+K Meta+K"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setInitial('')
          setOpen(true)
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="10.5" cy="10.5" r="5.7" />
          <path d="m15 15 4.6 4.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && <PortfolioFinder onClose={close} initialQuery={initial} />}
    </>
  )
}
