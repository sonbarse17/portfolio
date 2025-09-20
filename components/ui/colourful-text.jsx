import { motion } from "framer-motion";

export default function ColourfulText({ text, className = "" }) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {text}
    </motion.span>
  );
}