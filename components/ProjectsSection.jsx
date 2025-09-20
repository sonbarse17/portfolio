import React from 'react';
import dynamic from 'next/dynamic';

const CardHoverEffectDemo = dynamic(() => import('./CardHoverEffectDemo.jsx').then(m => ({ default: m.CardHoverEffectDemo })), {
  ssr: false,
  loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>)}</div>
});



const ProjectsSection = () => {
    return (
        <section className="py-20 bg-gray-100 dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12 transition-colors duration-300">Deployed with Style</h2>
                <CardHoverEffectDemo />
            </div>
        </section>
    );
};

export default ProjectsSection;