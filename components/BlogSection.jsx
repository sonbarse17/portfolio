import React from 'react';
import { motion } from 'framer-motion';

const posts = [
  {
    title: 'Mastering Kubernetes: A Deep Dive into Pods and Nodes',
    description: 'An in-depth guide to understanding the fundamental building blocks of Kubernetes.',
    link: '#',
    date: 'Oct 15, 2023',
  },
  {
    title: 'The Ultimate Guide to CI/CD with Jenkins and Docker',
    description: 'Learn how to build a robust CI/CD pipeline from scratch using Jenkins and Docker.',
    link: '#',
    date: 'Sep 28, 2023',
  },
  {
    title: 'Infrastructure as Code: A Practical Guide to Terraform',
    description: 'Discover the power of Infrastructure as Code with this hands-on Terraform tutorial.',
    link: '#',
    date: 'Aug 12, 2023',
  },
];

const BlogSection = () => {
  return (
    <section className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12 transition-colors duration-300">
          From My Blog
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={index}
              className="group bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.description}
              </p>
              <div className="flex justify-between items-center">
                <a
                  href={post.link}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </a>
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  {post.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
