import type { DiagramView } from '@/content/projects/types'

export function ArchitecturePreview({
  view,
  tone = 'lilac',
}: {
  view: DiagramView
  tone?: 'lilac' | 'mint'
}) {
  const width = 620
  const height = 235
  const x = (value: number) => 35 + value * 5.5
  const y = (value: number) => 20 + value * 1.95
  const positions = new Map(view.nodes.map((node) => [node.id, { x: x(node.x), y: y(node.y) }]))

  return (
    <div className="architecture-preview" data-tone={tone} aria-hidden="true">
      <span className="preview-label">{view.label}</span>
      <svg viewBox={`0 0 ${width} ${height}`} fill="none">
        <path className="preview-frame" d="M20 34V18h16m548 0h16v16m0 167v16h-16m-548 0H20v-16" />
        {view.edges.map((edge) => {
          const from = positions.get(edge.from)!
          const to = positions.get(edge.to)!

          return (
            <path
              key={`${edge.from}-${edge.to}`}
              className="preview-edge"
              d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
            />
          )
        })}
        {view.nodes.map((node) => (
          <g
            key={node.id}
            className="preview-node"
            data-status={node.status}
            transform={`translate(${x(node.x)} ${y(node.y)})`}
          >
            <rect x="-11" y="-11" width="22" height="22" rx="2" />
            <path d="m-5 0 5-5 5 5-5 5Z" />
            <text y="27" textAnchor="middle">
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
