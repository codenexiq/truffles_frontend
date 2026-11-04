"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Utensils } from "lucide-react";
import { cn } from "@/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardIn = (x: number): Variants => ({
  hidden: { opacity: 0, x, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE, when: "beforeChildren", staggerChildren: 0.1 },
  },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.55 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 17 } },
};
const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 1.75rem)" },
  show: { clipPath: "inset(0 0 0% 0 round 1.75rem)", transition: { duration: 1.1, ease: EASE } },
};
const zoomOut: Variants = {
  hidden: { scale: 1.35 },
  show: { scale: 1, transition: { duration: 1.6, ease: EASE } },
};

interface WideCardProps {
  image: string;
  alt: string;
  pill: string;
  title: string;
  paragraphs: string[];
  facts?: string[];
  buttonLabel: string;
  href: string;
  /** Photo on the right instead of the left. */
  reverse?: boolean;
}

/** Wide white card in the same style as the Events cards: rounded photo, bold title, light text, dark button. */
export function WideCard({ image, alt, pill, title, paragraphs, facts, buttonLabel, href, reverse }: WideCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={cardIn(reverse ? 90 : -90)}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group grid gap-6 rounded-[2rem] bg-[#ffffff] p-3.5 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 md:grid-cols-2 md:p-4"
    >
      <motion.div
        variants={wipe}
        className={cn("relative aspect-[5/4] overflow-hidden bg-black md:aspect-auto md:min-h-[360px]", reverse && "md:order-2")}
      >
        <motion.div variants={zoomOut} className="absolute inset-0">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 520px"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
        </motion.div>
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[130%] group-hover:opacity-100" />
      </motion.div>

      <div className="flex flex-col px-2 py-2 md:px-4 md:py-5">
        <motion.span
          variants={pop}
          className="self-start rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1305]"
        >
          {pill}
        </motion.span>
        <motion.h3 variants={rise} className="mt-4 font-sans text-2xl font-semibold leading-snug text-[#18181b] sm:text-[1.9rem]">
          {title}
        </motion.h3>
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            variants={rise}
            className={cn("mt-3 text-[15px] leading-relaxed", i === 0 ? "text-[#52525b]" : "text-[#71717a]")}
          >
            {p}
          </motion.p>
        ))}

        {facts && (
          <motion.ul variants={rise} className="mt-4 flex flex-wrap gap-2">
            {facts.map((f) => (
              <li key={f} className="rounded-full border border-[#e4e4e7] bg-[#f6f6f7] px-3 py-1 text-[13px] text-[#3f3f46]">
                {f}
              </li>
            ))}
          </motion.ul>
        )}

        <motion.div variants={rise} className="mt-auto flex items-center gap-3 pt-6">
          <motion.span
            variants={pop}
            whileHover={{ rotate: 360, scale: 1.1 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
          >
            <Utensils className="h-4 w-4" aria-hidden="true" />
          </motion.span>
          <Link
            href={href}
            className="relative flex h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#18181b] px-5 text-[1.02rem] font-medium text-[#ffffff] outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[#d4af37]"
          >
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ left: "-30%" }}
                animate={{ left: ["-30%", "130%"] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
              />
            )}
            <span className="relative">{buttonLabel}</span>
            <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}
