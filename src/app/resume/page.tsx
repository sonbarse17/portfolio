import type { Metadata } from 'next'
import Link from 'next/link'
import { PrintResume } from '@/components/print-resume'
import { projects } from '@/content/projects'
import { background, roles, site } from '@/content/site'

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'Experience, selected engineering work, and education for Sushant Sonbarse.',
}

const selected = projects.filter(
  (project) => project.classification === 'professional' && project.tier === 'case'
)

export default function ResumePage() {
  return (
    <main className="wrap resume">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 no-print">
        <p className="eyebrow">Résumé</p>
        <PrintResume />
      </div>
      <h1 className="h-page">{site.name}</h1>
      <p className="lede mt-2">{site.role}</p>
      <div className="resume-contacts mt-2 text-sm">
        <Link href="/" className="link">
          sushantsonbarse.in
        </Link>
        <a href={site.linkedin} className="link" target="_blank" rel="noopener noreferrer">
          linkedin.com/in/sushant-sonbarse
        </a>
        <a href={site.github} className="link" target="_blank" rel="noopener noreferrer">
          github.com/sonbarse17
        </a>
      </div>

      <section className="resume-section" aria-labelledby="resume-experience">
        <h2 id="resume-experience" className="display">
          Experience
        </h2>
        {roles.map((role) => (
          <div key={role.title} className="resume-entry">
            <h3>{role.title}</h3>
            <p className="text-muted">
              {role.org} · {role.where} · {role.when}
            </p>
            <ul>
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-section" aria-labelledby="resume-work">
        <h2 id="resume-work" className="display">
          Selected work
        </h2>
        {selected.map((project) => (
          <div key={project.slug} className="resume-entry">
            <h3>
              <Link href={`/work/${project.slug}`} className="link">
                {project.title}
              </Link>
            </h3>
            <p>{project.summary}</p>
          </div>
        ))}
      </section>

      <section className="resume-section" aria-labelledby="resume-education">
        <h2 id="resume-education" className="display">
          Education and training
        </h2>
        {background.map((item) => (
          <div key={item.title} className="resume-entry">
            <h3>{item.title}</h3>
            <p className="text-muted">
              {item.org} · {item.when}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}
