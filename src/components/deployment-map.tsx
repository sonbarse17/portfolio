'use client'

import { useId, useState } from 'react'
import Link from 'next/link'

const stages = [
  {
    label: 'Build',
    caption: 'Build an artifact',
    description: 'Test the change, scan dependencies, and publish a versioned image.',
    position: 'translate(150 251)',
    trace: 'M36 334 84 307 84 288 150 251 150 219',
    icon: 'm-15-11-13 11 13 11m30-22 13 11-13 11m-10-27-10 32',
  },
  {
    label: 'Deploy',
    caption: 'Roll out the change',
    description: 'Provision the environment, roll out the image, and verify readiness.',
    position: 'translate(322 153)',
    trace: 'M150 219v32l79-46h29l64-37v-48',
    icon: 'm0-24 26 14v24L0 28l-26-14v-24L0-24Zm-26 14L0 5l26-15M0 5v23M-13-17l26 14',
  },
  {
    label: 'Operate',
    caption: 'Watch the rollout',
    description: 'Use health checks and telemetry to decide whether to continue or roll back.',
    position: 'translate(495 246)',
    trace: 'M322 120v48l73 42h39l61 36v-33m0 33 65 37v25l48 27',
    icon: 'M-26 1h13l8-15L6 14 14 1h12',
  },
] as const

const board = 'M21 280 320 108 619 280 320 452Z'

export function DeploymentMap() {
  const [active, setActive] = useState(1)
  const id = useId()
  const stage = stages[active]

  return (
    <figure className="deployment-map" aria-labelledby={`${id}-title`}>
      <div className="map-topline">
        <span id={`${id}-title`}>Deployment path</span>
        <span>Interactive model</span>
      </div>
      <div className="map-art">
        <svg aria-hidden="true" viewBox="0 0 640 440" fill="none">
          <defs>
            <clipPath id={`${id}-board`}>
              <path d={board} />
            </clipPath>
          </defs>
          <path
            className="map-guide"
            d="M0 111h640M0 217h640M0 323h640M107 0v440M213 0v440M320 0v440M427 0v440M533 0v440"
          />
          <g className="map-crosses">
            <path d="M95 68h18m-9-9v18m416-16h18m-9-9v18m-473 117h14m-7-7v14m501 6h14m-7-7v14m-476 158h18m-9-9v18m420-8h18m-9-9v18" />
            <circle cx="320" cy="64" r="5" />
            <circle cx="588" cy="111" r="3" />
            <circle cx="54" cy="110" r="3" />
          </g>
          <g transform="translate(0 -38)">
            <path className="map-board-depth" d="M21 280v13l299 172 299-172v-13L320 452Z" />
            <path className="map-board" d={board} />
            <g clipPath={`url(#${id}-board)`} className="map-grid">
              {Array.from({ length: 20 }, (_, i) => (
                <path key={i} d={`M${-308 + i * 64} 108l600 346 M${-308 + i * 64} 454l600-346`} />
              ))}
            </g>
            <path className="map-board-inset" d="m47 280 273-157 273 157-273 157Z" />
            <path
              className="map-aux"
              d="M101 325l76 44h47l54 31h74l82-47m-253-7 40-23h43l56-32h42l83-48m-182-9-40 23v24l-57 33m283-41v21l53 31m-184-54 49 28v27l-47 27"
            />
            <g className="map-ports">
              <path d="m92 324 9-5 9 5-9 5Zm177 78 9-5 9 5-9 5Zm153-50 9-5 9 5-9 5Zm70-28 9-5 9 5-9 5Zm-181-91 9-5 9 5-9 5Z" />
            </g>
            {stages.map((item, i) => (
              <path
                key={item.label}
                className="map-trace"
                data-active={i === active}
                d={item.trace}
              />
            ))}
            <path key={stage.label} className="map-pulse" d={stage.trace} />
            {stages.map((item, i) => (
              <g
                key={item.label}
                transform={item.position}
                className="map-tile"
                data-active={i === active}
              >
                <path className="tile-base" d="m-81 0 81-47 81 47L0 47Z" />
                <path className="tile-support" d="M-60-2v-30m120 30v-30M0 34V6m0-71v-29" />
                <g className="tile-chip">
                  <path className="tile-front" d="m-61-31 61 35 61-35v15L0 19l-61-35Z" />
                  <path className="tile-face" d="m-61-31 61-35 61 35L0 4Z" />
                  <path
                    className="tile-detail"
                    d="m-47-16 21 12m-8 1 7 4M41-12l8-5M32-7l3-2m-34 17v6"
                  />
                  <path
                    className="tile-symbol"
                    d={item.icon}
                    transform="translate(0 -31) matrix(.87 .5 -.75 .43 0 0)"
                  />
                </g>
              </g>
            ))}
            <path
              className="map-index"
              d="M30 280l18-10m254 171 18 11 18-11m254-171 18 10M320 108l20 12"
            />
          </g>
        </svg>
      </div>
      <div className="map-controls" role="group" aria-label="Deployment stages">
        {stages.map((item, i) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span className="map-control-mark" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
      <figcaption className="map-caption" aria-live="polite">
        <strong>{stage.caption}</strong>
        <span>{stage.description}</span>
      </figcaption>
      <Link href="/lab/release-path" prefetch={false} className="map-lab-link">
        Fail a stage yourself
      </Link>
    </figure>
  )
}
