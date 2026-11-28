import Image from 'next/image'

const artwork = new Map([
  ['azure-internal-access', '/assets/phase-two/private-ingress.webp'],
  ['aws-hosting-and-sso', '/assets/phase-two/hosting-layers.webp'],
  ['crm-on-eks', '/assets/phase-four/workload-field.webp'],
])

export function ProjectArtwork({ slug, cover = false }: { slug: string; cover?: boolean }) {
  const image = artwork.get(slug)
  if (!image) return null

  return (
    <div className="case-artwork" data-project={slug}>
      <picture>
        {slug === 'crm-on-eks' && (
          <source
            media="(max-width: 800px)"
            srcSet="/assets/phase-four/workload-field-mobile.webp"
          />
        )}
        <Image
          src={image}
          alt=""
          fill
          loading={cover ? 'eager' : 'lazy'}
          fetchPriority={cover ? 'high' : 'auto'}
          sizes="(max-width: 800px) 90vw, (max-width: 1450px) 53vw, 740px"
        />
      </picture>
    </div>
  )
}

export function hasProjectArtwork(slug: string) {
  return artwork.has(slug)
}
