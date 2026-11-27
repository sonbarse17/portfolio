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
      <ol className="relative before:absolute before:bottom-3 before:left-[3px] before:top-3 before:w-px before:bg-ink/30 before:content-['']">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? 'location' : undefined}
              className={cn(
                'relative flex items-center gap-3 py-1 text-[0.9375rem] leading-snug transition-colors hover:text-accent',
                active === id ? 'text-ink' : 'text-muted'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'relative z-10 h-[7px] w-[7px] shrink-0 border',
                  active === id ? 'border-accent bg-accent' : 'border-ink/50 bg-paper'
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
