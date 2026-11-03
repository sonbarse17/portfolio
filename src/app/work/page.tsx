import type { Metadata } from 'next'
import { ProvenanceTag } from '@/components/provenance'
import { ProjectRow } from '@/components/project-parts'
import { personal, professional } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Professional case studies in Azure internal access and AWS hosting with SSO, plus personal projects in Kubernetes, Docker, monitoring and CI/CD.',
}

export default function WorkPage() {
  return (
    <main className="wrap pt-10">
      <h1 className="h-page">Work</h1>
      <p className="lede mt-6 max-w-3xl">
        Professional work and personal projects are kept apart, and every page says which it is.
        Where a detail is not verified, it is left out.
      </p>

      <section aria-labelledby="professional" className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="professional" className="h-section">
            Professional
          </h2>
          <ProvenanceTag kind="record" />
        </div>
        <ol className="hairline mt-6 divide-y border-y">
          {professional.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="personal" className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="personal" className="h-section">
            Personal projects
          </h2>
          <ProvenanceTag kind="personal" />
        </div>
        <p className="mt-3 max-w-2xl leading-snug text-muted">
          Built on my own to practise. They show hands-on implementation, and none of them is a
          claim about production scale.
        </p>
        <ol className="hairline mt-6 divide-y border-y">
          {personal.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={i} />
          ))}
        </ol>
      </section>
    </main>
  )
}
