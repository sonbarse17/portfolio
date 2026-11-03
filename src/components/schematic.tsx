import { cn } from '@/lib/utils'

export type SchematicTone = 'idle' | 'ok' | 'warn' | 'fault'

export type SchematicNode = {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  tone?: SchematicTone
  /** Spoken state, so tone is never carried by colour alone. */
  status?: string
}

export type SchematicEdge = [string, string] | { from: string; to: string; label?: string }
export type Region = { label: string; x: number; y: number; w: number; h: number }

/** Direction-independent key, so a step can highlight an edge whichever way it is stored. */
export const edgeKey = (a: string, b: string) => [a, b].sort().join('~')

type Props = {
  title: string
  nodes: SchematicNode[]
  edges: SchematicEdge[]
  /** Full-height vertical columns, used by the failure lab for availability zones. */
  bands?: { label: string; x: number }[]
  /** Labelled boxes in percent coordinates, used to show trust or network boundaries. */
  regions?: Region[]
  height?: string
  /** Hide each node's second line on narrow screens, where long names cannot fit. */
  hideSubOnMobile?: boolean
  /** Dim everything outside this set and emphasise these edges. */
  highlight?: { nodes: ReadonlySet<string>; edges: ReadonlySet<string> }
  /** Numbered markers drawn at the midpoint of an edge. */
  badges?: { edge: string; label: string; active?: boolean }[]
  /** Animate dashes along healthy edges. Off for static architecture. */
  animate?: boolean
  selected?: string | null
  onSelect?: (id: string) => void
  /** 'toggle' reports aria-pressed from tone (failure lab); 'select' marks the current node. */
  selectMode?: 'toggle' | 'select'
}

const toneClass: Record<SchematicTone, string> = {
  idle: 'border-ink/50 bg-paper',
  ok: 'border-ink border-2 bg-paper',
  warn: 'border-warn border-dashed bg-paper text-ink',
  fault: 'border-signal bg-signal text-paper',
}

/**
 * Nodes are positioned in percentages over a stretched SVG, so the diagram reflows to any width and
 * labels stay real, focusable, readable HTML.
 */
export function Schematic({
  title,
  nodes,
  edges,
  bands = [],
  regions = [],
  height = 'h-[26rem]',
  hideSubOnMobile,
  highlight,
  badges = [],
  animate = true,
  selected,
  onSelect,
  selectMode = 'toggle',
}: Props) {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const drawn = edges
    .map((e) => (Array.isArray(e) ? { from: e[0], to: e[1], label: undefined } : e))
    .filter((e) => byId.has(e.from) && byId.has(e.to))
  const dimmed = (id: string) => highlight && !highlight.nodes.has(id)

  return (
    <div role="group" aria-label={title} className={cn('relative w-full select-none', height)}>
      {bands.map((band) => (
        <div
          key={band.label}
          aria-hidden="true"
          className="hairline absolute inset-y-0 w-[28%] -translate-x-1/2 border-x bg-panel/40"
          style={{ left: `${band.x}%` }}
        >
          <span className="label absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.625rem] text-muted">
            {band.label}
          </span>
        </div>
      ))}

      {regions.map((r) => (
        <div
          key={r.label}
          aria-hidden="true"
          className="absolute border border-dashed border-ink/30 bg-panel/30"
          style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
        >
          <span className="label absolute left-1.5 top-1 text-[0.625rem] text-muted">
            {r.label}
          </span>
        </div>
      ))}

      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {drawn.map((e) => {
          const from = byId.get(e.from)!
          const to = byId.get(e.to)!
          const dead = from.tone === 'fault' || to.tone === 'fault'
          const on = highlight?.edges.has(edgeKey(e.from, e.to))
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              vectorEffect="non-scaling-stroke"
              strokeWidth={on ? 2.5 : dead ? 1 : 1.5}
              className={cn(
                on
                  ? 'flow stroke-signal'
                  : dead
                    ? 'stroke-signal/40'
                    : highlight
                      ? 'stroke-ink/20'
                      : animate
                        ? 'flow stroke-ink/70'
                        : 'stroke-ink/60'
              )}
            />
          )
        })}
      </svg>

      {drawn.map(
        (e) =>
          e.label && (
            <span
              key={`l-${e.from}-${e.to}`}
              aria-hidden="true"
              className="label pointer-events-none absolute hidden -translate-x-1/2 -translate-y-[140%] bg-paper px-1 text-[0.625rem] normal-case tracking-normal text-muted sm:block"
              style={{
                left: `${(byId.get(e.from)!.x + byId.get(e.to)!.x) / 2}%`,
                top: `${(byId.get(e.from)!.y + byId.get(e.to)!.y) / 2}%`,
              }}
            >
              {e.label}
            </span>
          )
      )}

      {badges.map((b) => {
        const [a, c] = b.edge.split('~')
        const from = byId.get(a)
        const to = byId.get(c)
        if (!from || !to) return null
        return (
          <span
            key={b.edge}
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute flex h-5 min-w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center border px-1 font-mono text-[0.625rem] font-medium leading-none',
              b.active ? 'border-signal bg-signal text-paper' : 'border-ink bg-paper text-ink'
            )}
            style={{ left: `${(from.x + to.x) / 2}%`, top: `${(from.y + to.y) / 2 + 3}%` }}
          >
            {b.label}
          </span>
        )
      })}

      {nodes.map((node) => {
        const tone = node.tone ?? 'idle'
        const content = (
          <>
            <span className="block break-words font-mono text-[0.625rem] font-medium leading-tight sm:text-xs">
              {tone === 'fault' && <span aria-hidden="true">✕ </span>}
              <span className={cn(tone === 'fault' && 'line-through')}>{node.label}</span>
            </span>
            {node.sub && (
              <span
                className={cn(
                  'mt-0.5 block break-words font-mono text-[0.625rem] leading-tight',
                  tone === 'fault' ? 'text-paper' : 'text-muted',
                  hideSubOnMobile && 'hidden sm:block'
                )}
              >
                {node.sub}
              </span>
            )}
          </>
        )
        const style = { left: `${node.x}%`, top: `${node.y}%` }
        const base = cn(
          'absolute w-[20%] min-w-[4rem] max-w-[11rem] -translate-x-1/2 -translate-y-1/2 border px-0.5 py-1.5 text-center transition-[colors,opacity] sm:px-1.5',
          dimmed(node.id) && 'opacity-55'
        )

        return onSelect ? (
          <button
            key={node.id}
            type="button"
            style={style}
            onClick={() => onSelect(node.id)}
            aria-label={`${node.label}${node.sub ? `, ${node.sub}` : ''}${node.status ? `: ${node.status}` : ''}`}
            aria-pressed={selectMode === 'toggle' ? tone === 'fault' : undefined}
            aria-current={selectMode === 'select' && selected === node.id ? 'true' : undefined}
            className={cn(
              base,
              toneClass[tone],
              'min-h-11 hover:border-signal',
              selected === node.id && 'outline outline-2 outline-offset-2 outline-ink'
            )}
          >
            {content}
          </button>
        ) : (
          <div key={node.id} style={style} className={cn(base, toneClass[tone])}>
            {content}
          </div>
        )
      })}
    </div>
  )
}
