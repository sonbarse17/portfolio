import { EnhancedLandingPage } from '@/components/features/enhanced-landing-page'
import { EnhancedSkillsSection } from '@/components/features/enhanced-skills-section'
import { EnhancedProjectsSection } from '@/components/features/enhanced-projects-section'
import { TimelineSection } from '@/components/features/timeline-section'
import { FreelanceSection } from '@/components/features/freelance-section'
import { ContactSection } from '@/components/features/contact-section'
import { AppleStyleDock } from '@/components/layout/apple-dock'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <main role="main">
        <section id="home" aria-label="Home section">
          <EnhancedLandingPage />
        </section>
        <div className="py-8 bg-gradient-to-b from-purple-50 to-white dark:from-black dark:to-gray-900 transition-colors duration-300" />
        <section id="skills" aria-label="Skills section">
          <EnhancedSkillsSection />
        </section>
        <div className="py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black transition-colors duration-300" />
        <section id="projects" aria-label="Projects section">
          <EnhancedProjectsSection />
        </section>
        <div className="py-8 bg-white dark:bg-black transition-colors duration-300" />
        <section id="experience" aria-label="Experience section">
          <TimelineSection />
        </section>
        <div className="py-8 bg-gray-50 dark:bg-black transition-colors duration-300" />
        <section id="freelance" aria-label="Freelance section">
          <FreelanceSection />
        </section>
        <div className="py-8 bg-gray-50 dark:bg-black transition-colors duration-300" />
        <section id="contact" aria-label="Contact section">
          <ContactSection />
        </section>
        <AppleStyleDock />
      </main>
    </>
  )
}
