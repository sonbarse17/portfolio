'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
  const shown = path ?? `~${pathname === '/' ? '' : pathname}`

  return (
    <p className={cn('status-line', className)} aria-hidden="true">
      <span className="mode-block">NORMAL</span>
      <span className="status-path">{shown}</span>
      <span className="status-hint">{hint ?? 'utf-8'}</span>
    </p>
  )
}
