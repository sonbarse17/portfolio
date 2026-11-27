'use client'

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useSceneActivity } from '@/components/scene-motion'
import { edgeKey } from '@/components/schematic'
import type { DiagramNode, DiagramView, NodeStatus, Step } from '@/content/projects/types'
import { cn } from '@/lib/utils'
import '@/app/architecture-trace.css'

const statusLabels: Record<NodeStatus, string> = {
  implemented: 'Built in this project',
  dependency: 'Application or external system',
  followup: 'Follow-up, not completed',
}

const HOP_MS = 2400
const clampShift = (value: number) => Math.max(-3.5, Math.min(3.5, value))
type Hop = { from: DiagramNode; to: DiagramNode }

function ArchitectureMap({
  view,
  step,
  hops,
  selected,
  motion,
  onSelect,
}: {
  view: DiagramView
  step: number | null
  hops: Hop[]
  selected: DiagramNode | undefined
  motion: boolean
  onSelect: (id: string) => void
}) {
  const byId = new Map(view.nodes.map((node) => [node.id, node]))
  const activeNodes = new Set(hops.flatMap(({ from, to }) => [from, to]))
  const activeEdges = new Set(hops.map(({ from, to }) => edgeKey(from.id, to.id)))
  const framedNodes = selected ? [selected] : [...activeNodes]
  const frame = (axis: 'x' | 'y') => {
    if (!framedNodes.length) return '0%'
    const points = framedNodes.map((node) => node[axis])
    return `${clampShift((50 - (Math.min(...points) + Math.max(...points)) / 2) * 0.16)}%`
  }
  const style = { '--trace-shift-x': frame('x'), '--trace-shift-y': frame('y') } as CSSProperties

  return (
    <div className="trace-map-frame">
      <div className="trace-viewport" role="region" aria-label="Architecture diagram viewport">
        <div
          className={cn('trace-map', view.height ?? 'h-[26rem]')}
          data-dense={view.nodes.length > 5}
          data-framed={framedNodes.length > 0}
          data-tracing={step !== null}
          style={style}
        >
          {view.regions?.map(({ label, x, y, w, h }) => (
            <div
              aria-hidden="true"
              className="trace-boundary"
              key={label}
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
            >
              <span>{label}</span>
            </div>
          ))}
          <svg
            aria-hidden="true"
            className="trace-cables"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {view.edges.map(({ from, to }) => {
              const a = byId.get(from)
              const b = byId.get(to)
              if (!a || !b) return null
              const id = edgeKey(from, to)
              return (
                <line
                  key={id}
                  data-active={activeEdges.has(id)}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
            {hops.map(({ from, to }) => {
              const x = (from.x + to.x) / 2
              const y = (from.y + to.y) / 2
              const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI)
              return (
                <path
                  className="trace-arrow"
                  key={`${from.id}-${to.id}`}
                  d="M-0.9 -0.9L0.55 0L-0.9 0.9"
                  transform={`translate(${x} ${y}) rotate(${angle})`}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
            {motion &&
              hops.map(({ from, to }, i) => (
                <path
                  key={`${step}-${from.id}-${to.id}`}
                  className="trace-packet"
                  d={`M${from.x} ${from.y}L${to.x} ${to.y}`}
                  pathLength="100"
                  vectorEffect="non-scaling-stroke"
                  style={{ animationDelay: `${i * 240}ms` }}
                />
              ))}
          </svg>
          {view.edges.map(({ from, to, label }) => {
            if (!label) return null
            const a = byId.get(from)
            const b = byId.get(to)
            if (!a || !b) return null
            return (
              <span
                aria-hidden="true"
                className="trace-cable-label"
                data-active={activeEdges.has(edgeKey(from, to))}
                key={`${from}-${to}`}
                style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%` }}
              >
                {label}
              </span>
            )
          })}
          {view.nodes.map((node) => (
            <button
              aria-label={`${node.label}${node.sub ? `, ${node.sub}` : ''}: ${statusLabels[node.status]}`}
              aria-pressed={selected?.id === node.id}
              className="trace-node"
              data-active={activeNodes.has(node)}
              data-status={node.status}
              key={node.id}
              onClick={() => onSelect(node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              type="button"
            >
              <span className="trace-node-mark" aria-hidden="true" />
              <span>{node.label}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="trace-legend" aria-label="Component status legend">
        {(Object.entries(statusLabels) as [NodeStatus, string][]).map(([status, label]) => (
          <li key={status}>
            <span className="trace-node-mark" aria-hidden="true" data-status={status} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ArchitectureExplorer({ title, views }: { title: string; views: DiagramView[] }) {
  const uid = useId()
  const [viewId, setViewId] = useState(views[0].id)
  const [step, setStep] = useState<number | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [reduced, setReduced] = useState(false)
  const { ref, active } = useSceneActivity<HTMLDivElement>()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const view = views.find((candidate) => candidate.id === viewId)!
  const steps = view.steps ?? []
  const currentStep = step === null ? undefined : steps[step]
  const currentNode = view.nodes.find((node) => node.id === selected)
  const byId = new Map(view.nodes.map((node) => [node.id, node]))
  const getHops = ({ edges }: Step): Hop[] =>
    edges.flatMap(([from, to]) => {
      const a = byId.get(from)
      const b = byId.get(to)
      return a && b ? [{ from: a, to: b }] : []
    })
  const hops = currentStep ? getHops(currentStep) : []

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReduced(preference.matches)
      if (preference.matches) setPlaying(false)
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!active || !playing || step === null || reduced) return
    const timer = setTimeout(() => {
      if (step + 1 < steps.length) setStep(step + 1)
      else setPlaying(false)
    }, HOP_MS)
    return () => clearTimeout(timer)
  }, [active, playing, reduced, step, steps.length])

  const jump = (index: number | null) => {
    setPlaying(false)
    setStep(index)
    setSelected(null)
  }

  function play() {
    if (playing) {
      setPlaying(false)
      return
    }
    setSelected(null)
    if (step === null || step === steps.length - 1) setStep(0)
    setPlaying(true)
  }

  const open = (id: string) => {
    setViewId(id)
    jump(null)
  }

  const onTabKey = (event: KeyboardEvent, index: number) => {
    const last = views.length - 1
    const target =
      event.key === 'ArrowRight'
        ? (index + 1) % views.length
        : event.key === 'ArrowLeft'
          ? (index + last) % views.length
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

  return (
    <div className="architecture-trace" ref={ref}>
      <div role="tablist" aria-label={`${title} diagram views`} className="trace-tabs">
        {views.map((candidate, index) => (
          <button
            key={candidate.id}
            ref={(element) => {
              tabs.current[index] = element
            }}
            id={`${uid}-tab-${candidate.id}`}
            role="tab"
            type="button"
            aria-selected={candidate.id === viewId}
            aria-controls={`${uid}-panel`}
            tabIndex={candidate.id === viewId ? 0 : -1}
            onClick={() => open(candidate.id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {candidate.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${viewId}`}>
        <p className="trace-caption">{view.caption}</p>
        <div className="trace-layout">
          <ArchitectureMap
            key={viewId}
            view={view}
            step={step}
            hops={hops}
            selected={currentNode}
            motion={active && !reduced}
            onSelect={(id) => {
              setSelected((current) => (current === id ? null : id))
              setPlaying(false)
            }}
          />
          <aside className="trace-inspector" aria-label="Architecture inspector">
            {steps.length > 0 && (
              <>
                <div className="trace-inspector-heading">
                  <h3 className="display">Follow the route</h3>
                  <button
                    type="button"
                    className="trace-reset"
                    aria-disabled={step === null}
                    onClick={() => {
                      if (step !== null) jump(null)
                    }}
                  >
                    Reset
                  </button>
                </div>
                <ol className="trace-hops" aria-label="Route hops">
                  {steps.map((routeStep, index) => {
                    const routeHops = getHops(routeStep)
                    const destination = routeHops[routeHops.length - 1]?.to.label
                    return (
                      <li key={routeStep.text}>
                        <button
                          type="button"
                          aria-pressed={step === index}
                          aria-label={`Hop ${index + 1}. ${routeStep.text}`}
                          onClick={() => jump(index)}
                        >
                          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                          <span>{destination}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
                <div className="trace-playback">
                  <button
                    type="button"
                    className="btn-quiet"
                    aria-disabled={step === null || step === 0}
                    onClick={() => {
                      if (step !== null && step > 0) jump(step - 1)
                    }}
                  >
                    Previous hop
                  </button>
                  <button
                    type="button"
                    className="btn-quiet trace-play"
                    hidden={reduced}
                    onClick={play}
                  >
                    {playing ? 'Pause route' : 'Play route'}
                  </button>
                  <button
                    type="button"
                    className="btn-quiet"
                    aria-disabled={step === steps.length - 1}
                    onClick={() => {
                      if (step !== steps.length - 1) jump((step ?? -1) + 1)
                    }}
                  >
                    Next hop
                  </button>
                </div>
                <div className="trace-readout" role="status" aria-atomic="true">
                  {currentStep && step !== null ? (
                    <>
                      <p className="sr-only">
                        Route step {step + 1} of {steps.length}.
                      </p>
                      <ul className="trace-directions" aria-label="Connections in this hop">
                        {hops.map(({ from, to }) => (
                          <li key={`${from.id}-${to.id}`}>
                            {from.label} <span aria-hidden="true">→</span>
                            <span className="sr-only"> to </span> {to.label}
                          </li>
                        ))}
                      </ul>
                      <p>{currentStep.text}</p>
                    </>
                  ) : (
                    <p className="trace-instruction">
                      Choose a hop to see how the systems connect.
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="trace-component" aria-live="polite" aria-atomic="true">
              <p className="trace-component-label">Component detail</p>
              {currentNode ? (
                <>
                  <h3 className="display">{currentNode.label}</h3>
                  <p className="trace-component-status">
                    <span
                      aria-hidden="true"
                      className="trace-node-mark"
                      data-status={currentNode.status}
                    />
                    {statusLabels[currentNode.status]}
                    {currentNode.sub && ` · ${currentNode.sub}`}
                  </p>
                  <p>{currentNode.detail}</p>
                </>
              ) : (
                <p className="trace-instruction">
                  Select a component in the diagram to inspect it.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
