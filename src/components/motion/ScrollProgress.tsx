"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold bar across the top that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-[#aa771c] via-[#f3e5ab] to-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.6)]"
    />
  );
}
