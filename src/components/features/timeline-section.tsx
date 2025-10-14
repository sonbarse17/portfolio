'use client'

import { motion } from 'framer-motion'
import { SiAmazon, SiTerraform, SiAngular, SiSpring, SiGooglecloud } from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'
import { Card, CardContent } from '@/components/ui/card'

export function TimelineSection() {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12"
        >
          Experience Timeline
        </motion.h2>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      DevOps Engineer Intern
                    </h3>
                    <p className="text-lg text-primary font-semibold">HisanLabs Pvt Ltd</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pune, Maharashtra • Sep 2024 - May 2025
                    </p>
                  </div>
                  <span className="mt-4 md:mt-0 inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">
                    Previous Role
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🚀 Key Achievements
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Deployed CRM with 35+ microservices</li>
                      <li>• Automated AWS infrastructure with Terraform</li>
                      <li>• Enhanced CI/CD pipeline efficiency by 40%</li>
                      <li>• Reduced deployment time from 2hrs to 30min</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🛠️ Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">
                        <SiAngular size={14} />
                        Angular
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                        <SiSpring size={14} />
                        Spring Boot
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">
                        <SiAmazon size={14} />
                        AWS EKS
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                        <SiTerraform size={14} />
                        Terraform
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Freelance DevOps Consultant
                    </h3>
                    <p className="text-lg text-primary font-semibold">Self-Employed</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Remote • 2025 - Present
                    </p>
                  </div>
                  <span className="mt-4 md:mt-0 inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    Current Role
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🚀 Services
                    </h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• CI/CD Pipeline Setup & Optimization</li>
                      <li>• Cloud Infrastructure Design & Management</li>
                      <li>• Kubernetes Consulting & Implementation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                      🛠️ Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-sm">
                        <SiAmazon size={14} />
                        AWS
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        <SiGooglecloud size={14} />
                        GCP
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                        <VscAzure size={14} />
                        Azure
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
