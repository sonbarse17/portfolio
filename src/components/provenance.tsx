import { cn } from '@/lib/utils'

export type ProvenanceKind = 'record' | 'personal' | 'reference' | 'simulation' | 'live'

export const provenance: Record<ProvenanceKind, { label: string; means: string; mark: string }> = {
  record: {
    label: 'Professional',
    means:
      'Professional work and background, taken from my own records. These are the only claims about what I did at work.',
    mark: '■',
  },
  personal: {
    label: 'Personal project',
    means: 'Built on my own to learn and practise. Not client work and not a production claim.',
    mark: '◆',
  },
  reference: {
    label: 'Reference',
    means:
      'How this class of system is designed. Engineering reasoning, not a claim about a specific engagement.',
    mark: '□',
  },
  simulation: {
    label: 'Simulation',
    means: 'Real logic running in your browser. No cloud account or live system sits behind it.',
    mark: '◇',
  },
  live: {
    label: 'Live',
    means: 'A true fact about this site, generated when it was built.',
    mark: '●',
  },
}

export function ProvenanceTag({ kind, className }: { kind: ProvenanceKind; className?: string }) {
  const { label, mark, means } = provenance[kind]
  return (
    <span
      title={means}
      className={cn(
        'label inline-flex items-center gap-1.5 whitespace-nowrap',
        kind === 'record' ? 'text-ink' : 'text-muted',
        className
      )}
    >
      <span aria-hidden="true">{mark}</span>
      {label}
    </span>
  )
}

export function ProvenanceLegend() {
  return (
    <dl className="hairline divide-y border-y">
      {(Object.keys(provenance) as ProvenanceKind[]).map((kind) => (
        <div key={kind} className="hairline grid gap-1 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
          <dt>
            <ProvenanceTag kind={kind} className="text-ink" />
          </dt>
          <dd className="text-base leading-snug text-muted">{provenance[kind].means}</dd>
        </div>
      ))}
    </dl>
  )
}
