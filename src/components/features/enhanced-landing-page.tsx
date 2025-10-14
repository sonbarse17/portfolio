'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

const Orb = dynamic(() => import('@/components/ui/orb'), { ssr: false })

export function EnhancedLandingPage() {
  const router = useRouter()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const scrollToSection = (id: string) => {
    try {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error scrolling to section:', error)
    }
  }

  return (
    <section
      ref={ref}
      className="hero-section min-h-screen flex items-center justify-center relative bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <motion.div style={{ y, opacity }} className="text-center z-10 px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex justify-center items-center min-h-[300px]"
        >
          <div className="w-80 h-80 mx-auto relative">
            <Orb hue={0} hoverIntensity={0.3} rotateOnHover profileImage />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Sushant Sonbarse
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="inline-block"
          >
            <p className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              DevOps Engineer
            </p>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4"
        >
          👋 Building scalable cloud infrastructure and automating the future
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Designing robust cloud solutions, automating deployment pipelines, and building
          infrastructure that powers modern applications at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" onClick={() => scrollToSection('contact')} className="group">
              Let&apos;s Connect
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('projects')}>
              View My Work
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="secondary" onClick={() => router.push('/freelance')}>
              View Services
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-400 dark:text-gray-600"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
