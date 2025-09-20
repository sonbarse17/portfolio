"use client";
import { LayoutTextFlip } from "./ui/layout-text-flip";
import { motion } from "framer-motion";

export function LayoutTextFlipDemo() {
  return (
    <div>
      <motion.div
        className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text="I'm a "
          words={["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer", "Vibe Coder"]} />
      </motion.div>
      <p
        className="mt-4 text-center text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
        Passionate about cloud infrastructure, automation, and building scalable systems.
      </p>
    </div>
  );
}