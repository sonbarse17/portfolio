import type { Metadata } from 'next'
import Link from 'next/link'
import { RouteIntro } from '@/components/route-intro'
import { engagement, services } from '@/content/services'

export const metadata: Metadata = {
  title: 'Freelance Cloud and DevOps services',
  description:
    'Freelance DevOps and cloud services: CI/CD, cloud infrastructure, Kubernetes, Terraform, cost optimization and strategy.',
}

export default function FreelancePage() {
  return (
    <main className="wrap">
      <RouteIntro label="Freelance Cloud & DevOps" title="Services">
        <p className="lede">
          Remote DevOps work on AWS, GCP, or Azure, delivered in your repositories for your team to
          run.
        </p>
        <Link href="/#contact" className="btn">
          Discuss a project
        </Link>
      </RouteIntro>

      <section className="catalog-section" aria-labelledby="offer">
        <h2 id="offer" className="display text-3xl sm:text-4xl">
          What I offer
        </h2>
        <ul className="catalog-list">
          {services.map((service) => (
            <li key={service.id}>
              <Link href={`/services/${service.id}`} className="catalog-row">
                <h3 className="display text-2xl sm:text-3xl">{service.title}</h3>
                <p className="text-muted">{service.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="catalog-section">
        <h2 id="how" className="h-section">
          How we’ll work
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {engagement.map(({ step, detail }) => (
            <li key={step} className="hairline border-t pt-4">
              <h3 className="display text-3xl">{step}</h3>
              <p className="mt-2 text-muted">{detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
