'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FloatingBadgeProps {
  children: ReactNode
  delay?: number
}

export function FloatingBadge({ children, delay = 0 }: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}
