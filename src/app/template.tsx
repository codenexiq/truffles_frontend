"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation, so each page fades and rises in.
 * (A template, unlike a layout, gets a fresh instance per route.)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
