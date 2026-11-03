'use client'

import { useMemo, useRef, useState } from 'react'
import {
  alertPolicies,
  budgetMinutes,
  budgetUsed,
  burnRate,
  burnSeries,
  formatMinutes,
  timeToDetect,
} from '@/lib/lab/slo'
import { Segmented, Slider } from './controls'

const SLOS = ['0.99', '0.995', '0.999', '0.9995', '0.9999']
const ERROR_RATES = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1]
const DURATIONS = [5, 15, 30, 60, 120, 240, 480, 720, 1440, 2880, 4320]

const percent = (n: number) => `${Math.round(n * 1000) / 10}%`

const W = 640
const H = 260
const PAD = { left: 44, right: 14, top: 14, bottom: 26 }

function BurnChart({
  series,
  incident,
  marks,
}: {
  series: { minute: number; remaining: number }[]
  incident: number
  marks: { label: string; minute: number }[]
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  const floor = Math.min(0, series[series.length - 1].remaining)
  const x = (minute: number) => PAD.left + (minute / incident) * (W - PAD.left - PAD.right)
  const y = (value: number) => PAD.top + ((1 - value) / (1 - floor)) * (H - PAD.top - PAD.bottom)

  const line = series.map((p) => `${x(p.minute)},${y(p.remaining)}`).join(' ')
  const ticks = floor < 0 ? [1, 0, floor] : [1, 0.5, 0]
  const point = hover === null ? null : series[hover]

  const onMove = (e: React.PointerEvent) => {
    const box = ref.current!.getBoundingClientRect()
    const fraction = ((e.clientX - box.left) / box.width) * W
    const ratio = (fraction - PAD.left) / (W - PAD.left - PAD.right)
    setHover(Math.max(0, Math.min(series.length - 1, Math.round(ratio * (series.length - 1)))))
  }

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Error budget remaining falls from 100% to ${percent(
          series[series.length - 1].remaining
        )} over ${formatMinutes(incident)}`}
        className="h-auto w-full touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              className={tick === 0 ? 'stroke-signal' : 'stroke-ink/15'}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y(tick) + 4}
              textAnchor="end"
              className="fill-muted font-mono text-[11px]"
            >
              {Math.round(tick * 100)}%
            </text>
          </g>
        ))}
        <text
          x={W - PAD.right}
          y={y(0) - 5}
          textAnchor="end"
          className="fill-signal font-mono text-[11px]"
        >
          Budget exhausted
        </text>
        <text x={PAD.left} y={H - 6} className="fill-muted font-mono text-[11px]">
          Incident start
        </text>
        <text
          x={W - PAD.right}
          y={H - 6}
          textAnchor="end"
          className="fill-muted font-mono text-[11px]"
        >
          {formatMinutes(incident)}
        </text>

        {marks.map((mark, i) => (
          <g key={mark.label}>
            <line
              x1={x(mark.minute)}
              x2={x(mark.minute)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-ink"
              strokeDasharray="2 3"
              strokeWidth={1}
            />
            <text
              x={Math.min(x(mark.minute) + 4, W - 110)}
              y={H - PAD.bottom - 6 - i * 14}
              className="fill-ink font-mono text-[11px]"
            >
              {mark.label}
            </text>
          </g>
        ))}

        <polyline
          points={line}
          fill="none"
          strokeWidth={2}
          strokeLinejoin="round"
          className="stroke-ink"
        />

        {point && (
          <g>
            <line
              x1={x(point.minute)}
              x2={x(point.minute)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              className="stroke-ink/40"
              strokeWidth={1}
            />
            <circle
              cx={x(point.minute)}
              cy={y(point.remaining)}
              r={4}
              strokeWidth={2}
              className="fill-ink stroke-paper"
            />
          </g>
        )}
      </svg>
      {point && (
        <div
          className="label pointer-events-none absolute top-1 border border-ink bg-paper px-2 py-1 normal-case tracking-normal"
          style={
            point.minute / incident > 0.6
              ? { right: `${(1 - x(point.minute) / W) * 100 + 1}%` }
              : { left: `${(x(point.minute) / W) * 100 + 1}%` }
          }
        >
          {formatMinutes(point.minute)}: {percent(point.remaining)} left
        </div>
      )}
    </div>
  )
}

export function ErrorBudgetLab() {
  const [sloKey, setSloKey] = useState('0.999')
  const [rateIndex, setRateIndex] = useState(5)
  const [durationIndex, setDurationIndex] = useState(3)

  const slo = Number(sloKey)
  const errorRate = ERROR_RATES[rateIndex]
  const incident = DURATIONS[durationIndex]

  const result = useMemo(() => {
    const alerts = alertPolicies.map((policy) => ({
      policy,
      firesAt: timeToDetect(policy, errorRate, incident, slo),
    }))
    return {
      budget: budgetMinutes(slo),
      burn: burnRate(errorRate, slo),
      used: budgetUsed(errorRate, incident, slo),
      series: burnSeries(errorRate, incident, slo),
      alerts,
      marks: alerts
        .filter((a) => a.firesAt !== null)
        .map((a) => ({ label: `${a.policy.severity} ${a.policy.burn}x`, minute: a.firesAt! })),
    }
  }, [slo, errorRate, incident])

  const verdict = result.alerts.some((a) => a.policy.severity === 'Page' && a.firesAt !== null)
    ? 'Wake someone up.'
    : result.alerts.some((a) => a.firesAt !== null)
      ? 'File a ticket. Nobody needs to wake up.'
      : 'No alert. The budget exists to absorb this.'

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-4">
        <Segmented
          legend="30-day SLO"
          value={sloKey}
          onChange={setSloKey}
          options={SLOS.map((s) => ({
            value: s,
            label: `${Number(s) * 100}%`.replace(/(\.\d{2})\d+/, '$1'),
          }))}
        />
        <Slider
          label="Error rate during incident"
          value={rateIndex}
          display={percent(errorRate)}
          min={0}
          max={ERROR_RATES.length - 1}
          onChange={setRateIndex}
        />
        <Slider
          label="Incident duration"
          value={durationIndex}
          display={formatMinutes(incident)}
          min={0}
          max={DURATIONS.length - 1}
          onChange={setDurationIndex}
        />
        <dl className="hairline grid grid-cols-2 gap-4 border-y py-4">
          <div>
            <dt className="label text-muted">Monthly budget</dt>
            <dd className="display text-4xl">{formatMinutes(result.budget)}</dd>
          </div>
          <div>
            <dt className="label text-muted">Burn rate</dt>
            <dd className="display text-4xl">{Math.round(result.burn * 10) / 10}x</dd>
          </div>
          <div className="col-span-2">
            <dt className="label text-muted">Budget used by this incident</dt>
            <dd className="display text-6xl">{percent(result.used)}</dd>
          </div>
        </dl>
      </div>

      <div className="min-w-0 lg:col-span-8">
        <p className="display text-4xl sm:text-5xl" role="status" aria-live="polite">
          {verdict}
        </p>
        <h3 className="label mt-5 text-muted">Error budget remaining</h3>
        <div className="mt-2">
          <BurnChart series={result.series} incident={incident} marks={result.marks} />
        </div>

        <div
          className="mt-6 overflow-x-auto"
          role="region"
          aria-label="Alert policies table, scrollable"
          tabIndex={0}
        >
          <table className="w-full min-w-[26rem] border-collapse text-left text-base">
            <caption className="label pb-2 text-left text-muted">
              Multi-window alert policies
            </caption>
            <thead>
              <tr className="hairline border-b">
                {['Severity', 'Burn rate', 'Windows', 'Fires after'].map((heading) => (
                  <th key={heading} scope="col" className="label py-2 pr-4 font-medium text-muted">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.alerts.map(({ policy, firesAt }) => (
                <tr key={policy.id} className="hairline border-b">
                  <td className="py-2 pr-4">{policy.severity}</td>
                  <td className="py-2 pr-4 font-mono text-sm">{policy.burn}x</td>
                  <td className="py-2 pr-4 font-mono text-sm">
                    {formatMinutes(policy.longMin)} and {formatMinutes(policy.shortMin)}
                  </td>
                  <td className="py-2 pr-4 font-mono text-sm">
                    {firesAt === null ? 'Does not fire' : formatMinutes(firesAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
