'use client'

import { motion } from 'framer-motion'
import {
  FaServer,
  FaCloud,
  FaCogs,
  FaCode,
  FaDollarSign,
  FaChalkboardTeacher,
} from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const services = [
  {
    id: 'cicd-pipeline',
    icon: FaCogs,
    title: 'CI/CD Pipeline Setup & Optimization',
    description:
      'Automate your build, test, and deployment processes for faster, more reliable releases.',
  },
  {
    id: 'cloud-infrastructure',
    icon: FaCloud,
    title: 'Cloud Infrastructure Design & Management',
    description:
      'Architect and manage scalable, secure, and cost-effective cloud infrastructure on AWS, GCP, or Azure.',
  },
  {
    id: 'kubernetes-consulting',
    icon: FaServer,
    title: 'Kubernetes Consulting & Implementation',
    description: 'Deploy, manage, and scale containerized applications with Kubernetes.',
  },
  {
    id: 'iac-services',
    icon: FaCode,
    title: 'Infrastructure as Code (IaC) Services',
    description:
      'Manage your infrastructure with code using Terraform for consistency and reliability.',
  },
  {
    id: 'cloud-cost-optimization',
    icon: FaDollarSign,
    title: 'Cloud Cost Optimization',
    description:
      'Analyze and optimize your cloud spending to reduce costs without sacrificing performance.',
  },
  {
    id: 'devops-strategy',
    icon: FaChalkboardTeacher,
    title: 'DevOps Strategy & Consulting',
    description:
      "Get expert guidance on your DevOps strategy to improve your team's efficiency and productivity.",
  },
]

export function FreelanceServices() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 text-center"
        >
          What I Offer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16 text-center"
        >
          From cloud architecture to automated pipelines, I provide expert DevOps solutions to
          streamline your development lifecycle.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="h-full hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <service.icon className="w-8 h-8 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    Learn More →
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
