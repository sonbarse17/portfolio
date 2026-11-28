'use client'

import { usePathname } from 'next/navigation'
import { displayPath } from '@/lib/display-path'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/use-mounted'

export function StatusLine({
  path,
  hint,
  className,
}: {
  path?: string
  hint?: string
  className?: string
}) {
  const pathname = usePathname()
  const mounted = useMounted()
  // Without an explicit path the text depends on the client route, so it waits for hydration.
  const shown = path ?? (mounted ? displayPath(pathname) : '\u00a0')

  return (
    <p className={cn('status-line', className)} aria-hidden="true">
      <span className="mode-block">NORMAL</span>
      <span className="status-path">{shown}</span>
      <span className="status-hint">{hint ?? 'utf-8'}</span>
    </p>
  )
}
