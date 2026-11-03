"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ScrollProgress } from "./ScrollProgress";

/**
 * Site-wide Framer Motion setup.
 * `reducedMotion="user"` honours the OS "reduce motion" setting for transform
 * animations (opacity/colour still animate). Change to "never" to force full
 * motion for everyone.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      {children}
    </MotionConfig>
  );
}
