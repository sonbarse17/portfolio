import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10 ${className || ''}`}
    >
      {items.map((item, idx) => (
        <a
          href={item?.liveLink || item?.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          key={item?.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            <CardResults>{item.results}</CardResults>
            <CardActions>
              {item.liveLink && (
                <a
                  href={item.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Live Demo
                </a>
              )}
              {item.githubLink && (
                <a
                  href={item.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  View on GitHub
                </a>
              )}
            </CardActions>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={`rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 group-hover:border-gray-300 dark:group-hover:border-gray-600 relative z-20 shadow-lg transition-colors duration-300 ${className || ''}`}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={`text-gray-800 dark:text-white font-bold tracking-wide mt-4 transition-colors duration-300 ${className || ''}`}>
      {children}
    </h4>
  );
};

export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={`mt-8 text-gray-600 dark:text-gray-300 tracking-wide leading-relaxed text-sm transition-colors duration-300 ${className || ''}`}
    >
      {children}
    </p>
  );
};

export const CardResults = ({ className, children }) => {
  return (
    <p
      className={`mt-4 text-green-600 dark:text-green-400 text-sm font-semibold ${className || ''}`}
    >
      {children}
    </p>
  );
};

export const CardActions = ({ className, children }) => {
  return (
    <div className={`mt-8 flex justify-end space-x-4 ${className || ''}`}>
      {children}
    </div>
  );
};