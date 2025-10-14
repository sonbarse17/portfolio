'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hover3d?: boolean
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  hover3d = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover3d ? { y: -8, scale: 1.02 } : undefined}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-xl',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
