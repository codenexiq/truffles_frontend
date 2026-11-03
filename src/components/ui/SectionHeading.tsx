"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils";
import { SplitText } from "@/components/motion/SplitText";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.6 } } as const;

  return (
    <div className={cn(centered && "text-center", "mb-16", className)}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-gold/30 bg-gold/5 text-gold text-[11px] uppercase tracking-[0.25em] font-medium"
        >
          <motion.span
            className="text-xs inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
          <span>{badge}</span>
          <motion.span
            className="text-xs inline-block"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            ✦
          </motion.span>
        </motion.div>
      )}

      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-wide text-zinc-100">
        <SplitText text={title} inView stagger={0.06} />
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
          className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-400 mx-auto leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Divider draws itself outward from the diamond */}
      <motion.div
        {...inView}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } }}
        className={cn(
          "mt-6 flex items-center gap-3",
          centered ? "justify-center" : "justify-start"
        )}
      >
        <motion.div
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
          style={{ originX: 1 }}
          className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]/60"
        />
        <motion.div
          variants={{ hidden: { scale: 0, rotate: 0 }, show: { scale: 1, rotate: 45, transition: { type: "spring", stiffness: 300, damping: 14 } } }}
          className="w-1.5 h-1.5 bg-[#d4af37]"
        />
        <motion.div
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
          style={{ originX: 0 }}
          className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]/60"
        />
      </motion.div>
    </div>
  );
}
