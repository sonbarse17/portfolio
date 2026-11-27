'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** The contents of a case file, drawn as a line of stations that tracks reading position. */
export function CaseRail({
  sections,
  showOnMobile = false,
}: {
  sections: { id: string; title: string }[]
  showOnMobile?: boolean
}) {
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
    <>
      <nav aria-label="Case file sections" className="sticky top-24 hidden lg:block">
        <p className="label mb-3 text-muted">In this case study</p>
        <SectionLinks sections={sections} active={active} />
      </nav>
      {showOnMobile && (
        <details className="hairline border-y lg:hidden">
          <summary className="label min-h-11 cursor-pointer py-3 text-ink">
            In this case study
          </summary>
          <nav aria-label="Case file sections" className="mb-3">
            <SectionLinks sections={sections} active={active} />
          </nav>
        </details>
      )}
    </>
  )
}

function SectionLinks({
  sections,
  active,
}: {
  sections: { id: string; title: string }[]
  active: string
}) {
  return (
    <ol className="relative before:absolute before:bottom-3 before:left-[3px] before:top-3 before:w-px before:bg-ink/30 before:content-['']">
      {sections.map(({ id, title }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={active === id ? 'location' : undefined}
            className={cn(
              'relative flex min-h-11 items-center gap-3 text-[0.9375rem] leading-snug transition-colors hover:text-accent lg:min-h-8',
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
  )
}
