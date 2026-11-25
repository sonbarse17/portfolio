'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSceneSettings } from '@/components/scene-motion'
import { simulate, strategies, type StageStatus, type Strategy } from '@/lib/lab/pipeline'

const scenarios = [
  { id: '', label: 'Healthy release' },
  { id: 'cve', label: 'Critical image finding' },
  { id: 'bad-release', label: 'Regression in production' },
]

const stageStatus: Record<StageStatus, string> = {
  passed: 'Passed',
  failed: 'Blocked',
  skipped: 'Skipped',
  'rolled-back': 'Rolled back',
}

export type ReleaseSignal = {
  phase: number
  state: 'running' | 'passed' | 'failed' | 'rolled-back'
}

export function ReleaseRun({ onSignal }: { onSignal: (value: ReleaseSignal | null) => void }) {
  const scenario = useRef<HTMLSelectElement>(null)
  const [fault, setFault] = useState('')
  const [strategy, setStrategy] = useState<Strategy>('canary')
  const [shown, setShown] = useState<number | null>(null)
  const { paused, reduced } = useSceneSettings()
  const run = useMemo(
    () => simulate('service', strategy, new Set(fault ? [fault] : [])),
    [fault, strategy]
  )
  const blocked = run.steps.findIndex((step) => step.status === 'failed')
  const limit = blocked === -1 ? run.steps.length : blocked + 1
  const finished = shown !== null && shown >= limit
  const running = shown !== null && !finished

  useEffect(() => {
    const field = scenario.current
    if (!field) return
    field.focus({ preventScroll: true })
    field.scrollIntoView({ block: 'nearest' })
  }, [])

  useEffect(() => {
    if (shown === null) {
      onSignal(null)
      return
    }

    const count = finished ? limit - 1 : shown
    const phase = count < 3 ? 0 : count < 5 ? 1 : 2
    const state = !finished
      ? 'running'
      : run.outcome.shipped
        ? 'passed'
        : run.outcome.exposure
          ? 'rolled-back'
          : 'failed'
    onSignal({ phase, state })
  }, [finished, limit, onSignal, run.outcome, shown])

  useEffect(() => {
    if (!running || shown === null) return
    const timer = setTimeout(
      () => setShown(paused || reduced ? limit : shown + 1),
      paused || reduced ? 0 : 410
    )
    return () => clearTimeout(timer)
  }, [limit, paused, reduced, running, shown])

  return (
    <section className="release-run" aria-label="Deployment simulation">
      <p className="eyebrow">Browser simulation</p>
      <h3 className="display">Run a release</h3>
      <p className="release-description">
        Choose a scenario and follow the gates that decide whether it ships.
      </p>
      <div className="release-fields">
        <label>
          <span>Scenario</span>
          <select
            ref={scenario}
            className="field"
            value={fault}
            onChange={(event) => {
              setFault(event.currentTarget.value)
              setShown(null)
            }}
          >
            {scenarios.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Rollout strategy</span>
          <select
            className="field"
            value={strategy}
            onChange={(event) => {
              setStrategy(event.currentTarget.value as Strategy)
              setShown(null)
            }}
          >
            {(Object.keys(strategies) as Strategy[]).map((key) => (
              <option key={key} value={key}>
                {strategies[key].label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="button" className="btn" onClick={() => setShown(reduced || paused ? limit : 0)}>
        {shown === null ? 'Start simulation' : 'Run simulation again'}
      </button>
      <ol className="release-steps" aria-label="Simulation stages">
        {run.steps.map(({ stage, status }, index) => {
          const state = finished
            ? status
            : shown === null
              ? 'waiting'
              : index < shown
                ? 'passed'
                : index === shown
                  ? 'running'
                  : 'waiting'
          return (
            <li key={stage.id} data-state={state}>
              <span>{stage.label}</span>
              <small>
                {state === 'waiting'
                  ? 'Waiting'
                  : state === 'running'
                    ? 'Running'
                    : stageStatus[state]}
              </small>
            </li>
          )
        })}
      </ol>
      <div className="release-outcome" role="status" aria-atomic="true">
        {finished ? (
          <>
            <p>{run.outcome.summary}</p>
            {!run.outcome.shipped && <p>Simulated traffic exposed · {run.outcome.exposure}%</p>}
          </>
        ) : (
          <p>{running ? 'Simulation running.' : 'Ready to simulate.'}</p>
        )}
      </div>
    </section>
  )
}
