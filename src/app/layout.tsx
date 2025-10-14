import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SmoothScroll } from '@/components/smooth-scroll'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://sushantsonbarse.com'),
  title: 'Sushant Sonbarse - DevOps Engineer | Cloud Infrastructure & Automation',
  description:
    'DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines.',
  keywords: [
    'DevOps',
    'Cloud Infrastructure',
    'AWS',
    'Kubernetes',
    'Docker',
    'CI/CD',
    'Terraform',
    'Automation',
  ],
  authors: [{ name: 'Sushant Sonbarse' }],
  openGraph: {
    title: 'Sushant Sonbarse - DevOps Engineer',
    description: 'DevOps Engineer specializing in cloud infrastructure and automation',
    url: 'https://sushantsonbarse.com',
    siteName: 'Sushant Sonbarse Portfolio',
    images: [{ url: '/assets/images/profile.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sushant Sonbarse - DevOps Engineer',
    description: 'DevOps Engineer specializing in cloud infrastructure and automation',
    images: ['/assets/images/profile.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScroll />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
