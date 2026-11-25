'use client'

import { useId, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useSceneActivity } from '@/components/scene-motion'

type Domain = {
  domain: string
  projects: {
    slug: string
    title: string
    tools: { tool: string; note?: string }[]
  }[]
  also: string[]
}

const positions = [
  [18, 15],
  [18, 33],
  [18, 51],
  [50, 15],
  [50, 33],
  [50, 83],
  [82, 15],
  [82, 33],
  [82, 58],
  [82, 83],
]

export function Capabilities({ domains }: { domains: Domain[] }) {
  const [active, setActive] = useState(0)
  const { ref, active: animated } = useSceneActivity<HTMLDivElement>()
  const id = useId()
  const current = domains[active]

  return (
    <div className="capability-map" ref={ref} data-running={animated}>
      <div className="capability-controls" role="group" aria-label="Engineering domains">
        <svg
          className="capability-wiring"
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            className="capability-grid-line"
            d="M8 9h84v81H8zm26 0v81m32-81v81M8 26h84M8 45h84M8 64h84M8 82h84"
          />
          {positions.map(([x, y], i) => {
            const elbow = x < 50 ? 34 : x > 50 ? 66 : 50
            const route = `M50 60H${elbow}V${y}H${x}`
            return (
              <g key={i} data-live={i === active}>
                <path className="capability-wire" d={route} vectorEffect="non-scaling-stroke" />
                {i === active && (
                  <path
                    className="capability-packet"
                    d={route}
                    pathLength="1"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </g>
            )
          })}
          <path className="capability-core" d="m50 53 5 7-5 7-5-7Z" />
        </svg>
        {domains.map((domain, index) => {
          const [x, y] = positions[index]
          return (
            <button
              type="button"
              key={domain.domain}
              aria-pressed={index === active}
              aria-controls={id}
              style={{ '--node-x': `${x}%`, '--node-y': `${y}%` } as CSSProperties}
              onClick={() => setActive(index)}
            >
              <span aria-hidden="true" />
              {domain.domain}
            </button>
          )
        })}
      </div>
      <section id={id} aria-labelledby={`${id}-title`} className="capability-detail">
        <h3 id={`${id}-title`} className="display" aria-live="polite">
          {current.domain}
        </h3>
        <div className="capability-evidence" key={current.domain}>
          <ul className="capability-projects" aria-label="Tools mapped to projects">
            {current.projects.map((project) => (
              <li className="capability-project" key={project.slug}>
                <ul>
                  {project.tools.map((item) => (
                    <li key={item.tool}>
                      {item.tool}
                      {item.note && <small>{item.note}</small>}
                    </li>
                  ))}
                </ul>
                <Link href={`/work/${project.slug}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
          {current.also.length > 0 && (
            <p className="capability-more">
              <span className="label">Also worked with</span>
              {current.also.join(', ')}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
