import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { notFound } from 'next/navigation'

const services = {
  'cicd-pipeline': {
    title: 'CI/CD Pipeline Setup & Optimization',
    description:
      'Automate your build, test, and deployment processes for faster, more reliable releases.',
  },
  'cloud-infrastructure': {
    title: 'Cloud Infrastructure Design & Management',
    description:
      'Architect and manage scalable, secure, and cost-effective cloud infrastructure on AWS, GCP, or Azure.',
  },
  'kubernetes-consulting': {
    title: 'Kubernetes Consulting & Implementation',
    description: 'Deploy, manage, and scale containerized applications with Kubernetes.',
  },
  'iac-services': {
    title: 'Infrastructure as Code (IaC) Services',
    description:
      'Manage your infrastructure with code using Terraform for consistency and reliability.',
  },
  'cloud-cost-optimization': {
    title: 'Cloud Cost Optimization',
    description:
      'Analyze and optimize your cloud spending to reduce costs without sacrificing performance.',
  },
  'devops-strategy': {
    title: 'DevOps Strategy & Consulting',
    description:
      "Get expert guidance on your DevOps strategy to improve your team's efficiency and productivity.",
  },
}

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = services[slug as keyof typeof services]
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.title} - Sushant Sonbarse`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services[slug as keyof typeof services]

  if (!service) {
    notFound()
  }

  return (
    <main className="bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/freelance"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FiArrowLeft className="mr-2" />
          Back to Services
        </Link>
        <div className="py-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{service.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{service.description}</p>
        </div>
      </div>
    </main>
  )
}
