"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
  /** Thousands separators (default). Turn off for years. */
  grouping?: boolean;
}

const GROUPED = new Intl.NumberFormat("en-US");
const PLAIN = new Intl.NumberFormat("en-US", { useGrouping: false });

/** Counts up from 0 to `to` the first time it scrolls into view. */
export function Counter({ to, prefix = "", suffix = "", duration = 1.8, className, grouping = true }: CounterProps) {
  const fmt = grouping ? GROUPED : PLAIN;
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = `${prefix}${fmt.format(Math.round(v))}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration, fmt]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {fmt.format(0)}
      {suffix}
    </span>
  );
}
