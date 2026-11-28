'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SiteWordmark } from '@/components/site-wordmark'
import { FinderTrigger } from '@/components/finder-trigger'
import { nav } from '@/content/site'
import '@/app/site-chrome.css'

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
        </div>
      </div>
    </header>
  )
}
