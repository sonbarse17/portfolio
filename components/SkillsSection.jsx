import React from "react";
import { motion } from "framer-motion";
import { 
  FaLinux, 
  FaDocker, 
  FaJenkins, 
  FaGitlab, 
  FaAws
} from "react-icons/fa";
import { SiAnsible, SiKubernetes, SiTerraform, SiPrometheus, SiGrafana, SiGooglecloud } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

import dynamic from 'next/dynamic';

const LogoLoop = dynamic(() => import('./ui/logo-loop.jsx'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
});

const skillVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
};

const SkillsSection = () => {
  const devopsSkills = [
    { name: "Linux", icon: <FaLinux size={50} color="#FCC624" /> },
    { name: "Docker", icon: <FaDocker size={50} color="#2496ED" /> },
    { name: "Kubernetes", icon: <SiKubernetes size={50} color="#326CE5" /> },
    { name: "Jenkins", icon: <FaJenkins size={50} color="#D24939" /> },
    { name: "GitLab", icon: <FaGitlab size={50} color="#FC6D26" /> },
    { name: "Ansible", icon: <SiAnsible size={50} color="#EE0000" /> },
    { name: "Prometheus", icon: <SiPrometheus size={50} color="#E6522C" /> },
    { name: "Grafana", icon: <SiGrafana size={50} color="#F46800" /> },
  ];

  const cloudSkills = [
    { name: "AWS", icon: <FaAws size={50} color="#FF9900" /> },
    { name: "Google Cloud", icon: <SiGooglecloud size={50} color="#4285F4" /> },
    { name: "Azure", icon: <VscAzure size={50} color="#0078D4" /> },
    { name: "Terraform", icon: <SiTerraform size={50} color="#844FBA" /> },
  ];

  return (
    <section className="section-padding bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-6xl mx-auto container-padding">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-12 transition-colors duration-300">A DevOps Playground</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {devopsSkills.map((skill, index) => (
                    <motion.div 
                        key={index} 
                        className="group bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden" 
                        variants={skillVariants} 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 relative z-10">{skill.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 relative z-10 transition-colors duration-300">{skill.name}</h3>
                    </motion.div>
                ))}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-12 transition-colors duration-300">Cloud Playground</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {cloudSkills.map((skill, index) => (
                    <motion.div 
                        key={index} 
                        className="group bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg hover:shadow-2xl flex flex-col items-center text-center relative overflow-hidden" 
                        variants={skillVariants} 
                        initial="hidden" 
                        whileInView="visible" 
                        viewport={{ once: true, amount: 0.5 }} 
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 relative z-10">{skill.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 relative z-10 transition-colors duration-300">{skill.name}</h3>
                    </motion.div>
                ))}
            </div>
        </div>
        
        <div className="mt-16">
            <h3 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-8 transition-colors duration-300">Technologies I Work With</h3>
            <div style={{ height: '80px', position: 'relative', overflow: 'hidden' }}>
                <LogoLoop
                    logos={[...devopsSkills, ...cloudSkills].map(skill => ({ 
                        node: <div className="text-4xl">{skill.icon}</div>, 
                        title: skill.name 
                    }))}
                    speed={30}
                    direction="left"
                    logoHeight={60}
                    gap={60}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#ffffff"
                    ariaLabel="DevOps and Cloud Technologies"
                />
            </div>
        </div>
    </section>
  );
};

export default SkillsSection;