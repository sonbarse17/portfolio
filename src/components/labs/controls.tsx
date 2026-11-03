import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Segmented<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="label mb-1.5 text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className="btn-quiet"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function Check({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'flex min-h-8 cursor-pointer items-start gap-2.5 py-1 text-base leading-snug',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--signal))]"
      />
      <span>{label}</span>
    </label>
  )
}

export function Slider({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}) {
  const id = useId()
  return (
    <div>
      <div className="label flex justify-between gap-4 text-muted">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="text-ink">
          {display}
        </output>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-valuetext={display}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-8 w-full cursor-pointer accent-[rgb(var(--signal))]"
      />
    </div>
  )
}

export const healthWord = { ok: 'Healthy', degraded: 'Degraded', down: 'Down' } as const
export const healthMark = { ok: '●', degraded: '◐', down: '✕' } as const
export const healthClass = { ok: 'text-ok', degraded: 'text-warn', down: 'text-signal' } as const
