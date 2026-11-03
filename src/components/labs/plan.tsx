'use client'

import { useMemo, useState } from 'react'
import { Schematic, type SchematicTone } from '@/components/schematic'
import { changes, plan, renderPlan, resources, type Action } from '@/lib/lab/plan'
import { Check } from './controls'

const toneFor: Record<Action, SchematicTone> = { 'no-op': 'idle', update: 'warn', replace: 'fault' }
const subFor: Record<Action, string> = { 'no-op': '', update: '~ update', replace: '-/+ replace' }

const graphEdges = resources.flatMap((r) => r.dependsOn.map((d): [string, string] => [d.id, r.id]))

export function PlanLab() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set(['tag']))
  const [preventDestroy, setPreventDestroy] = useState(true)

  const result = useMemo(() => plan(selected, preventDestroy), [selected, preventDestroy])

  const toggle = (id: string, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <fieldset>
          <legend className="label mb-1 text-muted">Change the configuration</legend>
          {changes.map((change) => (
            <Check
              key={change.id}
              label={change.label}
              checked={selected.has(change.id)}
              onChange={(on) => toggle(change.id, on)}
            />
          ))}
        </fieldset>
        <div className="hairline mt-3 border-t pt-3">
          <Check
            label={
              <>
                <code className="font-mono text-sm">prevent_destroy</code> on the database
              </>
            }
            checked={preventDestroy}
            onChange={setPreventDestroy}
          />
        </div>

        {result.levels.length > 0 && result.blockers.length === 0 && (
          <div className="mt-5">
            <h3 className="label text-muted">Apply order</h3>
            <ol className="mt-2 space-y-1.5">
              {result.levels.map((level, i) => (
                <li
                  key={level.join()}
                  className="grid grid-cols-[1.5rem_1fr] font-mono text-xs leading-snug"
                >
                  <span className="text-muted">{i + 1}</span>
                  <span className="break-words">{level.join(', ')}</span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-base leading-snug text-muted">
              Resources in one step have no dependency between them, so they apply in parallel.
            </p>
          </div>
        )}
      </div>

      <div className="min-w-0 lg:col-span-8">
        <Schematic
          title="Resource dependency graph, showing the action planned for each resource"
          height="h-[26rem]"
          nodes={resources.map((r) => {
            const action = result.actions.get(r.id)!
            return {
              id: r.id,
              label: r.label,
              sub: subFor[action] || undefined,
              x: r.x,
              y: r.y,
              tone: toneFor[action],
            }
          })}
          edges={graphEdges}
        />
        <div className="mt-6" role="status" aria-live="polite">
          <h3 className="label text-muted">Plan output, styled after terraform plan</h3>
          <pre
            tabIndex={0}
            aria-label="Plan output"
            className="mt-2 overflow-x-auto bg-panel p-4 font-mono text-[0.8125rem] leading-relaxed"
          >
            <code className={result.blockers.length ? 'text-signal' : undefined}>
              {renderPlan(result)}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
