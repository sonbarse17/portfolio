import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArchitectureExplorer } from '@/components/architecture-explorer'
import { CaseRail } from '@/components/case-rail'
import { hasProjectArtwork, ProjectArtwork } from '@/components/project-artwork'
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
  return project ? { title: project.title, description: project.summary } : { title: 'Not found' }
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
    <dl className="detail-facts mt-8 grid sm:grid-cols-2 lg:grid-cols-4">
      {project.glance.map((fact) => (
        <div
          key={fact.label}
          className="hairline border-b py-4 lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <dt className="label text-muted">{fact.label}</dt>
          <dd className="mt-1 font-display text-xl font-bold leading-tight [font-stretch:80%]">
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function FlagshipMasthead({ project }: { project: Project }) {
  return (
    <header>
      <div className="case-feature">
        <div className="case-feature-copy">
          <ClassificationTag project={project} />
          <h1 className="display">{project.title}</h1>
          <p className="case-feature-summary">{project.summary}</p>
          <div className="case-feature-actions">
            <a href="#architecture" className="case-feature-primary">
              Explore the architecture
            </a>
            <a href="#outcome" className="case-feature-result">
              Results
            </a>
          </div>
        </div>
        <div className="case-feature-visual">
          <ProjectArtwork slug={project.slug} cover />
        </div>
      </div>
      <div className="case-context">
        <p className="label text-muted">
          <span>{project.category}</span>
          <span>{project.context}</span>
        </p>
        <Chips items={project.labels} />
      </div>
      <ProjectFacts project={project} />
    </header>
  )
}

function ProjectSection({
  project,
  entry: { id, title },
  presentation,
}: {
  project: Project
  entry: PresentedSection
  presentation: 'standard' | 'editorial' | 'architecture'
}) {
  const section = project.sections.find((s) => s.id === id)
  const lead = presentation === 'architecture'
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={
        lead
          ? 'case-architecture'
          : presentation === 'editorial'
            ? 'case-chapter'
            : 'hairline border-b py-8 first:pt-0 last:border-b-0'
      }
    >
      <div className="case-section-heading flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id={`${id}-title`}
          className={
            presentation === 'standard'
              ? 'font-display text-3xl font-bold leading-tight [font-stretch:80%]'
              : 'display'
          }
        >
          {title}
        </h2>
        <ProvenanceTag
          kind={
            section?.provenance ??
            (project.classification === 'professional' ? 'record' : 'personal')
          }
        />
      </div>

      {section?.body && <p className="case-section-body mt-3 max-w-[65ch]">{section.body}</p>}
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
  const overview = project.tier === 'overview'
  const illustrated = hasProjectArtwork(project.slug)
  const architecture = illustrated && sections.find(({ id }) => id === 'architecture')
  const chapters = architecture ? sections.filter(({ id }) => id !== architecture.id) : sections
  const contents = architecture ? [architecture, ...chapters] : chapters

  return (
    <main className={illustrated ? 'wrap case-page' : 'wrap pt-8'}>
      <Link href="/work" className={illustrated ? 'case-back label link' : 'label link'}>
        All work
      </Link>

      {illustrated ? (
        <FlagshipMasthead project={project} />
      ) : (
        <header className="detail-masthead">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <ClassificationTag project={project} />
            <Chips items={project.labels} />
          </div>
          <h1 className="h-section mt-3 max-w-5xl">{project.title}</h1>
          <p className="lede mt-5 max-w-3xl">{project.summary}</p>
          <ProjectFacts project={project} />
          <p className="label mt-3 flex flex-wrap gap-x-6 gap-y-1 text-muted">
            <span>{project.category}</span>
            <span>{project.context}</span>
            {project.views && (
              <a href="#architecture" className="link text-ink">
                Explore the architecture
              </a>
            )}
          </p>
        </header>
      )}

      {overview && (
        <p className="hairline mt-8 max-w-3xl border-l-2 border-ink bg-panel p-4 leading-snug">
          <span className="label mr-2">Overview only</span>
          This project is documented with verified scope and outcomes.
        </p>
      )}

      {architecture && (
        <ProjectSection project={project} entry={architecture} presentation="architecture" />
      )}

      <div
        className={
          illustrated ? 'case-reading' : 'hairline mt-12 grid gap-10 border-t pt-8 lg:grid-cols-12'
        }
      >
        <aside className={illustrated ? undefined : 'lg:col-span-3'}>
          <CaseRail sections={contents} showOnMobile={illustrated} />
        </aside>

        <div className={illustrated ? 'min-w-0' : 'min-w-0 lg:col-span-9'}>
          {chapters.map((entry) => (
            <ProjectSection
              key={entry.id}
              project={project}
              entry={entry}
              presentation={illustrated ? 'editorial' : 'standard'}
            />
          ))}
        </div>
      </div>

      <nav aria-label="Continue" className="mt-12 grid gap-px sm:grid-cols-2">
        {lab ? (
          <Link href={`/lab/${lab.slug}`} className="group border border-ink p-5">
            <span className="label text-muted">Related lab</span>
            <span className="display mt-2 block text-3xl transition-colors group-hover:text-accent">
              {lab.title}
            </span>
          </Link>
        ) : (
          <Link href="/lab" className="group border border-ink p-5">
            <span className="label text-muted">Try something</span>
            <span className="display mt-2 block text-3xl transition-colors group-hover:text-accent">
              The lab
            </span>
          </Link>
        )}
        <Link href={`/work/${next.slug}`} className="group border border-ink p-5 sm:border-l-0">
          <span className="label text-muted">Next project</span>
          <span className="display mt-2 block text-3xl transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      </nav>
    </main>
  )
}
