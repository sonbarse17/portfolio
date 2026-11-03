import type { Metadata } from 'next'
import Link from 'next/link'
import { engagement, services } from '@/content/services'

export const metadata: Metadata = {
  title: 'Freelance Cloud and DevOps services',
  description:
    'Freelance DevOps and cloud services: CI/CD, cloud infrastructure, Kubernetes, Terraform, cost optimization and strategy.',
}

export default function FreelancePage() {
  return (
    <main className="wrap pt-10">
      <h1 className="h-page">Services</h1>
      <p className="lede mt-6 max-w-3xl">
        Freelance Cloud and DevOps work, delivered in your repositories and handed over so your team
        can run it. Available remotely, on AWS, GCP or Azure.
      </p>

      <h2 className="label mt-12 text-muted">What I offer</h2>
      <ol className="hairline mt-3 divide-y border-y">
        {services.map((service, i) => (
          <li key={service.id} className="hairline">
            <Link
              href={`/services/${service.id}`}
              className="group grid gap-x-6 gap-y-2 py-6 lg:grid-cols-12"
            >
              <span className="label text-muted lg:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display text-3xl transition-colors group-hover:text-signal sm:text-4xl lg:col-span-6">
                {service.title}
              </h3>
              <p className="leading-snug text-muted lg:col-span-5">
                {service.description}
                <span className="label mt-2 block text-ink group-hover:text-signal">
                  Learn more →
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <section aria-labelledby="how" className="mt-16">
        <h2 id="how" className="h-section">
          How it works
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {engagement.map(({ step, detail }, i) => (
            <li key={step} className="border-t border-ink pt-3">
              <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display mt-2 text-3xl">{step}</h3>
              <p className="mt-2 leading-snug text-muted">{detail}</p>
            </li>
          ))}
        </ol>
        <Link href="/#contact" className="btn mt-10">
          Start a conversation
        </Link>
      </section>
    </main>
  )
}
