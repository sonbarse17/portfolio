'use client'

import { usePathname } from 'next/navigation'
import { displayPath } from '@/lib/display-path'
import { useMounted } from '@/lib/use-mounted'

/** The ~/route line under the header. The homepage has its own terminal instead. */
export function PathBar() {
  const pathname = usePathname()
  const mounted = useMounted()
  if (pathname === '/') return null
  // The static 404 page is prerendered for a different route than the one the client sees, so the
  // text only appears after hydration. The non-breaking space keeps the line height.
  return (
    <p className="wrap path-bar" aria-hidden="true">
      {mounted ? displayPath(pathname) : '\u00a0'}
    </p>
  )
}
