import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArchitectureExplorer } from '@/components/architecture-explorer'
import { CaseRail } from '@/components/case-rail'
import { hasProjectArtwork, ProjectArtwork } from '@/components/project-artwork'
import { ProvenanceTag } from '@/components/provenance'
import { Accordion, BeforeAfter, StackGroups, Timeline } from '@/components/project-parts'
import { labs } from '@/content/labs'
import { projects, SECTION_ORDER, type Project, type SectionId } from '@/content/projects'
import '../case-study.css'

type Props = { params: Promise<{ slug: string }> }
type PresentedSection = { id: SectionId; title: string }

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return project
    ? pageMetadata(`/work/${slug}`, project.title, project.summary)
    : { title: 'Not found' }
}

function presentSections(project: Project) {
  const present: PresentedSection[] = []
  for (const [id, title] of SECTION_ORDER) {
    const has =
      id === 'stack' ? project.stackGroups.length > 0 : project.sections.some((s) => s.id === id)
    if (has) present.push({ id, title })
  }
  return present
}

function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl className="case-facts" data-count={project.glance.length}>
      {project.glance.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProjectMasthead({ project }: { project: Project }) {
  const illustrated = hasProjectArtwork(project.slug)
  const hasResults = project.sections.some(({ id }) => id === 'outcome')
  const qualifiers = project.labels.filter((label) => label !== project.context)

  return (
    <header className="case-masthead">
      <div className="case-masthead-copy">
        <div>
          <ProvenanceTag
            kind={project.classification === 'professional' ? 'record' : 'personal'}
            className="case-provenance"
          />
          <h1>{project.title}</h1>
        </div>
        <div className="case-masthead-intro">
          <p>{project.summary}</p>
          {(project.views || hasResults) && (
            <nav className="case-actions" aria-label="Project highlights">
              {project.views && (
                <a href="#architecture" className="text-link">
                  Explore the architecture
                </a>
              )}
              {hasResults && (
                <a href="#outcome" className="text-link">
                  Results
                </a>
              )}
            </nav>
          )}
        </div>
      </div>
      {illustrated && (
        <figure className="case-cover" data-project={project.slug}>
          <ProjectArtwork slug={project.slug} cover />
          <figcaption>Concept illustration</figcaption>
        </figure>
      )}
      <ul className="case-context">
        <li>{project.category}</li>
        <li>{project.context}</li>
        {qualifiers.map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <ProjectFacts project={project} />
    </header>
  )
}

function ProjectSection({
  project,
  entry: { id, title },
}: {
  project: Project
  entry: PresentedSection
}) {
  const section = project.sections.find((s) => s.id === id)
  const defaultProvenance = project.classification === 'professional' ? 'record' : 'personal'
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="case-chapter">
      <div className="case-section-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        {section && section.provenance !== defaultProvenance && (
          <ProvenanceTag kind={section.provenance} className="case-provenance" />
        )}
      </div>

      {section?.body && <p className="case-section-body">{section.body}</p>}
      {section?.points && (
        <ul className="case-section-points">
          {section.points.map((point) => (
            <li key={point}>{point}</li>
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
        <div className="case-notes mt-6">
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
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const project = projects[index]
  const next = projects[(index + 1) % projects.length]
  const lab = labs.find((l) => l.slug === project.lab)
  const sections = presentSections(project)

  return (
    <main className="wrap case-page">
      <Link href="/work" className="case-back text-link">
        All work
      </Link>
      <ProjectMasthead project={project} />

      {project.tier === 'overview' && (
        <p className="case-overview">
          {project.context !== 'Overview only' && <strong>Overview only. </strong>}
          This project is documented with verified scope and outcomes.
        </p>
      )}

      <div className="case-reading">
        <aside>
          <CaseRail sections={sections} showOnMobile />
        </aside>

        <div className="min-w-0">
          {sections.map((entry) => (
            <ProjectSection key={entry.id} project={project} entry={entry} />
          ))}
        </div>
      </div>

      <nav aria-label="Continue" className="case-continue">
        <Link href={lab ? `/lab/${lab.slug}` : '/lab'}>
          <span>{lab ? 'Related lab' : 'Try something'}</span>
          <strong>{lab ? lab.title : 'The lab'}</strong>
        </Link>
        <Link href={`/work/${next.slug}`}>
          <span>Next project</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </main>
  )
}
