"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Two soft gold glows that drift slowly behind a section. Place inside a `relative overflow-hidden` parent. */
export function FloatingGlows() {
  const reduce = useReducedMotion();
  return (
    <>
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
        animate={reduce ? undefined : { y: [0, 60, 0], x: [0, 30, 0] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-24 top-2/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        animate={reduce ? undefined : { y: [0, -70, 0], x: [0, -30, 0] }}
        transition={{ duration: 17, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />
    </>
  );
}
