"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Extra classes for each animated word (e.g. a gradient/shimmer class). */
  wordClassName?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Animate on scroll into view instead of on mount. */
  inView?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const word: Variants = {
  hidden: { y: "115%" },
  show: (delay: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

/**
 * Word-by-word masked rise. Each word slides up from behind a clip line.
 *
 * The in-view trigger lives on the *wrapper* (which never moves), not on the
 * translated word: a word parked below its clip mask is "not visible" to the
 * browser's IntersectionObserver and would never fire.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.07,
  inView = false,
}: SplitTextProps) {
  const words = text.split(" ");
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, amount: 0.5 } }
    : { animate: "show" };

  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true">
          <motion.span
            className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
            initial="hidden"
            {...trigger}
          >
            <motion.span
              className={cn("inline-block", wordClassName)}
              variants={word}
              custom={delay + i * stagger}
            >
              {w}
            </motion.span>
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
