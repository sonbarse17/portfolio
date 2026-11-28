import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DEFAULT_PALETTE, palettes } from '@/content/palettes'
import { site } from '@/content/site'
import { homeTitle } from '@/lib/metadata'
import { paletteCss } from '@/lib/palette-css'
import './globals.css'
import './catalog.css'
import './finder.css'

const display = localFont({
  src: './fonts/geist-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-display',
})
const mono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-600-latin.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: homeTitle, template: `%s | ${site.name}` },
  authors: [{ name: site.name }],
  icons: { icon: '/brand.svg' },
}

// A static export cannot set response headers, so the policy ships as a meta tag. Next.js and
// next-themes need inline scripts. Configure HSTS and frame-ancestors at the host.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.emailjs.com",
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        )}
        <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          themes={palettes.map((palette) => palette.slug)}
          defaultTheme={DEFAULT_PALETTE}
          enableSystem={false}
          storageKey="palette"
        >
          <SiteHeader />
          <div id="content" tabIndex={-1}>
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
