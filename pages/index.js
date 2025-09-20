import Head from 'next/head'
import { useEffect } from 'react'
import ErrorBoundary from '../components/ui/error-boundary.jsx'
import LandingPage from '../components/LandingPage.jsx'
import SkillsSection from '../components/SkillsSection.jsx'
import ProjectsSection from '../components/ProjectsSection.jsx'
import TimelineDemo from '../components/TimelineDemo.jsx'
import ContactSection from '../components/ContactSection.jsx'
import { AppleStyleDock } from '../components/AppleStyleDock.jsx'

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sushant Sonbarse",
    "jobTitle": "DevOps Engineer",
    "description": "DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering",
    "url": "https://sushantsonbarse.com",
    "url": "https://sushantsonbarse.cloud",
    "sameAs": [
      "https://github.com/sonbarse17",
      "https://linkedin.com/in/sushant-sonbarse"
    ],
    "knowsAbout": ["DevOps", "Cloud Computing", "Kubernetes", "Docker", "AWS", "Terraform", "Jenkins"]
  };

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          // console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          // console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sushant Sonbarse - DevOps Engineer | Cloud Infrastructure & Automation</title>
        <meta name="description" content="DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines." />
        <meta name="keywords" content="DevOps, Cloud Engineer, AWS, Kubernetes, Docker, Terraform, Jenkins, Site Reliability Engineering, Infrastructure as Code" />
        <meta name="author" content="Sushant Sonbarse" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <html lang="en" />
        <link rel="canonical" href="https://sushantsonbarse.dev" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sushant Sonbarse - DevOps Engineer" />
        <meta property="og:description" content="DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering" />
        <meta property="og:url" content="https://sushantsonbarse.dev" />
        <meta property="og:image" content="https://sushantsonbarse.dev/assets/images/profile.jpg" />
        <meta property="og:site_name" content="Sushant Sonbarse Portfolio" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sushant Sonbarse - DevOps Engineer" />
        <meta name="twitter:description" content="DevOps Engineer specializing in cloud infrastructure and automation" />
        <meta name="twitter:image" content="https://sushantsonbarse.dev/assets/images/profile.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.emailjs.com" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sushant Portfolio" />
      </Head>
      
      <main role="main">
        <section id="home" aria-label="Home section"><LandingPage /></section>
        <div className="py-8 bg-white dark:bg-black transition-colors duration-300"></div>
        <ErrorBoundary><section id="skills" aria-label="Skills section"><SkillsSection /></section></ErrorBoundary>
        <div className="py-8 bg-gray-100 dark:bg-black transition-colors duration-300"></div>
        <ErrorBoundary><section id="projects" aria-label="Projects section"><ProjectsSection /></section></ErrorBoundary>
        <div className="py-8 bg-white dark:bg-black transition-colors duration-300"></div>
        <ErrorBoundary><section id="experience" aria-label="Experience section"><TimelineDemo /></section></ErrorBoundary>
        <div className="py-8 bg-gray-50 dark:bg-black transition-colors duration-300"></div>
        <ErrorBoundary><section id="contact" aria-label="Contact section"><ContactSection /></section></ErrorBoundary>
        <AppleStyleDock />
      </main>
    </>
  )
}