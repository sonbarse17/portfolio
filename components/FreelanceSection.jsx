import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

const FreelanceSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Freelance DevOps & Cloud Services
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          Looking for expert help with your cloud infrastructure or DevOps practices?
        </p>
        <div className="text-center mt-12">
          <Link href="/freelance" legacyBehavior>
            <a className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Explore My Services
              <FiArrowRight className="ml-2" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreelanceSection;