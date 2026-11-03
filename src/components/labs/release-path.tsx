'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  definitions,
  presets,
  simulate,
  strategies,
  type PresetId,
  type StageStatus,
  type Strategy,
} from '@/lib/lab/pipeline'
import { cn } from '@/lib/utils'
import { Check, Segmented } from './controls'

const STEP_MS = 550

const statusLook: Record<StageStatus, { word: string; mark: string; className: string }> = {
  passed: { word: 'Passed', mark: '●', className: 'text-ok' },
  failed: { word: 'Failed', mark: '✕', className: 'text-signal' },
  skipped: { word: 'Skipped', mark: '○', className: 'text-muted' },
  'rolled-back': { word: 'Rolled back', mark: '↺', className: 'text-warn' },
}

export function ReleasePathLab() {
  const [presetId, setPresetId] = useState<PresetId>('service')
  const [strategy, setStrategy] = useState<Strategy>('canary')
  const [faults, setFaults] = useState<ReadonlySet<string>>(new Set())
  const [shown, setShown] = useState<number | null>(null)
  const [definition, setDefinition] = useState(definitions[0].id)

  const preset = presets.find((p) => p.id === presetId)!
  const run = useMemo(() => simulate(presetId, strategy, faults), [presetId, strategy, faults])
  const finished = shown !== null && shown >= run.steps.length

  useEffect(() => {
    if (shown === null || finished) return
    const timer = setTimeout(() => setShown(shown + 1), STEP_MS)
    return () => clearTimeout(timer)
  }, [shown, finished])

  const start = () => {
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setShown(instant ? run.steps.length : 1)
  }

  const toggleFault = (id: string, on: boolean) => {
    setShown(null)
    setFaults((current) => {
      const next = new Set(current)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })
  }

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <Segmented
            legend="Pipeline"
            value={presetId}
            onChange={(value) => {
              setPresetId(value)
              setFaults(new Set())
              setShown(null)
            }}
            options={presets.map((p) => ({ value: p.id, label: p.label }))}
          />
          <Segmented
            legend="Rollout strategy"
            value={strategy}
            onChange={(value) => {
              setStrategy(value)
              setShown(null)
            }}
            options={(Object.keys(strategies) as Strategy[]).map((s) => ({
              value: s,
              label: strategies[s].label,
            }))}
          />
          <p className="text-base leading-snug text-muted">{strategies[strategy].note}</p>
          <fieldset>
            <legend className="label mb-1 text-muted">Inject a fault</legend>
            {preset.faults.map((fault) => (
              <Check
                key={fault.id}
                label={fault.label}
                checked={faults.has(fault.id)}
                onChange={(on) => toggleFault(fault.id, on)}
              />
            ))}
          </fieldset>
          <button type="button" className="btn w-full" onClick={start}>
            {shown === null ? 'Run release' : 'Run again'}
          </button>
        </div>

        <div className="lg:col-span-8">
          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-3 left-[0.4rem] top-3 w-px bg-ink/30"
            />
            {run.steps.map((step, i) => {
              const revealed = shown !== null && i < shown
              const look = statusLook[step.status]
              return (
                <li key={step.stage.id} className="relative grid grid-cols-[1.5rem_1fr] gap-2 py-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'relative z-10 flex h-6 w-3.5 items-center justify-center bg-paper text-sm leading-none',
                      revealed ? look.className : 'text-muted'
                    )}
                  >
                    {revealed ? look.mark : '○'}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-display text-xl font-bold [font-stretch:80%]">
                        {step.stage.label}
                      </span>
                      <span className={cn('label', revealed ? look.className : 'text-muted')}>
                        {revealed ? look.word : 'Waiting'}
                      </span>
                    </div>
                    <p className="text-base leading-snug text-muted">
                      {revealed ? step.note : step.stage.does}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="hairline mt-4 border-t pt-4" role="status" aria-live="polite">
            {finished ? (
              <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
                <p>
                  <span className="display block text-6xl">{run.outcome.exposure}%</span>
                  <span className="label text-muted">Users exposed to the bad build</span>
                </p>
                <div>
                  <p className="leading-snug">{run.outcome.summary}</p>
                  <div className="mt-3 h-2 w-full bg-panel" aria-hidden="true">
                    <div
                      className="h-full bg-signal transition-[width] duration-500"
                      style={{ width: `${run.outcome.exposure}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted">
                {shown === null ? 'Choose a fault and run the release.' : 'Release running.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12" aria-labelledby="definitions">
        <h3 id="definitions" className="display text-3xl">
          One pipeline, three dialects
        </h3>
        <p className="mt-2 max-w-2xl leading-snug text-muted">
          The service pipeline above as illustrative configuration: the stages carry over, and only
          the syntax changes. Trimmed for reading, so treat these as sketches and not as drop-in
          files.
        </p>
        <div className="mt-4">
          <Segmented
            legend="CI system"
            value={definition}
            onChange={setDefinition}
            options={definitions.map((d) => ({ value: d.id, label: d.label }))}
          />
        </div>
        <pre
          tabIndex={0}
          aria-label={`${definitions.find((d) => d.id === definition)!.label} pipeline definition`}
          className="mt-3 overflow-x-auto bg-panel p-4 font-mono text-[0.8125rem] leading-relaxed"
        >
          <code>{definitions.find((d) => d.id === definition)!.code}</code>
        </pre>
      </section>
    </div>
  )
}
