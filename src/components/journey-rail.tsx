'use client'

import { useEffect, useState } from 'react'
import { chapters } from '@/content/chapters'

export function JourneyRail() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id))
    let frame = 0
    const update = () => {
      frame = 0
      const pivot = window.innerHeight * 0.38
      let index = 0
      sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top < pivot) index = i
      })
      setCurrent(index)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav className="journey-rail" aria-label="Portfolio chapters">
      <div className="wrap journey-inner">
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <a aria-current={current === index ? 'location' : undefined} href={`#${chapter.id}`}>
                <span className="journey-node" aria-hidden="true" />
                {chapter.label}
              </a>
            </li>
          ))}
          <li
            aria-hidden="true"
            className="journey-progress"
            style={{ transform: `scaleX(${(current + 1) / chapters.length})` }}
          />
        </ol>
      </div>
    </nav>
  )
}
