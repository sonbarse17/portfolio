import React from "react";
import { Timeline } from "./ui/timeline.jsx";

import { SiJenkins, SiDocker, SiAmazonaws, SiTerraform, SiAngular, SiSpring } from 'react-icons/si';



export default function TimelineDemo() {
  const data = [
    {
      title: "2024 - Present",
      content: (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-2xl shadow-2xl p-8 mb-6 transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="heading-md text-gray-800 dark:text-white mb-2 transition-colors duration-300">DevOps Engineer Intern</h3>
                <p className="body-md text-primary-600 font-semibold">HisanLabs Pvt Ltd</p>
                <p className="body-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Pune, Maharashtra • Sep 2024 - May 2025</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Current Role</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 transition-colors duration-300">🚀 Key Achievements</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <li className="flex items-start"><span className="text-primary-500 mr-2">•</span>Deployed CRM with 35+ microservices</li>
                  <li className="flex items-start"><span className="text-primary-500 mr-2">•</span>Automated AWS infrastructure with Terraform</li>
                  <li className="flex items-start"><span className="text-primary-500 mr-2">•</span>Enhanced CI/CD pipeline efficiency by 40%</li>
                  <li className="flex items-start"><span className="text-primary-500 mr-2">•</span>Reduced deployment time from 2hrs to 30min</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 transition-colors duration-300">🛠️ Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"><SiAngular size={14} />Angular</span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"><SiSpring size={14} />Spring Boot</span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"><SiAmazonaws size={14} />AWS EKS</span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"><SiTerraform size={14} />Terraform</span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"><SiJenkins size={14} />Jenkins</span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"><SiDocker size={14} />Docker</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-8 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <SiJenkins size={40} color="#D33833" title="Jenkins" />
              <SiDocker size={40} color="#2496ED" title="Docker" />
              <SiAmazonaws size={40} color="#FF9900" title="AWS" />
              <SiTerraform size={40} color="#623CE4" title="Terraform" />
            </div>
          </div>
          
          <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 rounded-2xl p-6 transition-colors duration-300">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-center transition-colors duration-300">📈 Impact Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">35+</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Microservices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">40%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Faster CI/CD</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">75%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Time Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}