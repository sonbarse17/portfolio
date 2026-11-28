import { pageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { RouteIntro } from '@/components/route-intro'
import { labs } from '@/content/labs'

export const metadata = pageMetadata(
  '/lab',
  'The lab',
  'Interactive simulations of failure domains, release pipelines, Kubernetes scheduling, Terraform plans, SLO burn rates and IAM evaluation.'
)

export default function LabPage() {
  return (
    <main className="wrap">
      <RouteIntro label="Infrastructure simulations" title="The lab">
        <p className="lede">
          Change one part of a system and follow what happens. Each lab runs in your browser.
        </p>
      </RouteIntro>

      <ul className="catalog-list" aria-label="Engineering studio">
        <li>
          <Link href="/lab/studio" className="catalog-row">
            <div>
              <p className="eyebrow">Trace · Deploy · Recover</p>
              <h2 className="display mt-1 text-3xl sm:text-4xl">Engineering studio</h2>
            </div>
            <p className="text-muted">
              Follow a request through the stack, run a release and trace a recovery.
            </p>
          </Link>
        </li>
      </ul>

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
