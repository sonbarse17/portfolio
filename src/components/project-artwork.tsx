import Image from 'next/image'
import type { ReactNode } from 'react'

const artwork = new Map([
  ['azure-internal-access', '/assets/phase-two/private-ingress.webp'],
  ['aws-hosting-and-sso', '/assets/phase-two/hosting-layers.webp'],
])

export function ProjectArtwork({ slug, children }: { slug: string; children?: ReactNode }) {
  const image = artwork.get(slug)
  if (!image) return null

  return (
    <div className="case-artwork" data-project={slug}>
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 760px) 92vw, (max-width: 1450px) 55vw, 770px"
      />
      <span className="case-artwork-credit">Concept illustration</span>
      {children}
    </div>
  )
}

export function hasProjectArtwork(slug: string) {
  return artwork.has(slug)
}
