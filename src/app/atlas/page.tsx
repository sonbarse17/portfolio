import { pageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { RouteIntro } from '@/components/route-intro'
import { domains } from '@/content/atlas'
import { labs } from '@/content/labs'

export const metadata = pageMetadata(
  '/atlas',
  'The atlas',
  'An engineering field guide to cloud architecture, CI/CD, Kubernetes, Terraform, observability, security and MLOps.'
)

export default function AtlasPage() {
  return (
    <main className="wrap">
      <RouteIntro label="Engineering field guide" title="The atlas">
        <p className="lede">
          Working principles for deciding how to build, ship, and operate infrastructure.
        </p>
      </RouteIntro>

      <nav aria-label="Domains" className="mt-10">
        <ol className="flex flex-wrap gap-x-5 gap-y-1">
          {domains.map((domain) => (
            <li key={domain.id}>
              <a href={`#${domain.id}`} className="btn-quiet">
                {domain.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-8">
        {domains.map((domain) => {
          const lab = labs.find((l) => l.slug === domain.lab)
          return (
            <section
              key={domain.id}
              id={domain.id}
              aria-labelledby={`${domain.id}-title`}
              className="hairline border-t py-10"
            >
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h2 id={`${domain.id}-title`} className="display mt-2 text-5xl sm:text-6xl">
                    {domain.title}
                  </h2>
                  <p className="lede mt-4">{domain.position}</p>
                  {lab && (
                    <Link href={`/lab/${lab.slug}`} className="label link mt-4 inline-block py-2">
                      Try the {lab.title} lab
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
