import type { Metadata } from 'next'
import { site } from '@/content/site'

export const homeTitle = `${site.name} | ${site.role}`

const socialImage = {
  url: '/assets/phase-four/share.jpg',
  width: 1200,
  height: 630,
  alt: `${site.name}, ${site.role}`,
}

export function pageMetadata(
  path: `/${string}`,
  title?: string,
  description = site.description
): Metadata {
  const url = new URL(path, site.url)
  const shareTitle = title ? `${title} | ${site.name}` : homeTitle

  return {
    title: title ?? { absolute: homeTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: site.name,
      images: [socialImage],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [{ url: socialImage.url, alt: socialImage.alt }],
    },
  }
}
