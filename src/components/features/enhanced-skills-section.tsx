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
import { AnimatedCard } from '@/components/ui/animated-card'

const devopsSkills = [
  { name: 'Linux', icon: FaLinux, color: '#FCC624', level: 95 },
  { name: 'Docker', icon: FaDocker, color: '#2496ED', level: 90 },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', level: 85 },
  { name: 'Jenkins', icon: FaJenkins, color: '#D24939', level: 88 },
  { name: 'GitLab', icon: FaGitlab, color: '#FC6D26', level: 87 },
  { name: 'Ansible', icon: SiAnsible, color: '#EE0000', level: 82 },
  { name: 'Prometheus', icon: SiPrometheus, color: '#E6522C', level: 80 },
  { name: 'Grafana', icon: SiGrafana, color: '#F46800', level: 85 },
]

const cloudSkills = [
  { name: 'AWS', icon: FaAws, color: '#FF9900', level: 92 },
  { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4', level: 78 },
  { name: 'Azure', icon: VscAzure, color: '#0078D4', level: 75 },
  { name: 'Terraform', icon: SiTerraform, color: '#844FBA', level: 90 },
]

export function EnhancedSkillsSection() {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          DevOps Arsenal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-16 text-lg"
        >
          Tools and technologies I use to build scalable infrastructure
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {devopsSkills.map((skill, index) => (
            <AnimatedCard
              key={skill.name}
              delay={index * 0.05}
              className="group relative overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <skill.icon size={50} color={skill.color} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {skill.name}
                </h3>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {skill.level}%
                </span>
              </div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${skill.color}22, ${skill.color}44)`,
                }}
              />
            </AnimatedCard>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-400 bg-clip-text text-transparent mb-12"
        >
          Cloud Platforms
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {cloudSkills.map((skill, index) => (
            <AnimatedCard
              key={skill.name}
              delay={index * 0.1}
              className="group relative overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4"
                >
                  <skill.icon size={50} color={skill.color} />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {skill.name}
                </h3>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {skill.level}%
                </span>
              </div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${skill.color}22, ${skill.color}44)`,
                }}
              />
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
