import React from "react";
import { motion } from "framer-motion";
import Orb from "./ui/orb.jsx";
import { LayoutTextFlipDemo } from "./LayoutTextFlipDemo.jsx";
import { AnimatedButton } from "./ui/animated-button.jsx";
import { performanceMonitor } from '../lib/analytics';



const photoVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
  },
};

const LandingSection = () => {


  return (
    <section className="min-h-screen flex items-center justify-center relative bg-white dark:bg-black transition-colors duration-300">
      {/* Main Content */}
      <motion.div
        className="text-center z-10 px-4 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Interactive Orb with Profile */}
        <motion.div
          className="mb-12 flex justify-center items-center min-h-[300px]"
          variants={photoVariants}
          initial="initial"
          animate="animate"
        >
          <div className="w-80 h-80 mx-auto">
            <Orb 
              hue={0}
              hoverIntensity={0.3}
              rotateOnHover={true}
              profileImage={true}
            />
          </div>
        </motion.div>

        {/* Animated Title */}
        <div className="mb-6">
          <LayoutTextFlipDemo />
        </div>

        {/* Professional Introduction */}
        <motion.p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          👋 Hello! I&apos;m <span className="font-semibold text-blue-600 dark:text-blue-400">Sushant Sonbarse</span>, a passionate DevOps Engineer specializing in cloud infrastructure and automation.
        </motion.p>
        
        <motion.p
          className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
        >
          I design and implement scalable cloud solutions, automate deployment pipelines, and build robust infrastructure that powers modern applications. Welcome to my portfolio where innovation meets reliability.
        </motion.p>

        {/* Contact Info */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LandingSection;
