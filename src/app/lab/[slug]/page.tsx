import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { labComponents } from '@/components/labs'
import { ProvenanceTag } from '@/components/provenance'
import { labs } from '@/content/labs'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return labs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lab = labs.find((l) => l.slug === slug)
  return lab ? { title: `${lab.title} lab`, description: lab.summary } : { title: 'Not found' }
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params
  const index = labs.findIndex((l) => l.slug === slug)
  if (index === -1) notFound()

  const lab = labs[index]
  const next = labs[(index + 1) % labs.length]
  const Lab = labComponents[lab.slug]

  return (
    <main className="wrap pt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <Link href="/lab" className="label link">
          ← All labs
        </Link>
        <ProvenanceTag kind="simulation" />
      </div>
      <p className="label mt-6 text-muted">{lab.title}</p>
      <h1 className="h-section mt-2 max-w-5xl">{lab.question}</h1>
      <p className="lede mt-5 max-w-3xl">{lab.summary}</p>

      <div className="hairline mt-10 border-t pt-8">
        <Lab />
      </div>

      <section
        aria-label="About this model"
        className="hairline mt-12 grid gap-8 border-t pt-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-5">
          <h2 className="label text-muted">How the model works</h2>
          <p className="mt-2 leading-snug">{lab.model}</p>
        </div>
        <div className="lg:col-span-4">
          <h2 className="label text-muted">What it leaves out</h2>
          <ul className="mt-2 space-y-2">
            {lab.simplified.map((item) => (
              <li key={item} className="leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <h2 className="label text-muted">Covers</h2>
          <ul className="mt-2 space-y-1 leading-snug">
            {lab.covers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <Link href={`/lab/${next.slug}`} className="group mt-12 block border border-ink p-5">
        <span className="label text-muted">Next lab</span>
        <span className="display mt-2 block text-3xl transition-colors group-hover:text-signal sm:text-4xl">
          {next.question}
        </span>
      </Link>
    </main>
  )
}
