'use client'

import { useMemo, useState } from 'react'
import { MAX_NODES, reconcile, type Kind, type Node } from '@/lib/lab/cluster'
import { cn } from '@/lib/utils'
import { Check, Slider } from './controls'

const podStyle: Record<Kind, string> = {
  daemon: 'border border-ink/70 bg-transparent',
  stateful: 'bg-ink',
  web: 'bg-ink/45',
}

const legend: { kind: Kind; label: string }[] = [
  { kind: 'web', label: 'Deployment: web' },
  { kind: 'stateful', label: 'StatefulSet: db, pinned to a zone' },
  { kind: 'daemon', label: 'DaemonSet: log agent' },
]

function NodeCard({
  node,
  failed,
  onToggle,
}: {
  node: Node
  failed: boolean
  onToggle: () => void
}) {
  const used = node.pods.reduce((sum, p) => sum + p.cpu, 0)
  const percent = Math.round((used / node.cpu) * 100)

  return (
    <li className={cn('border p-3', failed ? 'border-signal' : 'hairline')}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn('font-mono text-sm font-medium', failed && 'line-through')}>
          {node.name}
        </span>
        <span className="label text-muted">Zone {node.zone}</span>
      </div>
      <ul className="mt-2 flex min-h-[3.25rem] flex-wrap content-start gap-1">
        {node.pods.map((pod) => (
          <li key={pod.name} title={pod.name} className={cn('h-3 w-3', podStyle[pod.kind])}>
            <span className="sr-only">{pod.name}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 h-1 bg-panel" aria-hidden="true">
        <div className="h-full bg-ink transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={cn('label', failed ? 'text-signal' : 'text-muted')}>
          {failed ? '✕ NotReady' : `${percent}% CPU requested`}
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${failed ? 'Restore' : 'Fail'} ${node.name}`}
          className="label link min-h-8 px-1"
        >
          {failed ? 'Restore' : 'Fail'}
        </button>
      </div>
    </li>
  )
}

export function ClusterLab() {
  const [demand, setDemand] = useState(800)
  const [target, setTarget] = useState(60)
  const [autoscale, setAutoscale] = useState(true)
  const [failedNodes, setFailedNodes] = useState<ReadonlySet<string>>(new Set())

  const state = useMemo(
    () => reconcile({ demand, target, autoscale, failedNodes }),
    [demand, target, autoscale, failedNodes]
  )

  const toggleNode = (name: string) =>
    setFailedNodes((current) => {
      const next = new Set(current)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-4">
        <Slider
          label="Web tier CPU demand"
          value={demand}
          display={`${demand}m`}
          min={200}
          max={8000}
          step={100}
          onChange={setDemand}
        />
        <Slider
          label="HPA target utilization"
          value={target}
          display={`${target}%`}
          min={30}
          max={90}
          step={5}
          onChange={setTarget}
        />
        <Check
          label={`Cluster Autoscaler, up to ${MAX_NODES} nodes`}
          checked={autoscale}
          onChange={setAutoscale}
        />

        <dl className="hairline grid grid-cols-3 gap-2 border-y py-3">
          {[
            ['Replicas', state.replicas],
            ['Nodes', state.nodes.length],
            ['Pending', state.pending.length],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="label text-muted">{term}</dt>
              <dd
                className={cn(
                  'display text-5xl',
                  term === 'Pending' && state.pending.length > 0 && 'text-signal'
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <ul className="space-y-1">
          {legend.map(({ kind, label }) => (
            <li key={kind} className="flex items-center gap-2 text-base leading-snug">
              <span aria-hidden="true" className={cn('h-3 w-3 shrink-0', podStyle[kind])} />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-8">
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {state.nodes.map((node) => (
            <NodeCard
              key={node.name}
              node={node}
              failed={failedNodes.has(node.name)}
              onToggle={() => toggleNode(node.name)}
            />
          ))}
        </ul>

        {state.pending.length > 0 && (
          <div className="mt-3 border border-dashed border-signal p-3">
            <p className="label text-signal">✕ Pending, no node can host these</p>
            <p className="mt-1 break-words font-mono text-xs leading-relaxed">
              {state.pending.map((p) => p.name).join(', ')}
            </p>
          </div>
        )}

        <div className="mt-4" role="status" aria-live="polite">
          <h3 className="label text-muted">Controller decisions</h3>
          <ol className="mt-2 space-y-1 bg-panel p-3 font-mono text-xs leading-relaxed">
            {state.log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
