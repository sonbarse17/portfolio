import type { ReactNode } from 'react'

export function RouteIntro({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="catalog-intro">
      <div>
        <p className="eyebrow">{label}</p>
        <h1 className="h-page">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  )
}
