import type { Metadata } from 'next'
import Link from 'next/link'
import { RouteIntro } from '@/components/route-intro'
import { labs } from '@/content/labs'

export const metadata: Metadata = {
  title: 'The lab',
  description:
    'Interactive simulations of failure domains, release pipelines, Kubernetes scheduling, Terraform plans, SLO burn rates and IAM evaluation.',
}

export default function LabPage() {
  return (
    <main className="wrap">
      <RouteIntro label="Infrastructure simulations" title="The lab">
        <p className="lede">
          Change one part of a system and follow what happens. Each lab runs in your browser.
        </p>
      </RouteIntro>

      <ul className="catalog-list catalog-section" aria-label="Simulations">
        {labs.map((lab) => (
          <li key={lab.slug}>
            <Link href={`/lab/${lab.slug}`} className="catalog-row">
              <div>
                <p className="eyebrow">{lab.title}</p>
                <h2 className="display mt-1 text-3xl sm:text-4xl">{lab.question}</h2>
              </div>
              <p className="text-muted">{lab.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
