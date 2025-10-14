'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const Orb = dynamic(() => import('@/components/ui/orb'), { ssr: false })

export function LandingPage() {
  const router = useRouter()

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative bg-white dark:bg-black transition-colors duration-300 py-8">
      <div className="text-center z-10 px-4 max-w-4xl mx-auto">
        <div className="mb-6 flex justify-center items-center">
          <div className="w-64 h-64 md:w-72 md:h-72 mx-auto">
            <Orb hue={0} hoverIntensity={0.8} rotateOnHover profileImage />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Sushant Sonbarse
          </h1>
          <p className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-semibold">
            DevOps Engineer
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-3"
        >
          👋 Hello! I&apos;m a passionate DevOps Engineer specializing in cloud infrastructure and
          automation.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto"
        >
          I design and implement scalable cloud solutions, automate deployment pipelines, and build
          robust infrastructure that powers modern applications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Let&apos;s Connect
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('projects')}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              View My Work
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/freelance')}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              View Services
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
