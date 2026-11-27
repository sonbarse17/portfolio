import Image from 'next/image'
import type { ReactNode } from 'react'

const artwork = new Map([
  ['azure-internal-access', '/assets/phase-two/private-ingress.webp'],
  ['aws-hosting-and-sso', '/assets/phase-two/hosting-layers.webp'],
])

export function ProjectArtwork({
  slug,
  children,
  cover = false,
}: {
  slug: string
  children?: ReactNode
  cover?: boolean
}) {
  const image = artwork.get(slug)
  if (!image) return null

  return (
    <div className="case-artwork" data-project={slug}>
      <Image
        src={image}
        alt=""
        fill
        priority={cover}
        sizes="(max-width: 800px) 90vw, (max-width: 1450px) 53vw, 740px"
      />
      <span className="case-artwork-credit">Concept illustration</span>
      {children}
    </div>
  )
}

export function hasProjectArtwork(slug: string) {
  return artwork.has(slug)
}
