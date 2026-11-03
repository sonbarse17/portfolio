'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { nav } from '@/content/site'
import { cn } from '@/lib/utils'

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const current = resolvedTheme === 'dark' ? 'dark' : 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="label min-h-11 whitespace-nowrap transition-colors hover:text-signal"
      aria-label={mounted ? `Switch to ${next} theme` : 'Switch theme'}
    >
      Theme: {mounted ? current : '...'}
    </button>
  )
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="hairline relative z-40 border-b bg-paper sm:sticky sm:top-0">
      <a
        href="#content"
        className="label sr-only bg-ink px-4 py-3 text-paper focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50"
      >
        Skip to content
      </a>
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6">
        <Link href="/" className="label flex min-h-11 items-center hover:text-signal">
          S. Sonbarse
        </Link>
        <nav aria-label="Main" className="order-last w-full sm:order-none sm:ml-auto sm:w-auto">
          <ul className="flex justify-between gap-3 sm:gap-6">
            {nav.map(({ href, label }) => {
              const current = !href.includes('#') && pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'label flex min-h-11 items-center border-b-2 border-transparent transition-colors hover:text-signal',
                      current && 'border-signal'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="sm:ml-6">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
