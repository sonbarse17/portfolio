import React, { useState, useEffect } from "react";
import { FloatingDock } from "./ui/floating-dock";
import { FaHome, FaProjectDiagram, FaEnvelope, FaGithub, FaLinkedin, FaCogs, FaBriefcase, FaSun, FaMoon } from "react-icons/fa";
import { MdBrightness6 } from "react-icons/md";

export function FloatingDockDemo() {
  const [themeMode, setThemeMode] = useState('auto'); // 'auto' | 'light' | 'dark'
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

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (mode) => {
    let shouldBeDark;
    if (mode === 'auto') {
      shouldBeDark = getSystemTheme() === 'dark';
    } else {
      shouldBeDark = mode === 'dark';
    }
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode !== 'auto') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('auto');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const cycleTheme = () => {
    const modes = ['auto', 'light', 'dark'];
    const currentIndex = modes.indexOf(themeMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setThemeMode(nextMode);
    applyTheme(nextMode);
    localStorage.setItem('theme', nextMode);
    
    // Track theme toggle interaction
    if (typeof window !== 'undefined' && window.performanceMonitor) {
      window.performanceMonitor.trackInteraction('theme_toggle', nextMode);
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'auto': return <MdBrightness6 className="h-full w-full text-blue-500" />;
      case 'light': return <FaSun className="h-full w-full text-yellow-500" />;
      case 'dark': return <FaMoon className="h-full w-full text-blue-600" />;
      default: return <MdBrightness6 className="h-full w-full text-blue-500" />;
    }
  };

  const getThemeTitle = () => {
    switch (themeMode) {
      case 'auto': return 'Auto Theme';
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      default: return 'Auto Theme';
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
      title: getThemeTitle(),
      icon: getThemeIcon(),
      href: "#",
      onClick: cycleTheme,
    },
  ];
  
  return (
    <div className="flex items-center justify-center w-full">
      <FloatingDock items={links} />
    </div>
  );
}