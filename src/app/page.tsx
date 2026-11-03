import Image from 'next/image'
import Link from 'next/link'
import { BlastRadiusLab } from '@/components/labs/blast-radius'
import { Capabilities } from '@/components/capabilities'
import { ContactForm } from '@/components/contact-form'
import { PathStrip } from '@/components/path-strip'
import { ProvenanceLegend, ProvenanceTag } from '@/components/provenance'
import { Chips, ClassificationTag, ProjectRow } from '@/components/project-parts'
import { domains } from '@/content/atlas'
import { labs } from '@/content/labs'
import { personal, professional, projects } from '@/content/projects'
import { services } from '@/content/services'
import { background, figures, roles, site } from '@/content/site'

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  image: `${site.url}/assets/images/profile.jpg`,
  sameAs: [site.github, site.linkedin],
}

function SectionHead({
  no,
  id,
  title,
  children,
}: {
  no: string
  id: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <p className="label text-muted lg:col-span-1">{no}</p>
      <h2 id={id} className="h-section lg:col-span-7">
        {title}
      </h2>
      {children && (
        <div className="leading-snug text-muted lg:col-span-4 lg:self-end">{children}</div>
      )}
    </div>
  )
}

const featured = professional.filter((p) => p.tier === 'case')
const moreProfessional = professional.filter((p) => p.tier === 'overview')

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <section className="wrap pt-6 sm:pt-10">
        <p className="label flex flex-wrap justify-between gap-x-6 gap-y-1 text-muted">
          <span>Engineering record</span>
          <span>{site.role}</span>
        </p>
        <h1 className="display mt-3 text-[clamp(4rem,17.5vw,19.5rem)] leading-[0.8]">
          Sushant
          <br />
          Sonbarse
        </h1>

        <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="lede max-w-[32ch] sm:max-w-[40ch]">
              I work on the path from a commit to production, and on what happens the day part of it
              breaks.
            </p>
            <ul className="mt-5 space-y-1 leading-snug">
              <li>
                <span className="label mr-2 text-ok">● Available</span>
                Freelance Cloud and DevOps work, remote
              </li>
              <li className="text-muted">
                <span className="label mr-2">Now</span>
                Freelance DevOps Consultant, since 2025
              </li>
              <li className="text-muted">
                <span className="label mr-2">Before</span>
                DevOps Engineer Intern at HisanLabs, 9 months
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/work" className="btn">
                See the work
              </Link>
              <Link href="/lab" className="btn-quiet">
                Open the lab
              </Link>
              <a href="#contact" className="btn-quiet">
                Get in touch
              </a>
            </div>
          </div>
          <div className="relative hidden aspect-[3/4] max-w-52 overflow-hidden lg:col-span-4 lg:col-start-10 lg:block lg:justify-self-end">
            <Image
              src="/assets/images/profile.jpg"
              alt="Portrait of Sushant Sonbarse"
              fill
              sizes="208px"
              priority
              className="object-cover grayscale"
            />
          </div>
        </div>

        <div className="hairline mt-12 border-t pt-8">
          <PathStrip />
        </div>
      </section>

      <section aria-labelledby="how-to-read" className="wrap mt-16">
        <div className="grid gap-4 lg:grid-cols-12">
          <h2 id="how-to-read" className="label lg:col-span-3">
            How to read this site
          </h2>
          <div className="lg:col-span-9">
            <ProvenanceLegend />
          </div>
        </div>
      </section>

      <section aria-labelledby="work" className="wrap mt-24 scroll-mt-20">
        <SectionHead no="01" id="work" title="Case studies">
          <ProvenanceTag kind="record" />
          <p className="mt-1">Professional work, with architecture you can explore.</p>
        </SectionHead>

        <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-2">
          {featured.map((project) => (
            <article key={project.slug} className="border-t border-ink pt-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <ClassificationTag project={project} />
                <Chips items={project.labels} />
              </div>
              <h3 className="display mt-3 text-4xl sm:text-5xl">
                <Link
                  href={`/work/${project.slug}`}
                  className="transition-colors hover:text-signal"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="mt-3 max-w-[55ch] leading-snug text-muted">{project.summary}</p>
              <dl className="hairline mt-5 divide-y border-y">
                {project.glance.map((fact) => (
                  <div
                    key={fact.label}
                    className="hairline grid gap-1 py-2 sm:grid-cols-[8rem_1fr] sm:gap-4"
                  >
                    <dt className="label pt-0.5 text-muted">{fact.label}</dt>
                    <dd className="leading-snug">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <Link href={`/work/${project.slug}`} className="btn-quiet mt-5">
                Explore the architecture →
              </Link>
            </article>
          ))}
        </div>

        <ol className="hairline mt-12 divide-y border-y">
          {moreProfessional.map((p, i) => (
            <ProjectRow key={p.slug} project={p} index={featured.length + i} />
          ))}
        </ol>

        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="display text-3xl">Personal projects</h3>
            <ProvenanceTag kind="personal" />
          </div>
          <ul className="hairline mt-4 divide-y border-y">
            {personal.map((p) => (
              <li key={p.slug} className="hairline">
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid gap-x-6 gap-y-1 py-3 transition-colors hover:text-signal lg:grid-cols-12"
                >
                  <span className="font-display text-xl font-bold [font-stretch:80%] lg:col-span-5">
                    {p.title}
                  </span>
                  <span className="label self-center text-muted lg:col-span-7">{p.category}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/work" className="label link mt-4 inline-block py-2">
            All {projects.length} projects →
          </Link>
        </div>
      </section>

      <section aria-labelledby="capabilities" className="wrap mt-24 scroll-mt-20">
        <SectionHead no="02" id="capabilities" title="Capabilities">
          <ProvenanceTag kind="record" />
          <p className="mt-1">
            Grouped by domain and tied to where I used them. There are no skill bars, and a tool
            with no project beside it is listed as worked with.
          </p>
        </SectionHead>
        <div className="mt-10">
          <Capabilities />
        </div>
      </section>

      <section aria-labelledby="break-it" className="mt-24 scroll-mt-20 bg-panel py-12 lg:py-16">
        <div className="wrap">
          <SectionHead no="03" id="break-it" title="Start by breaking something">
            <ProvenanceTag kind="simulation" />
            <p className="mt-1">
              Availability is decided by dependencies, and diagrams usually hide them. This one
              computes them, and runs only in your browser.
            </p>
          </SectionHead>
          <div className="mt-10">
            <BlastRadiusLab />
          </div>
          <ol className="mt-12 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <li key={lab.slug} className="border-t border-ink pt-3">
                <Link href={`/lab/${lab.slug}`} className="group block">
                  <span className="label text-muted">{lab.title}</span>
                  <span className="mt-2 block font-display text-xl font-bold leading-tight transition-colors [font-stretch:80%] group-hover:text-signal">
                    {lab.question}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="record" className="wrap mt-24 scroll-mt-20">
        <SectionHead no="04" id="record" title="On the record">
          <ProvenanceTag kind="record" />
          <p className="mt-1">Work history and education, as I would put them on a CV.</p>
        </SectionHead>

        <dl className="hairline mt-10 grid border-y sm:grid-cols-3">
          {figures.map((figure) => (
            <div
              key={figure.label}
              className="hairline border-b py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <dd className="display text-[clamp(3rem,7.5vw,6.5rem)]">{figure.value}</dd>
              <dt className="mt-2 text-muted">{figure.label}</dt>
            </div>
          ))}
        </dl>
        <p className="label mt-2 text-muted">From the HisanLabs internship.</p>

        <ol className="mt-10 space-y-10">
          {roles.map((role) => (
            <li key={role.title} className="grid gap-3 lg:grid-cols-12">
              <p className="label text-muted lg:col-span-3">
                {role.when}
                {role.current && <span className="mt-1 block text-ok">● Current</span>}
              </p>
              <div className="lg:col-span-4">
                <h3 className="font-display text-3xl font-bold leading-tight [font-stretch:80%]">
                  {role.title}
                </h3>
                <p className="text-muted">
                  {role.org}, {role.where}
                </p>
              </div>
              <div className="lg:col-span-5">
                <ul className="leading-snug">
                  {role.points.map((point) => (
                    <li key={point} className="py-0.5">
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="label mt-2 text-muted">{role.stack.join(' / ')}</p>
              </div>
            </li>
          ))}
        </ol>

        <ul className="hairline mt-10 divide-y border-y">
          {background.map((item) => (
            <li key={item.title} className="hairline grid gap-1 py-4 lg:grid-cols-12 lg:gap-3">
              <span className="label text-muted lg:col-span-3">{item.when}</span>
              <span className="lg:col-span-4">
                <span className="label mr-2 text-muted">{item.kind}</span>
              </span>
              <span className="leading-snug lg:col-span-5">
                <span className="font-medium">{item.title}</span>
                <span className="block text-muted">{item.org}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="atlas" className="wrap mt-24 scroll-mt-20">
        <SectionHead no="05" id="atlas" title="The atlas">
          <ProvenanceTag kind="reference" />
          <p className="mt-1">A position on each domain, in place of a logo wall.</p>
        </SectionHead>
        <ul className="hairline mt-10 divide-y border-y">
          {domains.map((domain) => (
            <li key={domain.id} className="hairline">
              <Link
                href={`/atlas#${domain.id}`}
                className="grid gap-1 py-4 transition-colors hover:text-signal lg:grid-cols-12 lg:gap-4"
              >
                <span className="label pt-1 lg:col-span-4">{domain.title}</span>
                <span className="text-lg leading-snug lg:col-span-8">{domain.position}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="contact" className="wrap mt-24 scroll-mt-20">
        <SectionHead no="06" id="contact" title="Work with me" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:col-start-2">
            <p className="lede">Available for freelance Cloud and DevOps work, remotely.</p>
            <ul className="mt-5 leading-snug">
              {services.map((service) => (
                <li key={service.id} className="py-1">
                  <Link href={`/services/${service.id}`} className="link">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
