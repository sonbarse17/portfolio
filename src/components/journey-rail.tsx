'use client'

import { useEffect, useRef, useState } from 'react'
import { chapters } from '@/content/chapters'

export function JourneyRail() {
  const [current, setCurrent] = useState(0)
  const rail = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = chapters.map(({ id }) => document.getElementById(id))
    let frame = 0
    const update = () => {
      frame = 0
      const pivot = window.innerHeight * 0.38
      const distance = sections.map((section) => section?.getBoundingClientRect().top ?? Infinity)
      let index = 0
      distance.forEach((top, i) => {
        if (top <= pivot) index = i
      })
      const next = distance[index + 1]
      const gap = next - distance[index]
      const portion =
        next === undefined
          ? 1
          : Math.max(0, Math.min(1, (pivot - distance[index]) / Math.max(1, gap)))
      const progress = (index + portion) / (chapters.length - 1)
      rail.current?.style.setProperty('--chapter-progress', String(Math.min(1, progress)))
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
    <nav ref={rail} className="journey-rail" aria-label="Portfolio chapters">
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
        </ol>
        <div aria-hidden="true" className="journey-progress" />
      </div>
    </nav>
  )
}
