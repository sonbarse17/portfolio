'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'

const PortfolioFinder = dynamic(
  () => import('@/components/portfolio-finder').then((module) => module.PortfolioFinder),
  { ssr: false }
)

export function FinderTrigger() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
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
        className="theme-toggle finder-trigger"
        title="Find in portfolio (Ctrl or Command + K)"
        aria-label="Find in portfolio"
        aria-keyshortcuts="Control+K Meta+K"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
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
      {open && <PortfolioFinder onClose={close} />}
    </>
  )
}
