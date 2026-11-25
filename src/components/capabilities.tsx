'use client'

import { useId, useState } from 'react'
import Link from 'next/link'

type Domain = {
  domain: string
  projects: {
    slug: string
    title: string
    tools: { tool: string; note?: string }[]
  }[]
  also: string[]
}

export function Capabilities({ domains }: { domains: Domain[] }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const current = domains[active]

  return (
    <div className="capability-map">
      <div className="capability-controls" role="group" aria-label="Engineering domains">
        {domains.map((domain, i) => (
          <button
            type="button"
            key={domain.domain}
            aria-pressed={i === active}
            aria-controls={id}
            onClick={() => setActive(i)}
          >
            <span aria-hidden="true" />
            {domain.domain}
          </button>
        ))}
      </div>
      <section id={id} aria-labelledby={`${id}-title`} className="capability-detail">
        <h3 id={`${id}-title`} className="display" aria-live="polite">
          {current.domain}
        </h3>
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
      </section>
    </div>
  )
}
