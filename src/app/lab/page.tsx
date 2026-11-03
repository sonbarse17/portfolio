import type { Metadata } from 'next'
import Link from 'next/link'
import { ProvenanceTag } from '@/components/provenance'
import { labs } from '@/content/labs'

export const metadata: Metadata = {
  title: 'The lab',
  description:
    'Interactive simulations of failure domains, release pipelines, Kubernetes scheduling, Terraform plans, SLO burn rates and IAM evaluation.',
}

export default function LabPage() {
  return (
    <main className="wrap pt-10">
      <h1 className="h-page">The lab</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <p className="lede lg:col-span-8">
          Each lab starts from a question operators actually ask, then lets you change the system
          and see the answer move. The logic is real and unit tested. The infrastructure is not.
        </p>
        <div className="lg:col-span-4">
          <ProvenanceTag kind="simulation" />
          <p className="mt-1 leading-snug text-muted">
            Everything runs in your browser. No cloud account or live system sits behind these labs,
            and each page lists what its model leaves out.
          </p>
        </div>
      </div>

      <ol className="hairline mt-12 divide-y border-y">
        {labs.map((lab, i) => (
          <li key={lab.slug} className="hairline">
            <Link
              href={`/lab/${lab.slug}`}
              className="group grid gap-x-6 gap-y-2 py-6 lg:grid-cols-12"
            >
              <span className="label text-muted lg:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="lg:col-span-6">
                <p className="label text-muted">{lab.title}</p>
                <h2 className="display mt-1 text-4xl transition-colors group-hover:text-signal sm:text-5xl">
                  {lab.question}
                </h2>
              </div>
              <p className="leading-snug text-muted lg:col-span-5">{lab.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  )
}
