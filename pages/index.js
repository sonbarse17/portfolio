import { useEffect } from 'react'
import Meta from '../components/Meta.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import LandingPage from '../components/LandingPage.jsx'
import SkillsSection from '../components/SkillsSection.jsx'
import ProjectsSection from '../components/ProjectsSection.jsx'
import TimelineDemo from '../components/TimelineDemo.jsx'
import ContactSection from '../components/ContactSection.jsx'
import FreelanceSection from '../components/FreelanceSection.jsx'
import { AppleStyleDock } from '../components/AppleStyleDock.jsx'
import { personSchema } from '../lib/structured-data.js'

export default function Home() {

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((_registration) => {
          // console.log('SW registered: ', registration);
        })
        .catch((_registrationError) => {
          // console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <>
      <Meta 
        title="Sushant Sonbarse - DevOps Engineer | Cloud Infrastructure & Automation"
        description="Sushant Sonbarse - DevOps Engineer specializing in cloud infrastructure, automation, and site reliability engineering. Expert in AWS, Kubernetes, Docker, and CI/CD pipelines."
        canonical="/"
        ogImage="/assets/images/profile.jpg"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      
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