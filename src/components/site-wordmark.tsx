import Link from 'next/link'
import { site } from '@/content/site'

export function SiteWordmark() {
  return (
    <Link href="/" className="site-wordmark" prefetch={false}>
      <span aria-hidden="true">▸_</span>
      {site.name}
    </Link>
  )
}
