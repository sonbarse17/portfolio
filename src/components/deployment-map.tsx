'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useId, useRef, useState } from 'react'
import { useSceneActivity } from '@/components/scene-motion'
import type { ReleaseSignal } from '@/components/release-run'

const ReleaseRun = dynamic(
  () => import('@/components/release-run').then((module) => module.ReleaseRun),
  { loading: () => <p role="status">Loading deployment simulation…</p> }
)

const stages = [
  {
    label: 'Build',
    caption: 'Build an artifact',
    description: 'Run tests and security checks, then publish a versioned image to the registry.',
    chapter: 'Prove the change.',
    story:
      'A commit starts a repeatable process. The checks run against the code and its dependencies before an image can move forward.',
  },
  {
    label: 'Deploy',
    caption: 'Roll out the change',
    description:
      'Apply infrastructure changes, then roll out the same image behind readiness checks.',
    chapter: 'Ship the same artifact.',
    story:
      'The registry hands off an immutable image. Start with a small rollout, wait for readiness, and expand only when the service can handle traffic.',
  },
  {
    label: 'Operate',
    caption: 'Watch the rollout',
    description:
      'Compare health signals with the baseline and decide whether to continue or roll back.',
    chapter: 'Make recovery a decision.',
    story:
      'A healthy process is visible to the team. Latency and errors show whether a rollout should advance, pause, or return to a known-good version.',
  },
] as const

const nodes = [
  {
    label: 'Commit',
    x: 99,
    y: 273,
    icon: 'M-7-9v17m0-13c11 0 14-2 14-8m-11 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm14-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM-4 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  },
  { label: 'CI checks', x: 203, y: 212, icon: 'm-11 1 7 7 15-17' },
  {
    label: 'Registry',
    x: 311,
    y: 150,
    icon: 'M0-12 12-5v12L0 14-12 7V-5L0-12Zm-12 7L0 2l12-7M0 2v12',
  },
  {
    label: 'Infrastructure',
    x: 424,
    y: 216,
    icon: 'm-12 4 12 7L12 4M-12-2 0 5l12-7m-24-4 12-7 12 7',
  },
  { label: 'Rollout', x: 518, y: 270, icon: 'M-11 8h22M-8 4v-6m8 6v-15m8 15v-9' },
  { label: 'Telemetry', x: 612, y: 324, icon: 'M-13 0h7l4-8L4 8l4-8h6' },
]

const routes = [
  'M99 273 203 212',
  'M203 212 311 150',
  'M311 150 424 216',
  'M424 216 518 270',
  'M518 270 612 324',
]

function PipelineProjection({ stage }: { stage: number }) {
  const id = useId()

  return (
    <svg className="pipeline-projection" viewBox="0 60 720 370" fill="none" aria-hidden="true">
      <defs>
        <pattern id={`${id}-floor`} width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0v22" stroke="#a8bf9d" strokeOpacity="0.28" strokeWidth="0.8" />
        </pattern>
        <radialGradient id={`${id}-light`}>
          <stop stopColor="#9cec78" stopOpacity=".15" />
          <stop offset="1" stopColor="#9cec78" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        className="pipeline-halo"
        cx="390"
        cy="236"
        rx="240"
        ry="194"
        fill={`url(#${id}-light)`}
      />
      <path className="pipeline-plane-shadow" d="M30 284v12l324 119 332-87v-12l-332 87Z" />
      <path className="pipeline-plane" d="M30 284 310 123l376 193-332 87Z" />
      <path d="M30 284 310 123l376 193-332 87Z" fill={`url(#${id}-floor)`} />
      <path className="pipeline-plane-inset" d="M54 284 311 137l350 177-308 77Z" />
      <path
        className="pipeline-braces"
        d="m310 123 5-53m-9 0h18M30 284 13 296m673 20 19 7m-351 80v17m-8 0h16M92 320l65-39 55 9 85-50m-45 131 84-49 88 28 80-31M114 254l70-41m355 16 66 36"
      />
      {routes.map((path, index) => (
        <g key={path} className="pipeline-route" data-charged={index < (stage + 1) * 2}>
          <path d={path} className="pipeline-route-track" />
          <path d={path} className="pipeline-route-lit" pathLength="1" />
          {Math.floor(index / 2) === stage && (
            <path d={path} className="pipeline-route-packet" pathLength="1" />
          )}
        </g>
      ))}
      {nodes.map((node, index) => (
        <g
          key={node.label}
          transform={`translate(${node.x} ${node.y})`}
          className="pipeline-node"
          data-active={Math.floor(index / 2) === stage}
        >
          <path className="pipeline-node-floor" d="m-39 0 39-21 39 21-39 21Z" />
          <path className="pipeline-node-support" d="M-26 0v-32M26 0v-32M0 16v-32" />
          <g className="pipeline-node-cap">
            <path className="pipeline-node-side" d="m-33-31 33 17 33-17v9L0-5l-33-17Z" />
            <path className="pipeline-node-face" d="m-33-31 33-18 33 18L0-14Z" />
            <path
              className="pipeline-node-icon"
              d={node.icon}
              transform="translate(0 -31) matrix(.75 .41 -.66 .37 0 0)"
            />
          </g>
          <text x="0" y="39" textAnchor="middle">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function DeploymentMap() {
  const [activeStage, setActiveStage] = useState(0)
  const [showRun, setShowRun] = useState(false)
  const [signal, setSignal] = useState<ReleaseSignal | null>(null)
  const { ref, active } = useSceneActivity<HTMLDivElement>()
  const chapters = useRef<Array<HTMLElement | null>>([])
  const id = useId()
  const stage = stages[activeStage]
  const phase = showRun ? (signal?.phase ?? 0) : activeStage

  useEffect(() => {
    if (!active || showRun) return

    let frame = 0
    const desktop = window.matchMedia('(min-width: 900px)')
    const update = () => {
      frame = 0
      if (!desktop.matches) return

      const pivot = window.innerHeight * 0.54
      const chapter = chapters.current.findIndex((item) => {
        const bounds = item?.getBoundingClientRect()
        return bounds && bounds.top <= pivot && bounds.bottom >= pivot
      })
      if (chapter !== -1) setActiveStage(chapter)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [active, showRun])

  function select(index: number) {
    setActiveStage(index)
    if (active && window.matchMedia('(min-width: 900px)').matches) {
      chapters.current[index]?.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }

  return (
    <section className="pipeline-section" id="pipeline" aria-labelledby="pipeline-title">
      <div className="wrap">
        <div className="section-heading pipeline-heading">
          <div>
            <p className="eyebrow">Deployment path</p>
            <h2 id="pipeline-title" className="h-section">
              From commit to production.
            </h2>
          </div>
          <p className="section-note">
            Follow a change through build, rollout, and the signals that tell you what to do next.
          </p>
        </div>
        <div className="pipeline-layout" data-simulation={showRun}>
          <div className="pipeline-console">
            <div
              className="pipeline-art"
              ref={ref}
              data-running={active}
              data-stage={phase}
              data-signal={signal?.state}
            >
              <div className="pipeline-art-labels">
                <span>Release topology</span>
                <span>Interactive model</span>
              </div>
              <PipelineProjection stage={phase} />
            </div>
            <div className="pipeline-controls" role="group" aria-label="Deployment stages">
              {stages.map((item, index) => (
                <button
                  type="button"
                  key={item.label}
                  aria-pressed={phase === index}
                  aria-controls={id}
                  disabled={showRun}
                  onClick={() => select(index)}
                >
                  <span aria-hidden="true" />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="pipeline-readout">
              <div id={id} className="pipeline-summary" aria-live="polite">
                {stages.map((item, index) => (
                  <div key={item.label} data-active={phase === index}>
                    <strong>{item.caption}</strong>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="pipeline-actions">
                <button
                  type="button"
                  className="btn-quiet"
                  aria-expanded={showRun}
                  aria-controls={`${id}-run`}
                  onClick={() => {
                    setSignal(null)
                    setShowRun(!showRun)
                  }}
                >
                  {showRun ? 'Close simulation' : 'Simulate a deployment'}
                </button>
                <Link href="/lab/release-path" prefetch={false} className="text-link">
                  Fail a stage yourself
                </Link>
              </div>
            </div>
          </div>
          <div id={`${id}-run`} hidden={!showRun}>
            {showRun && <ReleaseRun onSignal={setSignal} />}
          </div>
          <div className="pipeline-chapters" aria-label="Release stages" hidden={showRun}>
            {stages.map((item, index) => (
              <article
                key={item.label}
                ref={(element) => {
                  chapters.current[index] = element
                }}
                className="pipeline-chapter"
                data-current={stage.label === item.label}
              >
                <div>
                  <p className="eyebrow">{item.label}</p>
                  <h3 className="display">{item.chapter}</h3>
                  <p>{item.story}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
