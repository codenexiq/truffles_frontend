"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Direction / style of entrance. */
  variant?: "up" | "left" | "right" | "scale";
  /** Delay in ms before the element animates in. */
  delay?: number;
  /** Animate only once (default) or every time it enters view. */
  once?: boolean;
}

const HIDDEN = {
  up: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -48 },
  right: { opacity: 0, x: 48 },
  scale: { opacity: 0, scale: 0.92 },
} as const;

/** Scroll-triggered entrance, powered by Framer Motion's `whileInView`. */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={HIDDEN[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, amount: 0.15, margin: "0px 0px -6% 0px" }}
      transition={{
        duration: 0.9,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
