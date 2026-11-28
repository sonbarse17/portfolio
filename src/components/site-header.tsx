'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SiteWordmark } from '@/components/site-wordmark'
import { FinderTrigger } from '@/components/finder-trigger'
import { nav } from '@/content/site'
import '@/app/site-chrome.css'

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const next = mounted && resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="header-tool"
      aria-label={mounted ? `Switch to ${next} theme` : 'Switch theme'}
      title={mounted ? `Switch to ${next} theme` : undefined}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        {next === 'dark' ? (
          <path d="M20.4 15.25A9 9 0 0 1 8.75 3.6a9 9 0 1 0 11.65 11.65Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
          </>
        )}
      </svg>
    </button>
  )
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div className="wrap header-inner">
        <SiteWordmark />
        <nav aria-label="Main" className="main-nav">
          <ul>
            {nav.map(({ href, label }) => {
              const current = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={current ? 'page' : undefined}
                    className={href === '/#contact' ? 'nav-contact' : undefined}
                    prefetch={false}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="header-actions">
          <FinderTrigger />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
