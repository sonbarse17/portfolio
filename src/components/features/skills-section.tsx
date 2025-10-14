'use client'

import { motion } from 'framer-motion'
import { FaLinux, FaDocker, FaJenkins, FaGitlab, FaAws } from 'react-icons/fa'
import {
  SiAnsible,
  SiKubernetes,
  SiTerraform,
  SiPrometheus,
  SiGrafana,
  SiGooglecloud,
} from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'
import { Card, CardContent } from '@/components/ui/card'

const devopsSkills = [
  { name: 'Linux', icon: FaLinux, color: '#FCC624' },
  { name: 'Docker', icon: FaDocker, color: '#2496ED' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
  { name: 'Jenkins', icon: FaJenkins, color: '#D24939' },
  { name: 'GitLab', icon: FaGitlab, color: '#FC6D26' },
  { name: 'Ansible', icon: SiAnsible, color: '#EE0000' },
  { name: 'Prometheus', icon: SiPrometheus, color: '#E6522C' },
  { name: 'Grafana', icon: SiGrafana, color: '#F46800' },
]

const cloudSkills = [
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
  { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
  { name: 'Azure', icon: VscAzure, color: '#0078D4' },
  { name: 'Terraform', icon: SiTerraform, color: '#844FBA' },
]

export function SkillsSection() {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-12"
        >
          A DevOps Playground
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {devopsSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="group hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <skill.icon
                    size={50}
                    color={skill.color}
                    className="mb-4 transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {skill.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-12"
        >
          Cloud Playground
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {cloudSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="group hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <skill.icon
                    size={50}
                    color={skill.color}
                    className="mb-4 transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {skill.name}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
