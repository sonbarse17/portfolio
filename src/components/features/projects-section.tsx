'use client'

import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const projects = [
  {
    title: 'Kubernetes Cluster Management',
    description:
      'Automated Kubernetes cluster deployment and management using Terraform and Helm charts for scalable microservices architecture.',
    results: 'Reduced deployment time by 50% and improved scalability.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
  {
    title: 'CI/CD Pipeline Automation',
    description:
      'End-to-end CI/CD pipeline using Jenkins, GitLab CI, and GitHub Actions with automated testing, security scanning, and deployment.',
    results: 'Increased deployment frequency by 200% and reduced manual errors.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
  {
    title: 'Infrastructure as Code',
    description:
      'Complete AWS infrastructure provisioning using Terraform with multi-environment support and automated backup strategies.',
    results: 'Achieved 99.99% uptime and reduced infrastructure costs by 30%.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
  {
    title: 'Docker Containerization',
    description:
      'Containerized applications with Docker, optimized images, and multi-stage builds for production-ready deployments.',
    results: 'Improved application portability and reduced server costs by 25%.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
  {
    title: 'Monitoring & Observability',
    description:
      'Comprehensive monitoring stack with Prometheus, Grafana, and ELK stack for real-time application and infrastructure monitoring.',
    results: 'Reduced incident response time by 60% and improved system reliability.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
  {
    title: 'Cloud Migration Project',
    description:
      'Large-scale cloud migration from on-premises to AWS with zero-downtime deployment and cost optimization strategies.',
    results: 'Successfully migrated 50+ applications with zero downtime.',
    githubLink: 'https://github.com/sonbarse17',
    liveLink: null,
  },
]

export function ProjectsSection() {
  return (
    <section className="py-20 bg-gray-100 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12"
        >
          Deployed with Style
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{project.description}</CardDescription>
                  <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                    {project.results}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
