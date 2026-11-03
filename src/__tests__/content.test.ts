import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { capabilities } from '@/content/capabilities'
import { domains } from '@/content/atlas'
import { labs } from '@/content/labs'
import { projects, retiredRoutes, SECTION_ORDER, type Project } from '@/content/projects'
import { services } from '@/content/services'
import { site } from '@/content/site'

const labSlugs = new Set(labs.map((l) => l.slug))
const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!

/** Every string a visitor can read on a project page. */
const text = (p: Project) =>
  JSON.stringify([
    p.title,
    p.summary,
    p.glance,
    p.stackGroups,
    p.sections,
    p.views?.flatMap((v) => [v.caption, v.nodes, v.steps]),
  ])

describe('content integrity', () => {
  it('uses the real domain', () => {
    expect(site.url).toBe('https://sushantsonbarse.in')
  })

  it('project slugs are unique, and cross-links resolve', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
    projects.forEach((p) => p.lab && expect(labSlugs.has(p.lab)).toBe(true))
    services.forEach((s) => expect(labSlugs.has(s.lab)).toBe(true))
    domains.forEach((d) => expect(labSlugs.has(d.lab!)).toBe(true))
    capabilities.forEach((c) =>
      c.applied.forEach((a) => expect(projects.some((p) => p.slug === a.project)).toBe(true))
    )
  })

  it('full case studies cover every section a visitor expects', () => {
    const required = SECTION_ORDER.map(([id]) => id)
    projects
      .filter((p) => p.tier === 'case')
      .forEach((p) => {
        const have = new Set(p.sections.map((s) => s.id))
        const missing = required.filter((id) => id !== 'stack' && !have.has(id))
        // Personal projects only publish what exists. They may omit security, which they do not have.
        const optional =
          p.classification === 'personal' ? ['context', 'security', 'challenges'] : []
        expect(
          missing.filter((id) => !optional.includes(id)),
          p.slug
        ).toEqual([])
        expect(p.stackGroups.length, p.slug).toBeGreaterThan(0)
      })
  })

  it('every diagram is internally consistent', () => {
    projects.forEach((p) =>
      p.views?.forEach((v) => {
        const ids = v.nodes.map((n) => n.id)
        expect(new Set(ids).size, `${p.slug}/${v.id} duplicate node ids`).toBe(ids.length)
        const known = new Set(ids)
        v.edges.forEach((e) => {
          expect(known.has(e.from), `${p.slug}/${v.id}: ${e.from}`).toBe(true)
          expect(known.has(e.to), `${p.slug}/${v.id}: ${e.to}`).toBe(true)
        })
        v.steps?.forEach((s) =>
          s.edges.forEach(([a, b]) => {
            const exists = v.edges.some(
              (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)
            )
            expect(exists, `${p.slug}/${v.id}: step edge ${a}-${b}`).toBe(true)
          })
        )
        v.nodes.forEach((n) => {
          expect(n.x).toBeGreaterThanOrEqual(0)
          expect(n.x).toBeLessThanOrEqual(100)
          expect(n.y).toBeGreaterThanOrEqual(0)
          expect(n.y).toBeLessThanOrEqual(100)
        })
      })
    )
  })

  it('retired URLs all point somewhere that exists', () => {
    Object.values(retiredRoutes).forEach((to) => {
      expect(to === '/work' || projects.some((p) => `/work/${p.slug}` === to)).toBe(true)
    })
    const config = JSON.parse(readFileSync('firebase.json', 'utf8')).hosting.redirects
    expect(config.map((r: { source: string }) => r.source).sort()).toEqual(
      Object.keys(retiredRoutes).sort()
    )
  })
})

describe('content rules', () => {
  it('professional and personal work are never mixed up', () => {
    projects
      .filter((p) => p.classification === 'personal')
      .forEach((p) => {
        expect(
          p.sections.some((s) => s.provenance === 'record'),
          p.slug
        ).toBe(false)
      })
  })

  it('no reference or personal text states an outcome percentage', () => {
    projects.forEach((p) =>
      p.sections
        .filter((s) => s.provenance !== 'record')
        .forEach((s) =>
          expect([s.body, ...(s.points ?? [])].join(' '), `${p.slug}/${s.id}`).not.toMatch(
            /\d+(\.\d+)?\s*%/
          )
        )
    )
  })

  it('invents no uptime, latency or traffic claims anywhere', () => {
    // Numeric claims only: a disclaimer such as "no uptime figures are published" is not a claim.
    const claim = /99\.\d+|\d+\s*(req\/s|requests per|ms\b)|saved \$|\d+x faster/i
    projects.forEach((p) => expect(text(p), p.slug).not.toMatch(claim))
  })

  it('the only published outcome percentages are the HisanLabs ones', () => {
    projects
      .filter((p) => p.slug !== 'crm-on-eks')
      .forEach((p) => expect(text(p), p.slug).not.toMatch(/\b\d+(\.\d+)?\s*%/))
  })

  it('professional case studies state ownership plainly and never undersell it', () => {
    projects
      .filter((p) => p.classification === 'professional' && p.tier === 'case')
      .forEach((p) => {
        const contribution = p.sections.find((s) => s.id === 'contribution')!.body!
        expect(contribution, p.slug).toMatch(/I designed and (implemented|deployed)/)
        expect(text(p), p.slug).not.toMatch(
          /contributed to|helped (with|build)|assisted|part of a team/i
        )
      })
  })

  it('never frames professional work as modifying, migrating or redesigning something that existed', () => {
    // The architectures were designed and deployed from scratch. "Before" diagrams describe how an
    // application was reached, and are not described as the author's prior work.
    projects
      .filter((p) => p.classification === 'professional')
      .forEach((p) => {
        expect(text(p), p.slug).not.toMatch(
          /\bexisting\b|already existed|redesign|retained|unchanged|kept as it was|moved (it |to )|migrated from|from scratch|end[- ]to[- ]end|professional implementation|access architecture myself/i
        )
      })
  })
})

describe('architecture boundaries', () => {
  const azureOnly = /Application Gateway|Front Door|App Service/i
  const awsOnly = /Cognito|CloudFront|Elastic Beanstalk|Origin Access|Amplify|Route 53|\bS3\b/i

  it('the Azure project never borrows the AWS project components', () => {
    expect(text(bySlug('azure-internal-access'))).not.toMatch(awsOnly)
  })

  it('the AWS project never borrows the Azure project components', () => {
    expect(text(bySlug('aws-hosting-and-sso'))).not.toMatch(azureOnly)
  })

  it('the overview-only project publishes no diagram and no components from other projects', () => {
    const overview = bySlug('cloud-architecture-project')
    expect(overview.tier).toBe('overview')
    expect(overview.views).toBeUndefined()
    expect(overview.stackGroups).toEqual([])
    expect(text(overview)).not.toMatch(azureOnly)
    expect(text(overview)).not.toMatch(awsOnly)
    expect(text(overview)).not.toMatch(/PostgreSQL|Redis|Container Apps|Key Vault|GitLab/i)
  })

  it('Azure keeps Application Gateway as the chosen solution, with Private Endpoint only evaluated', () => {
    const azure = bySlug('azure-internal-access')
    expect(azure.glance.map((g) => g.value).join(' ')).toMatch(
      /Application Gateway, not Private Endpoint/
    )
    expect(JSON.stringify(azure.stackGroups)).not.toMatch(/Private Endpoint/i)
    expect(JSON.stringify(azure.views)).not.toMatch(/Private Endpoint/i)
  })

  it('Azure scopes the authentication exclusion to the one endpoint', () => {
    const all = text(bySlug('azure-internal-access'))
    expect(all).toMatch(/workflow endpoint/)
    expect(all).toMatch(/limited to (that|this) endpoint/i)
    expect(all).not.toMatch(/unauthenticated application|no authentication/i)
  })

  it('Azure marks Front Door cleanup as follow-up, not done', () => {
    const azure = bySlug('azure-internal-access')
    const after = azure.views!.find((v) => v.id === 'after')!
    expect(after.nodes.find((n) => n.id === 'afd')!.status).toBe('followup')
    const timeline = azure.sections.find((s) => s.id === 'implementation')!.timeline!
    expect(timeline.at(-1)!.status).toBe('reviewed')
  })

  it('the AWS project keeps static hosting, application hosting and authentication apart', () => {
    const views = bySlug('aws-hosting-and-sso').views!
    expect(views.map((v) => v.id)).toEqual(expect.arrayContaining(['static', 'auth', 'app']))
    expect(views.find((v) => v.id === 'app')!.nodes.map((n) => n.id)).not.toContain('s3')
  })
})
