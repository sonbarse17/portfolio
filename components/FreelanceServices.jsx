import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaCloud, FaCogs, FaCode, FaDollarSign, FaChalkboardTeacher } from 'react-icons/fa';

const services = [
  {
    id: 'cicd-pipeline',
    icon: <FaCogs className="w-8 h-8 text-indigo-400" />,
    title: 'CI/CD Pipeline Setup & Optimization',
    description: 'Automate your build, test, and deployment processes for faster, more reliable releases.',
  },
  {
    id: 'cloud-infrastructure',
    icon: <FaCloud className="w-8 h-8 text-indigo-400" />,
    title: 'Cloud Infrastructure Design & Management',
    description: 'Architect and manage scalable, secure, and cost-effective cloud infrastructure on AWS, GCP, or Azure.',
  },
  {
    id: 'kubernetes-consulting',
    icon: <FaServer className="w-8 h-8 text-indigo-400" />,
    title: 'Kubernetes Consulting & Implementation',
    description: 'Deploy, manage, and scale containerized applications with Kubernetes.',
  },
  {
    id: 'iac-services',
    icon: <FaCode className="w-8 h-8 text-indigo-400" />,
    title: 'Infrastructure as Code (IaC) Services',
    description: 'Manage your infrastructure with code using Terraform for consistency and reliability.',
  },
  {
    id: 'cloud-cost-optimization',
    icon: <FaDollarSign className="w-8 h-8 text-indigo-400" />,
    title: 'Cloud Cost Optimization',
    description: 'Analyze and optimize your cloud spending to reduce costs without sacrificing performance.',
  },
  {
    id: 'devops-strategy',
    icon: <FaChalkboardTeacher className="w-8 h-8 text-indigo-400" />,
    title: 'DevOps Strategy & Consulting',
    description: 'Get expert guidance on your DevOps strategy to improve your team\'s efficiency and productivity.',
  },
];

const FreelanceServices = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            What I Offer
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            From cloud architecture to automated pipelines, I provide expert DevOps solutions to streamline your development lifecycle.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="group bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                {service.description}
              </p>
              <a
                href={`#contact`}
                className="inline-block mt-4 text-indigo-500 dark:text-indigo-400 font-semibold group-hover:underline"
              >
                Learn More →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreelanceServices;
