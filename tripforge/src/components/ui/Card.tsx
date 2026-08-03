import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, rotate: -0.3 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`rounded-2xl border border-[var(--color-spruce-500)]/30 bg-[var(--color-moss-700)]/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
