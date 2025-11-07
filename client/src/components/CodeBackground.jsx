import { Code } from "lucide-react";
import { motion } from "framer-motion";

const CodeBackground = ({ title, subtitle, small }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={`relative ${small ? "mt-8" : "mt-16"} text-center`}
    >
      <div className="relative inline-flex items-center justify-center mb-4">
        <div className="absolute w-16 h-16 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <Code className="w-10 h-10 text-primary relative z-10" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
    </motion.div>
  );
};

export default CodeBackground;
