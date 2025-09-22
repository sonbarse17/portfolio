import React, { useState, useEffect } from "react";
import { FloatingDock } from "./ui/floating-dock";
import { FaHome, FaProjectDiagram, FaEnvelope, FaGithub, FaLinkedin, FaCogs, FaBriefcase, FaSun, FaMoon } from "react-icons/fa";


export function FloatingDockDemo() {
  const [isDark, setIsDark] = useState(false);
  const smoothScrollTo = (target) => {
    if (target.startsWith('#')) {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.open(target, '_blank');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Track theme toggle interaction
    if (typeof window !== 'undefined' && window.performanceMonitor) {
      window.performanceMonitor.trackInteraction('theme_toggle', newTheme ? 'dark' : 'light');
    }
  };

  const links = [
    {
      title: "Home",
      icon: (
        <FaHome className="h-full w-full text-gray-600" />
      ),
      href: "#home",
      onClick: () => smoothScrollTo("#home"),
    },
    {
      title: "Skills",
      icon: (
        <FaCogs className="h-full w-full text-gray-600" />
      ),
      href: "#skills",
      onClick: () => smoothScrollTo("#skills"),
    },
    {
      title: "Projects",
      icon: (
        <FaProjectDiagram className="h-full w-full text-gray-600" />
      ),
      href: "#projects",
      onClick: () => smoothScrollTo("#projects"),
    },
    {
      title: "Experience",
      icon: (
        <FaBriefcase className="h-full w-full text-gray-600" />
      ),
      href: "#experience",
      onClick: () => smoothScrollTo("#experience"),
    },
    {
      title: "Contact",
      icon: (
        <FaEnvelope className="h-full w-full text-gray-600" />
      ),
      href: "#contact",
      onClick: () => smoothScrollTo("#contact"),
    },
    {
      title: "GitHub",
      icon: (
        <FaGithub className="h-full w-full text-gray-600" />
      ),
      href: "https://github.com/sonbarse17",
      onClick: () => smoothScrollTo("https://github.com/sonbarse17"),
    },
    {
      title: "LinkedIn",
      icon: (
        <FaLinkedin className="h-full w-full text-gray-600" />
      ),
      href: "https://linkedin.com/in/sushant-sonbarse",
      onClick: () => smoothScrollTo("https://linkedin.com/in/sushant-sonbarse"),
    },
    {
      title: isDark ? "Light Mode" : "Dark Mode",
      icon: (
        isDark ? <FaSun className="h-full w-full text-yellow-500" /> : <FaMoon className="h-full w-full text-blue-600" />
      ),
      href: "#",
      onClick: toggleTheme,
    },
  ];
  
  return (
    <div className="flex items-center justify-center w-full">
      <FloatingDock items={links} />
    </div>
  );
}