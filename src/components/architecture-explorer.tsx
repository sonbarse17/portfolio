'use client'

import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Schematic, edgeKey, type SchematicTone } from '@/components/schematic'
import type { DiagramView, NodeStatus } from '@/content/projects/types'
import { cn } from '@/lib/utils'

const tone: Record<NodeStatus, SchematicTone> = {
  implemented: 'ok',
  dependency: 'idle',
  followup: 'warn',
}
const word: Record<NodeStatus, string> = {
  implemented: 'built in this project',
  dependency: 'application or external system',
  followup: 'follow-up, not completed',
}
const legend: { status: NodeStatus; swatch: string; text: string }[] = [
  {
    status: 'implemented',
    swatch: 'border-2 border-ink',
    text: 'Built in this project',
  },
  { status: 'dependency', swatch: 'border border-ink/50', text: 'Application or external system' },
  {
    status: 'followup',
    swatch: 'border border-dashed border-warn',
    text: 'Follow-up, not completed',
  },
]

export function ArchitectureExplorer({ title, views }: { title: string; views: DiagramView[] }) {
  const uid = useId()
  const [viewId, setViewId] = useState(views[0].id)
  const [step, setStep] = useState<number | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const view = views.find((v) => v.id === viewId)!
  const steps = useMemo(() => view.steps ?? [], [view])
  const node = view.nodes.find((n) => n.id === selected)

  const open = (id: string) => {
    setViewId(id)
    setStep(null)
    setSelected(null)
  }

  const onTabKey = (event: KeyboardEvent, index: number) => {
    const last = views.length - 1
    const target =
      event.key === 'ArrowRight'
        ? index === last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft'
          ? index === 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (target === null) return
    event.preventDefault()
    open(views[target].id)
    tabs.current[target]?.focus()
  }

  const highlight = useMemo(() => {
    if (step === null || !steps[step]) return undefined
    const pairs = steps[step].edges
    return {
      nodes: new Set(pairs.flat()),
      edges: new Set(pairs.map(([a, b]) => edgeKey(a, b))),
    }
  }, [step, steps])

  // Several steps can share one edge, so its marker lists every step number that uses it.
  const badges = useMemo(() => {
    const grouped = new Map<string, number[]>()
    steps.forEach((s, i) =>
      s.edges.forEach(([a, b]) => {
        const key = edgeKey(a, b)
        grouped.set(key, [...(grouped.get(key) ?? []), i + 1])
      })
    )
    return [...grouped].map(([edge, numbers]) => ({
      edge,
      label: [...new Set(numbers)].join(','),
      active: step !== null && numbers.includes(step + 1),
    }))
  }, [steps, step])

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label={`${title} diagram views`}
        className="hairline -mx-4 flex gap-1 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0"
      >
        {views.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            id={`${uid}-tab-${v.id}`}
            role="tab"
            type="button"
            aria-selected={v.id === viewId}
            aria-controls={`${uid}-panel`}
            tabIndex={v.id === viewId ? 0 : -1}
            onClick={() => open(v.id)}
            onKeyDown={(e) => onTabKey(e, i)}
            className={cn(
              'label min-h-11 shrink-0 border-b-2 px-3 transition-colors hover:text-signal',
              v.id === viewId ? 'border-signal text-ink' : 'border-transparent text-muted'
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${viewId}`}
        className="mt-4 grid gap-8 lg:grid-cols-12"
      >
        <div className="min-w-0 lg:col-span-8">
          <p className="mb-3 leading-snug text-muted">{view.caption}</p>
          <div className="bg-panel/40 p-2 sm:p-4">
            <Schematic
              title={`${title}: ${view.label}`}
              height={view.height}
              hideSubOnMobile
              animate={false}
              selectMode="select"
              nodes={view.nodes.map((n) => ({
                id: n.id,
                label: n.label,
                sub: n.sub,
                x: n.x,
                y: n.y,
                tone: tone[n.status],
                status: word[n.status],
              }))}
              edges={view.edges}
              regions={view.regions}
              highlight={highlight}
              badges={badges}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {legend.map((l) => (
              <li key={l.status} className="label flex items-center gap-2 text-muted">
                <span
                  aria-hidden="true"
                  className={cn('inline-block h-3 w-5 bg-paper', l.swatch)}
                />
                {l.text}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-4">
          {steps.length > 0 && (
            <>
              <h3 className="label text-muted">Follow the flow</h3>
              <ol className="mt-2 space-y-1">
                {steps.map((s, i) => (
                  <li key={s.text}>
                    <button
                      type="button"
                      aria-pressed={step === i}
                      onClick={() => setStep(step === i ? null : i)}
                      className={cn(
                        'grid min-h-11 w-full grid-cols-[1.75rem_1fr] gap-x-1 border px-2 py-2 text-left leading-snug transition-colors hover:border-signal',
                        step === i ? 'border-ink bg-panel' : 'border-transparent'
                      )}
                    >
                      <span className="label text-muted">{i + 1}</span>
                      <span>{s.text}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className={cn(steps.length > 0 && 'hairline mt-5 border-t pt-4')} aria-live="polite">
            {node ? (
              <>
                <h3 className="display text-3xl">{node.label}</h3>
                <p className="label mt-1 text-muted">
                  {node.status === 'implemented' ? '■ ' : node.status === 'followup' ? '◐ ' : '□ '}
                  {word[node.status]}
                </p>
                <p className="mt-2 leading-snug">{node.detail}</p>
              </>
            ) : (
              <p className="leading-snug text-muted">
                Select any component for what it is and whether it was built in this project.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
