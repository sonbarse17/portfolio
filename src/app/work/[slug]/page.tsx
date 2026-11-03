import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArchitectureExplorer } from '@/components/architecture-explorer'
import { CaseRail } from '@/components/case-rail'
import { ProvenanceTag } from '@/components/provenance'
import {
  Accordion,
  BeforeAfter,
  Chips,
  ClassificationTag,
  StackGroups,
  Timeline,
} from '@/components/project-parts'
import { labs } from '@/content/labs'
import { projects, SECTION_ORDER, type Project } from '@/content/projects'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return project ? { title: project.title, description: project.summary } : { title: 'Not found' }
}

/** Sections in the fixed case-study order, including the two that are generated from structured data. */
function presentSections(project: Project) {
  const present: { id: string; title: string }[] = []
  for (const [id, title] of SECTION_ORDER) {
    const has =
      id === 'stack' ? project.stackGroups.length > 0 : project.sections.some((s) => s.id === id)
    if (has) present.push({ id, title })
  }
  return present
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const lab = labs.find((l) => l.slug === project.lab)
  const sections = presentSections(project)
  const overview = project.tier === 'overview'

  return (
    <main className="wrap pt-8">
      <Link href="/work" className="label link">
        ← All work
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <ClassificationTag project={project} />
        <Chips items={project.labels} />
      </div>
      <h1 className="h-section mt-3 max-w-5xl">{project.title}</h1>
      <p className="lede mt-5 max-w-3xl">{project.summary}</p>

      <dl className="hairline mt-8 grid border-y sm:grid-cols-2 lg:grid-cols-4">
        {project.glance.map((fact) => (
          <div
            key={fact.label}
            className="hairline border-b py-4 sm:pr-5 lg:border-b-0 lg:border-r lg:px-5 lg:first:pl-0 lg:last:border-r-0"
          >
            <dt className="label text-muted">{fact.label}</dt>
            <dd className="mt-1 font-display text-xl font-bold leading-tight [font-stretch:80%]">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-muted">
        <span>{project.category}</span>
        <span>{project.context}</span>
        {project.views && (
          <a href="#architecture" className="link text-ink">
            Jump to the architecture ↓
          </a>
        )}
      </p>

      {overview && (
        <p className="hairline mt-8 max-w-3xl border-l-2 border-ink bg-panel p-4 leading-snug">
          <span className="label mr-2">Overview only</span>
          This page publishes what is verified and stops there. There is no architecture diagram
          because none has been verified for it.
        </p>
      )}

      <div className="hairline mt-12 grid gap-10 border-t pt-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <CaseRail sections={sections} />
        </aside>

        <div className="min-w-0 lg:col-span-9">
          {sections.map(({ id, title }, i) => {
            const section = project.sections.find((s) => s.id === id)
            return (
              <section
                key={id}
                id={id}
                aria-labelledby={`${id}-title`}
                className="hairline scroll-mt-20 border-b py-8 first:pt-0 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2
                    id={`${id}-title`}
                    className="font-display text-3xl font-bold leading-tight [font-stretch:80%]"
                  >
                    <span className="label mr-3 align-middle text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {title}
                  </h2>
                  <ProvenanceTag
                    kind={
                      section?.provenance ??
                      (project.classification === 'professional' ? 'record' : 'personal')
                    }
                  />
                </div>

                {section?.body && <p className="mt-3 max-w-[65ch]">{section.body}</p>}
                {section?.points && (
                  <ul className="mt-3 max-w-[65ch] space-y-2">
                    {section.points.map((point) => (
                      <li key={point} className="grid grid-cols-[1.25rem_1fr] leading-snug">
                        <span aria-hidden="true" className="text-muted">
                          –
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {id === 'stack' && (
                  <div className="mt-4">
                    <StackGroups groups={project.stackGroups} />
                  </div>
                )}

                {id === 'architecture' && project.views && (
                  <ArchitectureExplorer title={project.title} views={project.views} />
                )}
                {section?.comparison && <BeforeAfter comparison={section.comparison} />}
                {section?.timeline && <Timeline items={section.timeline} />}

                {section?.details && (
                  <div className="mt-6">
                    <h3 className="label mb-2 text-muted">Technical notes</h3>
                    {section.details.map((d) => (
                      <Accordion key={d.title} title={d.title} provenance={d.provenance}>
                        {d.body}
                      </Accordion>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <nav aria-label="Continue" className="mt-12 grid gap-px sm:grid-cols-2">
        {lab ? (
          <Link href={`/lab/${lab.slug}`} className="group border border-ink p-5">
            <span className="label text-muted">Related lab</span>
            <span className="display mt-2 block text-3xl transition-colors group-hover:text-signal">
              {lab.title}
            </span>
          </Link>
        ) : (
          <Link href="/lab" className="group border border-ink p-5">
            <span className="label text-muted">Try something</span>
            <span className="display mt-2 block text-3xl transition-colors group-hover:text-signal">
              The lab
            </span>
          </Link>
        )}
        <Link href={`/work/${next.slug}`} className="group border border-ink p-5 sm:border-l-0">
          <span className="label text-muted">Next project</span>
          <span className="display mt-2 block text-3xl transition-colors group-hover:text-signal">
            {next.title}
          </span>
        </Link>
      </nav>
    </main>
  )
}
