import Link from 'next/link'
import { site } from '@/content/site'

export function SiteWordmark() {
  return (
    <Link href="/" className="site-wordmark" prefetch={false}>
      {site.name}
      <span aria-hidden="true">.</span>
    </Link>
  )
}
