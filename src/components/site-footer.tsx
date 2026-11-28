import Link from 'next/link'
import { SiteWordmark } from '@/components/site-wordmark'
import { site } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-signature">
          <SiteWordmark />
          <p>{site.role}</p>
        </div>
        <nav aria-label="Footer" className="footer-index">
          <ul>
            <li>
              <Link href="/#record">Experience</Link>
            </li>
            <li>
              <Link href="/resume">Résumé</Link>
            </li>
            <li>
              <Link href="/atlas">Atlas</Link>
            </li>
            <li>
              <Link href="/freelance">Services</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link href="/#contact">Contact</Link>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
        <p hidden data-build-sha={process.env.NEXT_PUBLIC_BUILD_SHA}>
          Static build {process.env.NEXT_PUBLIC_BUILD_SHA} · {process.env.NEXT_PUBLIC_BUILD_DATE}
        </p>
      </div>
    </footer>
  )
}
