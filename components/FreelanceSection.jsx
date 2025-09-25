import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const services = [
  {
    title: 'CI/CD Pipeline Setup & Optimization',
    description: 'Automate your build, test, and deployment processes for faster, more reliable releases.',
  },
  {
    title: 'Cloud Infrastructure Design & Management',
    description: 'Architect and manage scalable, secure, and cost-effective cloud infrastructure on AWS, GCP, or Azure.',
  },
  {
    title: 'Kubernetes Consulting & Implementation',
    description: 'Deploy, manage, and scale containerized applications with Kubernetes.',
  },
  {
    title: 'Infrastructure as Code (IaC) Services',
    description: 'Manage your infrastructure with code using Terraform for consistency and reliability.',
  },
  {
    title: 'Cloud Cost Optimization',
    description: 'Analyze and optimize your cloud spending to reduce costs without sacrificing performance.',
  },
  {
    title: 'DevOps Strategy & Consulting',
    description: 'Get expert guidance on your DevOps strategy to improve your team\'s efficiency and productivity.',
  },
];

const FreelanceSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Freelance DevOps & Cloud Services
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          Let's build something amazing together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Let's Discuss Your Project
            <FiArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FreelanceSection;
