'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

export function FreelanceSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4"
        >
          Freelance DevOps & Cloud Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12"
        >
          Looking for expert help with your cloud infrastructure or DevOps practices?
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" asChild>
            <Link href="/freelance" className="inline-flex items-center">
              Explore My Services
              <FiArrowRight className="ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
