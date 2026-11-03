'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** The contents of a case file, drawn as a line of stations that tracks reading position. */
export function CaseRail({ sections }: { sections: { id: string; title: string }[] }) {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="Case file sections" className="sticky top-20 hidden lg:block">
      <ol className="relative">
        <span aria-hidden="true" className="absolute bottom-3 left-[3px] top-3 w-px bg-ink/30" />
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={cn(
                'relative flex items-center gap-3 py-1 text-[0.9375rem] leading-snug transition-colors hover:text-signal',
                active === id ? 'text-ink' : 'text-muted'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 h-[7px] w-[7px] shrink-0 border',
                  active === id ? 'border-signal bg-signal' : 'border-ink/50 bg-paper'
                )}
              />
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
