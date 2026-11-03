import type { Metadata } from 'next'
import Link from 'next/link'
import { ProvenanceTag } from '@/components/provenance'
import { domains } from '@/content/atlas'
import { labs } from '@/content/labs'

export const metadata: Metadata = {
  title: 'The atlas',
  description:
    'An engineering field guide to cloud architecture, CI/CD, Kubernetes, Terraform, observability, security and MLOps.',
}

export default function AtlasPage() {
  return (
    <main className="wrap pt-10">
      <h1 className="h-page">The atlas</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <p className="lede lg:col-span-8">
          Knowing a tool means knowing when it is the wrong one. This is a working position on each
          domain, written so an experienced engineer can disagree with it.
        </p>
        <div className="lg:col-span-4">
          <ProvenanceTag kind="reference" />
          <p className="mt-1 leading-snug text-muted">
            Engineering judgement, not a list of past engagements. For what I have delivered, see
            the{' '}
            <Link href="/#record" className="link">
              record
            </Link>
            .
          </p>
        </div>
      </div>

      <nav aria-label="Domains" className="mt-10">
        <ol className="flex flex-wrap gap-x-5 gap-y-1">
          {domains.map((domain) => (
            <li key={domain.id}>
              <a href={`#${domain.id}`} className="label link inline-block py-1.5">
                {domain.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8">
        {domains.map((domain, i) => {
          const lab = labs.find((l) => l.slug === domain.lab)
          return (
            <section
              key={domain.id}
              id={domain.id}
              aria-labelledby={`${domain.id}-title`}
              className="scroll-mt-20 border-t border-ink py-10"
            >
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <p className="label text-muted">{String(i + 1).padStart(2, '0')}</p>
                  <h2 id={`${domain.id}-title`} className="display mt-2 text-5xl sm:text-6xl">
                    {domain.title}
                  </h2>
                  <p className="lede mt-4">{domain.position}</p>
                  {lab && (
                    <Link href={`/lab/${lab.slug}`} className="label link mt-4 inline-block py-2">
                      Try the {lab.title} lab →
                    </Link>
                  )}
                </div>
                <dl className="hairline divide-y lg:col-span-6 lg:col-start-7">
                  {domain.topics.map((topic) => (
                    <div key={topic.name} className="hairline py-3 first:pt-0">
                      <dt className="font-display text-lg font-bold [font-stretch:85%]">
                        {topic.name}
                      </dt>
                      <dd className="leading-snug text-muted">{topic.note}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}
