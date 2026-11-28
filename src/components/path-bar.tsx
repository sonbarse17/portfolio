'use client'

import { usePathname } from 'next/navigation'

/** The ~/route line under the header. The homepage has its own terminal instead. */
export function PathBar() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return (
    <p className="wrap path-bar" aria-hidden="true">
      {`~${pathname.replace(/\/$/, '')}`}
    </p>
  )
}
