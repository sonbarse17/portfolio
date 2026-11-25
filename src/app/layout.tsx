import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { site } from '@/content/site'
import './globals.css'
import './catalog.css'

const display = localFont({
  src: './fonts/geist-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-display',
})
const mono = localFont({
  src: './fonts/geist-mono-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-mono',
  preload: false,
})

const title = `${site.name} | ${site.role}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  icons: { icon: '/brand.svg' },
  alternates: { canonical: './' },
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: '/assets/images/profile.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description: site.description,
    images: ['/assets/images/profile.jpg'],
  },
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
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
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
