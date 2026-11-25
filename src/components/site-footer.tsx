import Link from 'next/link'
import { BrandMark } from '@/components/brand-mark'
import { site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-main">
          <div>
            <Link href="/" className="site-brand">
              <BrandMark />
              <span>{site.name}</span>
            </Link>
            <p className="mt-3 text-muted">{site.role}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="footer-links">
              <li>
                <Link href="/resume">Résumé</Link>
              </li>
              <li>
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="footer-build label">
          Static build {process.env.NEXT_PUBLIC_BUILD_SHA} · {process.env.NEXT_PUBLIC_BUILD_DATE}
        </p>
      </div>
    </footer>
  )
}
