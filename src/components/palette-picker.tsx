'use client'

import { useTheme } from 'next-themes'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { DEFAULT_PALETTE, palettes } from '@/content/palettes'

const swatches = ['accent', 'keyword', 'string', 'number', 'function', 'type'] as const
const steps: Record<string, 1 | -1> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }

export function PalettePicker() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  useEffect(() => setMounted(true), [])

  const active = mounted ? (theme ?? DEFAULT_PALETTE) : DEFAULT_PALETTE
  const activeIndex = Math.max(
    0,
    palettes.findIndex((palette) => palette.slug === active)
  )

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  // Focus follows the checked option while open (roving tabindex).
  useEffect(() => {
    if (open) options.current[activeIndex]?.focus()
  }, [open, activeIndex])

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (!open) return
    const step = steps[event.key]
    if (step) {
      if (!(event.target as HTMLElement).matches('[role="radio"]')) return
      event.preventDefault()
      const next = (activeIndex + step + palettes.length) % palettes.length
      setTheme(palettes[next].slug)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="palette-picker" ref={root} onKeyDown={onKeyDown}>
      <button
        ref={trigger}
        type="button"
        className="header-tool palette-trigger"
        aria-label="Theme: change palette"
        aria-expanded={open}
        aria-controls={`${id}-palettes`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">:theme</span>
      </button>
      <div
        id={`${id}-palettes`}
        className="palette-list"
        role="radiogroup"
        aria-label="Palette"
        hidden={!open}
      >
        {palettes.map((palette, index) => (
          <button
            key={palette.slug}
            ref={(node) => {
              options.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={palette.slug === active}
            tabIndex={index === activeIndex ? 0 : -1}
            className="palette-option"
            onClick={() => {
              setTheme(palette.slug)
              close()
            }}
          >
            <span className="palette-name">{palette.name}</span>
            <span className="palette-description">{palette.description}</span>
            <span className="palette-swatches" aria-hidden="true">
              {swatches.map((key) => (
                <i key={key} style={{ background: palette.colors[key] }} />
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
