import { site } from '@/content/site'
import { ProvenanceTag } from '@/components/provenance'

export function SiteFooter() {
  return (
    <footer className="hairline mt-24 border-t">
      <div className="wrap grid gap-6 py-8 sm:grid-cols-2">
        <div className="space-y-1">
          <ProvenanceTag kind="live" />
          <p className="label text-muted">
            Static build {process.env.NEXT_PUBLIC_BUILD_SHA} on {process.env.NEXT_PUBLIC_BUILD_DATE}
          </p>
        </div>
        <ul className="flex gap-6 sm:justify-end">
          <li>
            <a className="label link" href={site.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a
              className="label link"
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
