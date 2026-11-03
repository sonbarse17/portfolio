import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { labs } from '@/content/labs'
import { services } from '@/content/services'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map(({ id }) => ({ slug: id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = services.find((s) => s.id === slug)
  return service
    ? { title: service.title, description: service.description }
    : { title: 'Service not found' }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = services.find((s) => s.id === slug)
  if (!service) notFound()

  const lab = labs.find((l) => l.slug === service.lab)!

  return (
    <main className="wrap pt-8">
      <Link href="/freelance" className="label link">
        ← All services
      </Link>
      <h1 className="h-section mt-6 max-w-5xl">{service.title}</h1>
      <p className="lede mt-5 max-w-3xl">{service.description}</p>

      <div className="hairline mt-12 grid gap-10 border-t pt-8 lg:grid-cols-12">
        <section aria-labelledby="covers" className="lg:col-span-5">
          <h2 id="covers" className="label text-muted">
            What it covers
          </h2>
          <ul className="mt-3 space-y-2">
            {service.covers.map((item) => (
              <li key={item} className="leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="deliverables" className="lg:col-span-4">
          <h2 id="deliverables" className="label text-muted">
            What you receive
          </h2>
          <ul className="mt-3 space-y-2">
            {service.deliverables.map((item) => (
              <li key={item} className="leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </section>
        <div className="lg:col-span-3">
          <Link href="/#contact" className="btn w-full">
            Talk about this
          </Link>
          <Link href={`/lab/${lab.slug}`} className="label link mt-4 inline-block py-2">
            Related lab: {lab.title} →
          </Link>
        </div>
      </div>
    </main>
  )
}
