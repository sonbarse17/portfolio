import type { Metadata } from 'next'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import { FreelanceServices } from '@/components/features/freelance-services'

export const metadata: Metadata = {
  title: 'Freelance DevOps & Cloud Services - Sushant Sonbarse',
  description:
    'Explore the freelance DevOps and cloud services offered by Sushant Sonbarse. CI/CD, cloud infrastructure, Kubernetes, and more.',
}

export default function FreelancePage() {
  return (
    <main className="bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
      <FreelanceServices />
    </main>
  )
}
