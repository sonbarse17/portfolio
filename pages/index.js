import Head from 'next/head'
import { useEffect } from 'react'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import LandingPage from '../components/LandingPage.jsx'
import SkillsSection from '../components/SkillsSection.jsx'
import ProjectsSection from '../components/ProjectsSection.jsx'
import TimelineDemo from '../components/TimelineDemo.jsx'


import ContactSection from '../components/ContactSection.jsx'
import FreelanceSection from '../components/FreelanceSection.jsx'

import { AppleStyleDock } from '../components/AppleStyleDock.jsx'

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Sushant Sonbarse",
    "alternateName": ["Sushant", "Sonbarse"],
    "jobTitle": "DevOps Engineer",
    "description": "Professional DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines.",
    "url": "https://sushantsonbarse.com",
    "image": "https://sushantsonbarse.com/assets/images/profile.jpg",
    "email": "sushant.sonbarse@example.com",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance DevOps Consultant"
    },
    "sameAs": [
      "https://github.com/sonbarse17",
      "https://linkedin.com/in/sushant-sonbarse",
      "https://sushantsonbarse.com"
    ],
    "knowsAbout": [
      "DevOps", "Cloud Computing", "Kubernetes", "Docker", "AWS", "Google Cloud", "Azure", 
      "Terraform", "Jenkins", "CI/CD", "Infrastructure as Code", "Site Reliability Engineering",
      "Ansible", "Prometheus", "Grafana", "Linux", "GitLab"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "DevOps Engineer",
      "occupationLocation": {
        "@type": "Country",
        "name": "India"
      },
      "skills": "Cloud Infrastructure, DevOps Automation, Kubernetes, Docker, AWS, Terraform"
    }
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
        <meta name="description" content="Sushant Sonbarse - DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines." />
        <meta name="keywords" content="Sushant Sonbarse, Sushant Sonbarse DevOps, Sushant Sonbarse Engineer, DevOps Engineer, Cloud Engineer, AWS Expert, Kubernetes Specialist, Docker Expert, Terraform, Jenkins, Site Reliability Engineering, Infrastructure as Code, Cloud Infrastructure, DevOps Automation" />
        <meta name="author" content="Sushant Sonbarse" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://sushantsonbarse.com" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Sushant Sonbarse - DevOps Engineer | Cloud Infrastructure Expert" />
        <meta property="og:description" content="Sushant Sonbarse - Professional DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Portfolio and contact information." />
        <meta property="og:url" content="https://sushantsonbarse.com" />
        <meta property="og:image" content="https://sushantsonbarse.com/assets/images/profile.jpg" />
        <meta property="og:image:alt" content="Sushant Sonbarse - DevOps Engineer Profile Photo" />
        <meta property="og:site_name" content="Sushant Sonbarse - DevOps Engineer Portfolio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sushant Sonbarse - DevOps Engineer" />
        <meta name="twitter:description" content="Sushant Sonbarse - Professional DevOps Engineer specializing in cloud infrastructure and automation" />
        <meta name="twitter:image" content="https://sushantsonbarse.com/assets/images/profile.jpg" />
        <meta name="twitter:image:alt" content="Sushant Sonbarse Profile Photo" />
        <meta name="twitter:creator" content="@sushantsonbarse" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <link rel="icon" href="/assets/images/profile.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/profile.jpg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/profile.jpg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/profile.jpg" />
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
        <ErrorBoundary><section id="freelance" aria-label="Freelance section"><FreelanceSection /></section></ErrorBoundary>
        <div className="py-8 bg-gray-50 dark:bg-black transition-colors duration-300"></div>
        <ErrorBoundary><section id="contact" aria-label="Contact section"><ContactSection /></section></ErrorBoundary>
        <AppleStyleDock />
      </main>
    </>
  )
}