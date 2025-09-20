import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import ColourfulText from "./colourful-text";

export function LayoutTextFlip({ text, words, className = "" }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">
        {text}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWordIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold ml-2"
        >
          <ColourfulText text={words[currentWordIndex]} />
        </motion.span>
      </AnimatePresence>
    </div>
  );
}