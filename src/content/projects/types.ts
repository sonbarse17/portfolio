import type { ProvenanceKind } from '@/components/provenance'
import type { Region } from '@/components/schematic'

/**
 * implemented  built in this project
 * dependency   the application, an actor or an external service the design relies on
 * followup     reviewed or planned, and not described as completed
 */
export type NodeStatus = 'implemented' | 'dependency' | 'followup'

export type DiagramNode = {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  status: NodeStatus
  detail: string
}
export type DiagramEdge = { from: string; to: string; label?: string }
export type Step = { text: string; edges: [string, string][] }

export type DiagramView = {
  id: string
  label: string
  caption: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  regions?: Region[]
  steps?: Step[]
  height?: string
}

export type Comparison = { rows: { aspect: string; before: string; after: string }[] }
export type TimelineItem = {
  text: string
  env?: ('Dev' | 'UAT' | 'Production')[]
  /** done = completed. reviewed = looked at, with the remaining work still to do. */
  status: 'done' | 'reviewed'
}

export const SECTION_ORDER = [
  ['intro', 'Introduction'],
  ['problem', 'Problem'],
  ['context', 'Technical context'],
  ['contribution', 'My contribution'],
  ['architecture', 'Architecture'],
  ['stack', 'Technology stack'],
  ['implementation', 'Implementation'],
  ['challenges', 'Engineering challenges'],
  ['security', 'Security and reliability'],
  ['outcome', 'Outcome'],
  ['lessons', 'Lessons learned'],
] as const
export type SectionId = (typeof SECTION_ORDER)[number][0]

export type Section = {
  id: SectionId
  provenance: ProvenanceKind
  body?: string
  points?: string[]
  details?: { title: string; body: string; provenance: ProvenanceKind }[]
  comparison?: Comparison
  timeline?: TimelineItem[]
}

export type Project = {
  slug: string
  title: string
  summary: string
  classification: 'professional' | 'personal'
  category: string
  context: string
  /** Environment or region chips shown in the header. */
  labels: string[]
  /** Three or four facts that explain the project in ten seconds. */
  glance: { label: string; value: string }[]
  stackGroups: { group: string; items: string[] }[]
  views?: DiagramView[]
  sections: Section[]
  /** Overview projects publish only what is verified and carry no diagram. */
  tier: 'case' | 'overview'
  lab?: string
}

export const node = (
  id: string,
  label: string,
  x: number,
  y: number,
  status: NodeStatus,
  detail: string,
  sub?: string
): DiagramNode => ({ id, label, sub, x, y, status, detail })

export const edge = (from: string, to: string, label?: string): DiagramEdge => ({
  from,
  to,
  label,
})
