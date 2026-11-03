import Link from 'next/link'
import { ProvenanceTag, type ProvenanceKind } from '@/components/provenance'
import type { Comparison, Project, TimelineItem } from '@/content/projects/types'
import { cn } from '@/lib/utils'

export function Chips({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-1', className)}>
      {items.map((item) => (
        <li key={item} className="label border border-ink/50 px-1.5 py-0.5">
          {item}
        </li>
      ))}
    </ul>
  )
}

export function ClassificationTag({ project }: { project: Project }) {
  return <ProvenanceTag kind={project.classification === 'professional' ? 'record' : 'personal'} />
}

/** Native <details>, so it works without JavaScript and is keyboard accessible by default. */
export function Accordion({
  title,
  provenance,
  children,
}: {
  title: string
  provenance: ProvenanceKind
  children: React.ReactNode
}) {
  return (
    <details className="group hairline border-t last:border-b">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-3 marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="font-medium leading-snug">{title}</span>
        <span className="flex shrink-0 items-center gap-3">
          <ProvenanceTag kind={provenance} />
          <span aria-hidden="true" className="w-3 text-center font-mono">
            <span className="group-open:hidden">+</span>
            <span className="hidden group-open:inline">−</span>
          </span>
        </span>
      </summary>
      <p className="max-w-[65ch] pb-4 leading-snug text-muted">{children}</p>
    </details>
  )
}

export function StackGroups({ groups }: { groups: Project['stackGroups'] }) {
  return (
    <dl className="hairline divide-y border-y">
      {groups.map((g) => (
        <div key={g.group} className="hairline grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
          <dt className="label pt-0.5 text-muted">{g.group}</dt>
          <dd className="leading-snug">{g.items.join(' / ')}</dd>
        </div>
      ))}
    </dl>
  )
}

export function BeforeAfter({ comparison }: { comparison: Comparison }) {
  return (
    <div className="mt-6">
      <h3 className="label text-muted">Before and after</h3>
      <div className="hairline mt-2 border-y">
        <div
          className="hairline hidden border-b py-2 sm:grid sm:grid-cols-[9rem_1fr_1fr] sm:gap-4"
          aria-hidden="true"
        >
          <span />
          <span className="label text-muted">Before</span>
          <span className="label text-muted">After</span>
        </div>
        <ul className="divide-y">
          {comparison.rows.map((row) => (
            <li
              key={row.aspect}
              className="hairline grid gap-x-4 gap-y-1 py-3 sm:grid-cols-[9rem_1fr_1fr]"
            >
              <span className="label pt-0.5">{row.aspect}</span>
              <span className="leading-snug text-muted">
                <span className="label mr-2 sm:hidden">Before</span>
                {row.before}
              </span>
              <span className="leading-snug">
                <span className="label mr-2 text-muted sm:hidden">After</span>
                {row.after}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const mark = { done: '●', reviewed: '◐' } as const

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative mt-4">
      <span aria-hidden="true" className="absolute bottom-3 left-[0.4rem] top-3 w-px bg-ink/30" />
      {items.map((item, i) => (
        <li
          key={`${i}-${item.text}`}
          className="relative grid grid-cols-[1.5rem_1.75rem_1fr] gap-x-1 py-1.5"
        >
          <span
            aria-hidden="true"
            className={cn(
              'relative z-10 flex h-6 w-3.5 items-center justify-center bg-paper text-sm leading-none',
              item.status === 'done' ? 'text-ok' : 'text-warn'
            )}
          >
            {mark[item.status]}
          </span>
          <span className="label pt-1 text-muted">{String(i + 1).padStart(2, '0')}</span>
          <div className="leading-snug">
            {item.text}
            {item.env && (
              <span className="ml-2 inline-flex gap-1 align-middle">
                {item.env.map((e) => (
                  <span key={e} className="label border border-ink px-1.5 py-0.5">
                    {e}
                  </span>
                ))}
              </span>
            )}
            <span className="sr-only">
              {item.status === 'done' ? ' (completed)' : ' (reviewed, follow-up remains)'}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <li className="hairline">
      <Link
        href={`/work/${project.slug}`}
        className="group grid gap-x-6 gap-y-2 py-6 lg:grid-cols-12"
      >
        <span className="label text-muted lg:col-span-1">{String(index + 1).padStart(2, '0')}</span>
        <div className="lg:col-span-7">
          <h3 className="display text-3xl transition-colors group-hover:text-signal sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-[60ch] leading-snug text-muted">{project.summary}</p>
        </div>
        <div className="space-y-2 lg:col-span-4">
          <ClassificationTag project={project} />
          <Chips items={project.labels} />
          <p className="label text-muted">{project.category}</p>
        </div>
      </Link>
    </li>
  )
}
