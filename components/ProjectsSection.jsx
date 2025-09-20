import React from 'react';
import { CardHoverEffectDemo } from './CardHoverEffectDemo.jsx';



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