import Link from 'next/link'
import { capabilities } from '@/content/capabilities'
import { projects } from '@/content/projects'

const title = (slug: string) => projects.find((p) => p.slug === slug)!.title

export function Capabilities() {
  return (
    <dl className="hairline divide-y border-y">
      {capabilities.map((cap) => (
        <div key={cap.domain} className="hairline grid gap-3 py-5 lg:grid-cols-12 lg:gap-6">
          <dt className="display text-2xl lg:col-span-3">{cap.domain}</dt>
          <dd className="lg:col-span-9">
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {cap.applied.map((a) => (
                <li key={a.tool} className="leading-snug">
                  <span className="font-medium">{a.tool}</span>
                  {a.note && <span className="text-muted">, {a.note}</span>}
                  <span className="mt-0.5 block text-[0.9375rem]">
                    <span className="label text-muted">Used in </span>
                    <Link href={`/work/${a.project}`} className="link">
                      {title(a.project)}
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
            {cap.also.length > 0 && (
              <p className="mt-3 text-[0.9375rem] leading-snug text-muted">
                <span className="label">Also worked with </span>
                {cap.also.join(', ')}
              </p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
