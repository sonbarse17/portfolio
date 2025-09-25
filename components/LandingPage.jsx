import React from "react";
import { motion } from "framer-motion";
import Orb from "./ui/orb.jsx";
import { LayoutTextFlipDemo } from "./LayoutTextFlipDemo.jsx";
import { AnimatedButton } from "./ui/animated-button.jsx";
import { performanceMonitor } from '../lib/analytics';

const LandingSection = () => {
  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative bg-white dark:bg-black transition-colors duration-300">
      {/* Main Content */}
      <div className="text-center z-10 px-4 max-w-4xl mx-auto animate-fade-in-up">
        {/* Interactive Orb with Profile */}
        <div className="mb-12 flex justify-center items-center min-h-[300px]">
          <div className="w-80 h-80 mx-auto animate-fade-in-up">
            <Orb 
              hue={0}
              hoverIntensity={0.3}
              rotateOnHover={true}
              profileImage={true}
            />
          </div>
        </div>

        {/* Animated Title */}
        <div className="mb-6">
          <LayoutTextFlipDemo />
        </div>

        {/* Professional Introduction */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          👋 Hello! I&apos;m <span className="font-semibold text-blue-600 dark:text-blue-400">Sushant Sonbarse</span>, a passionate DevOps Engineer specializing in cloud infrastructure and automation.
        </p>
        
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          I design and implement scalable cloud solutions, automate deployment pipelines, and build robust infrastructure that powers modern applications. Welcome to my portfolio where innovation meets reliability.
        </p>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <AnimatedButton 
            onClick={() => {
              performanceMonitor.trackInteraction('click', 'contact_button');
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Let's Connect
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              performanceMonitor.trackInteraction('click', 'projects_button');
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View My Work
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => {
              performanceMonitor.trackInteraction('click', 'services_button');
              window.location.href = '/freelance';
            }}
          >
            View My Services
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};

export default LandingSection;