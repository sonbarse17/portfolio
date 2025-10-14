'use client'

import { motion } from 'framer-motion'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedCard } from '@/components/ui/animated-card'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CloudInfrastructure = dynamic(
  () =>
    import('@/components/3d/CloudInfrastructure').then((mod) => ({
      default: mod.CloudInfrastructure,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse" />
    ),
  }
)

const projects = [
  {
    title: 'Kubernetes Cluster Management',
    description:
      'Automated Kubernetes cluster deployment and management using Terraform and Helm charts for scalable microservices architecture.',
    results: 'Reduced deployment time by 50% and improved scalability.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '☸️',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'CI/CD Pipeline Automation',
    description:
      'End-to-end CI/CD pipeline using Jenkins, GitLab CI, and GitHub Actions with automated testing, security scanning, and deployment.',
    results: 'Increased deployment frequency by 200% and reduced manual errors.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '🔄',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Infrastructure as Code',
    description:
      'Complete AWS infrastructure provisioning using Terraform with multi-environment support and automated backup strategies.',
    results: 'Achieved 99.99% uptime and reduced infrastructure costs by 30%.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '🏗️',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Docker Containerization',
    description:
      'Containerized applications with Docker, optimized images, and multi-stage builds for production-ready deployments.',
    results: 'Improved application portability and reduced server costs by 25%.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '🐳',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    title: 'Monitoring & Observability',
    description:
      'Comprehensive monitoring stack with Prometheus, Grafana, and ELK stack for real-time application and infrastructure monitoring.',
    results: 'Reduced incident response time by 60% and improved system reliability.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '📊',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cloud Migration Project',
    description:
      'Large-scale cloud migration from on-premises to AWS with zero-downtime deployment and cost optimization strategies.',
    results: 'Successfully migrated 50+ applications with zero downtime.',
    githubLink: 'https://github.com/sonbarse17',
    icon: '☁️',
    color: 'from-cyan-500 to-blue-500',
  },
]

export function EnhancedProjectsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
          >
            Deployed with Style
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Explore my DevOps projects featuring cloud infrastructure, automation, and scalable
            solutions
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Suspense
            fallback={
              <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            }
          >
            <CloudInfrastructure />
          </Suspense>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <AnimatedCard key={project.title} delay={index * 0.1}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    className={`text-4xl w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {project.icon}
                  </motion.div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">{project.description}</CardDescription>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-2"
                >
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
                  <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                    {project.results}
                  </p>
                </motion.div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      View on GitHub →
                    </a>
                  </Button>
                </motion.div>
              </CardFooter>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
