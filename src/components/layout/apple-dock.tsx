'use client'

import { FaHome, FaBriefcase, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'

export function AppleStyleDock() {
  const scrollToSection = (id: string) => {
    try {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error scrolling to section:', error)
    }
  }

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-6 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => scrollToSection('home')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
          aria-label="Home"
        >
          <FaHome className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => scrollToSection('projects')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
          aria-label="Projects"
        >
          <FaBriefcase className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={() => scrollToSection('contact')}
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
          aria-label="Contact"
        >
          <FaEnvelope className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <a
          href="https://github.com/sonbarse17"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
          aria-label="GitHub"
        >
          <FaGithub className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </a>
        <a
          href="https://linkedin.com/in/sushant-sonbarse"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-110"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </a>
      </div>
    </div>
  )
}
