'use client'

import { useMemo, useState } from 'react'
import { Schematic, edgeKey, type SchematicTone } from '@/components/schematic'
import {
  capabilities,
  capabilitiesAffectedBy,
  dependents,
  describeChange,
  edges,
  evaluate,
  nodes,
  nodesIn,
  scenarioFailures,
  scenarios,
  type Cloud,
  type Env,
  type Health,
  type LogEntry,
} from '@/lib/lab/topology'
import { Segmented, healthClass, healthMark, healthWord } from './controls'
import { cn } from '@/lib/utils'

const toneFor: Record<Health, SchematicTone> = { ok: 'ok', degraded: 'warn', down: 'fault' }
const kindMark: Record<LogEntry['kind'], string> = {
  fail: '✕',
  recover: '●',
  effect: '›',
  reset: '○',
}
const kindClass: Record<LogEntry['kind'], string> = {
  fail: 'text-signal',
  recover: 'text-ok',
  effect: 'text-muted',
  reset: 'text-muted',
}

export function BlastRadiusLab() {
  const [env, setEnv] = useState<Env>('prod')
  const [cloud, setCloud] = useState<Cloud>('aws')
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])

  const { nodeState, capabilityState } = useMemo(() => evaluate(env, failed), [env, failed])
  const inspected = nodes.find((n) => n.id === selected)
  const present = nodesIn(env)
  const healthy = present.filter((n) => nodeState[n.id] === 'ok').length

  /** One place that changes state and records what happened, so the log can never drift from it. */
  const commit = (next: ReadonlySet<string>, headline?: string) => {
    const changes = describeChange(env, failed, next)
    setLog((current) => {
      const step = (current.at(-1)?.step ?? 0) + 1
      const head: Omit<LogEntry, 'step'>[] = headline ? [{ kind: 'reset', text: headline }] : []
      return [...current, ...[...head, ...changes].map((c) => ({ ...c, step }))].slice(-40)
    })
    setFailed(next)
  }

  const failNode = (id: string) => commit(new Set(failed).add(id))

  const runScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id)!
    setSelected(null)
    commit(scenarioFailures(env, scenario), `Scenario: ${scenario.label}`)
  }

  const recover = (id: string) => {
    const next = new Set(failed)
    next.delete(id)
    commit(next)
  }

  const changeEnv = (value: Env) => {
    setEnv(value)
    setFailed(new Set())
    setSelected(null)
    setLog([
      {
        step: (log.at(-1)?.step ?? 0) + 1,
        kind: 'reset',
        text: `Switched to ${value === 'prod' ? 'production, two zones' : 'dev, one zone'}. All components healthy.`,
      },
    ])
  }

  const affected = new Set(present.filter((n) => nodeState[n.id] !== 'ok').map((n) => n.id))
  const highlight = failed.size
    ? {
        nodes: affected,
        edges: new Set(
          edges
            .filter(([a, b]) => affected.has(a) && affected.has(b))
            .map(([a, b]) => edgeKey(a, b))
        ),
      }
    : undefined

  const chain = inspected ? dependents(env, inspected.id) : []
  const lost = inspected ? capabilitiesAffectedBy(env, inspected.id) : []
  const dependsOn = inspected
    ? inspected.requires.map((group) =>
        group
          .filter((id) => present.some((n) => n.id === id))
          .map((id) => nodes.find((n) => n.id === id)!.label)
          .join(' or ')
      )
    : []

  const statusLine = capabilities
    .map((c) => `${c.label}: ${healthWord[capabilityState[c.id]]}`)
    .join('. ')

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <Segmented
          legend="Environment"
          value={env}
          onChange={changeEnv}
          options={[
            { value: 'prod', label: 'Prod, two zones' },
            { value: 'dev', label: 'Dev, one zone' },
          ]}
        />
        <Segmented
          legend="Service names"
          value={cloud}
          onChange={setCloud}
          options={[
            { value: 'aws', label: 'AWS' },
            { value: 'azure', label: 'Azure' },
            { value: 'gcp', label: 'GCP' },
          ]}
        />
      </div>

      <fieldset className="mt-5">
        <legend className="label mb-1.5 text-muted">Failure scenarios</legend>
        <div className="flex flex-wrap gap-1">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              className="btn-quiet"
              disabled={scenarioFailures(env, s).size === 0}
              title={
                scenarioFailures(env, s).size === 0
                  ? 'This environment has no such component'
                  : undefined
              }
              onClick={() => runScenario(s.id)}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            className="btn"
            disabled={failed.size === 0}
            onClick={() => {
              setSelected(null)
              commit(new Set(), 'Restore all components')
            }}
          >
            Restore all
          </button>
        </div>
      </fieldset>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label mb-3 flex flex-wrap justify-between gap-2 text-muted">
            <span>Select a component to inspect it, fail it or recover it</span>
            <span>
              {healthy} of {present.length} components healthy
            </span>
          </p>
          <Schematic
            title="System topology. Each component is a button that selects it."
            selectMode="select"
            height="h-[35rem]"
            hideSubOnMobile
            nodes={present.map((n) => ({
              id: n.id,
              label: n.label,
              sub: n.services[cloud],
              x: n.x,
              y: n.y,
              tone: toneFor[nodeState[n.id]],
              status: failed.has(n.id) ? 'failed' : healthWord[nodeState[n.id]].toLowerCase(),
            }))}
            edges={edges}
            highlight={highlight}
            bands={
              env === 'prod'
                ? [
                    { label: 'Zone A', x: 27 },
                    { label: 'Zone B', x: 73 },
                  ]
                : [{ label: 'Zone A', x: 27 }]
            }
            selected={selected}
            onSelect={setSelected}
          />
          <p className="label mt-2 text-muted">
            Solid red is failed. Dashed amber is degraded: working, but with redundancy lost.
          </p>
        </div>

        <aside className="lg:col-span-4">
          <h3 className="label text-muted">What users can do</h3>
          <ul className="hairline mt-2 divide-y border-y" aria-hidden="true">
            {capabilities.map((c) => {
              const health = capabilityState[c.id]
              return (
                <li
                  key={c.id}
                  className="hairline flex items-baseline justify-between gap-4 py-2.5"
                >
                  <span>{c.label}</span>
                  <span className={cn('label', healthClass[health])}>
                    {healthMark[health]} {healthWord[health]}
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="sr-only" role="status">
            {statusLine}
          </p>

          <div className="mt-6 min-h-52" aria-live="polite">
            {inspected ? (
              <>
                <h3 className="display text-3xl">{inspected.label}</h3>
                <p className="label mt-1 text-muted">
                  {inspected.services[cloud]} ·{' '}
                  <span className={healthClass[nodeState[inspected.id]]}>
                    {healthMark[nodeState[inspected.id]]} {healthWord[nodeState[inspected.id]]}
                  </span>
                </p>
                <p className="mt-3 leading-snug">{inspected.role}</p>

                <dl className="mt-3 space-y-2 leading-snug">
                  {dependsOn.length > 0 && (
                    <div>
                      <dt className="label text-muted">Depends on</dt>
                      <dd>{dependsOn.join(' and ')}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="label text-signal">If lost</dt>
                    <dd>{inspected.onFailure}</dd>
                  </div>
                  {(chain.length > 0 || lost.length > 0) && (
                    <div>
                      <dt className="label text-muted">Dependency chain</dt>
                      <dd>
                        {[
                          inspected.label,
                          chain.length > 0 &&
                            chain.map((id) => nodes.find((n) => n.id === id)!.label).join(', '),
                          lost.length > 0 && lost.map((c) => c.label).join(', '),
                        ]
                          .filter(Boolean)
                          .join(' → ')}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="label text-muted">Recovery action</dt>
                    <dd>{inspected.recovery}</dd>
                  </div>
                </dl>

                {failed.has(inspected.id) ? (
                  <button type="button" className="btn mt-4" onClick={() => recover(inspected.id)}>
                    Apply recovery
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-quiet mt-4"
                    onClick={() => failNode(inspected.id)}
                  >
                    Fail this component
                  </button>
                )}
              </>
            ) : (
              <p className="leading-snug text-muted">
                Run a scenario, or select a component and fail it. Try the database primary, then
                the identity service. Then switch to dev and lose zone A. The same fault has a very
                different result.
              </p>
            )}
          </div>
        </aside>
      </div>

      <section className="hairline mt-8 border-t pt-4" aria-labelledby="event-log">
        <h3 id="event-log" className="label text-muted">
          Event log
        </h3>
        <div
          role="log"
          aria-live="polite"
          tabIndex={0}
          aria-label="Simulation event log"
          className="mt-2 max-h-56 overflow-y-auto bg-panel p-3 font-mono text-xs leading-relaxed"
        >
          <ol className="space-y-1">
            {log.length === 0 && (
              <li className="text-muted">No events yet. Fail a component to start.</li>
            )}
            {[...log]
              .sort((a, b) => b.step - a.step)
              .map((entry, i) => (
                <li key={`${entry.step}-${i}`} className="grid grid-cols-[3rem_1rem_1fr]">
                  <span className="text-muted">T+{entry.step}</span>
                  <span aria-hidden="true" className={kindClass[entry.kind]}>
                    {kindMark[entry.kind]}
                  </span>
                  <span>{entry.text}</span>
                </li>
              ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
