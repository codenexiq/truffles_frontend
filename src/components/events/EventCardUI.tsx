"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** The card flies up with a slight tilt, then its parts follow one after another. */
export const eventCardVariants = (i: number): Variants => ({
  hidden: { opacity: 0, y: 70, rotate: i % 2 ? 4 : -4, scale: 0.92, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, when: "beforeChildren", staggerChildren: 0.08 },
  },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 1.75rem)" },
  show: { clipPath: "inset(0 0 0% 0 round 1.75rem)", transition: { duration: 1, ease: EASE } },
};
const popBadge: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: -8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 18, delay: 0.5 } },
};
const zoomOut: Variants = {
  hidden: { scale: 1.35 },
  show: { scale: 1, transition: { duration: 1.5, ease: EASE } },
};

interface Info {
  icon: ReactNode;
  text: string;
}

export interface CardBadge {
  label: string;
  icon?: ReactNode;
  tone: "gold" | "dark" | "green" | "red" | "sky";
}

const BADGE_TONE: Record<CardBadge["tone"], string> = {
  gold: "border-[#d4af37] bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] text-[#0a0a0c]",
  dark: "border-[#d4af37]/60 bg-black/65 text-[#f3e5ab]",
  green: "border-emerald-400/50 bg-black/65 text-emerald-300",
  red: "border-red-400/50 bg-black/65 text-red-300",
  sky: "border-sky-300/50 bg-black/65 text-sky-200",
};

interface EventCardUIProps {
  index: number;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  infoA: Info;
  infoB: Info;
  /** Optional small list shown between the subtitle and the info row. */
  bullets?: string[];
  buttonLabel: string;
  onClick: () => void;
  /** Small chips shown on the photo (top left). */
  badges?: CardBadge[];
  /** Keep long subtitles to three lines so a row of cards stays even. */
  clamp?: boolean;
  /** Slightly smaller type and tighter fact row, for narrow cards (four across). */
  compact?: boolean;
}

/**
 * White rounded card in the style of the supplied reference: a big rounded photo, the title, a lighter subtitle,
 * two icon facts, then a dark action button next to a round heart. Card colours are fixed hex values so the card
 * stays white in both light and dark mode.
 */
export function EventCardUI({ index, image, alt, title, subtitle, infoA, infoB, bullets, buttonLabel, onClick, badges, clamp, compact }: EventCardUIProps) {
  const reduce = useReducedMotion();
  const [liked, setLiked] = useState(false);

  return (
    <motion.article
      variants={eventCardVariants(index)}
      whileHover={reduce ? undefined : { y: -10, rotate: index % 2 ? -0.6 : 0.6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group flex h-full flex-col rounded-[2rem] bg-[#ffffff] p-3.5 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5"
    >
      <motion.div variants={wipe} className="relative aspect-[5/4] overflow-hidden bg-black">
        <motion.div variants={zoomOut} className="absolute inset-0">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
        </motion.div>
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[130%] group-hover:opacity-100" />
        {badges && badges.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <motion.span
                key={b.label}
                variants={popBadge}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm",
                  BADGE_TONE[b.tone]
                )}
              >
                {b.icon}
                {b.label}
              </motion.span>
            ))}
          </div>
        )}
      </motion.div>

      <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
        <motion.h3 variants={rise} className={cn("font-sans font-semibold leading-tight text-[#18181b]", compact ? "text-[1.3rem]" : "text-[1.6rem]")}>
          {title}
        </motion.h3>
        <motion.p variants={rise} className={cn("mt-1 font-sans font-light leading-snug text-[#52525b]", compact ? "text-[0.95rem]" : "text-[1.05rem]", clamp && "line-clamp-3")}>
          {subtitle}
        </motion.p>

        {bullets && (
          <motion.ul variants={rise} className="mt-3 space-y-1">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-[#71717a]">
                <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af37]" />
                {b}
              </li>
            ))}
          </motion.ul>
        )}

        <motion.div variants={rise} className={cn("mt-4 flex flex-wrap items-center gap-y-2 text-[#18181b]", compact ? "gap-x-4 text-[0.92rem]" : "gap-x-6 text-[1.02rem]")}>
          <span className={cn("flex items-center", compact ? "gap-2" : "gap-2.5")}>
            <span className="text-[#8a6a1c]" aria-hidden="true">{infoA.icon}</span>
            {infoA.text}
          </span>
          <span className={cn("flex items-center", compact ? "gap-2" : "gap-2.5")}>
            <span className="text-[#8a6a1c]" aria-hidden="true">{infoB.icon}</span>
            {infoB.text}
          </span>
        </motion.div>

        <motion.div variants={rise} className="mt-auto flex items-center gap-3 pt-5">
          <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="relative h-12 flex-1 cursor-pointer overflow-hidden rounded-full bg-[#18181b] px-4 text-[1.02rem] font-medium text-[#ffffff] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
          >
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ left: "-30%" }}
                animate={{ left: ["-30%", "130%"] }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 + (index % 4) * 0.6 }}
              />
            )}
            <span className="relative">{buttonLabel}</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setLiked((v) => !v)}
            whileTap={{ scale: 0.82 }}
            aria-label={liked ? `Unsave ${title}` : `Save ${title}`}
            aria-pressed={liked}
            className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#ececee] text-[#f2755a] outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
          >
            <motion.span animate={liked && !reduce ? { scale: [1, 1.45, 1] } : { scale: 1 }} transition={{ duration: 0.45 }} className="flex">
              <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
            </motion.span>
            {/* little burst of hearts when saved */}
            <AnimatePresence>
              {liked &&
                !reduce &&
                [0, 1, 2, 3, 4, 5].map((k) => (
                  <motion.span
                    key={k}
                    aria-hidden="true"
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
                    animate={{
                      opacity: 0,
                      x: Math.cos((k / 6) * Math.PI * 2) * 30,
                      y: Math.sin((k / 6) * Math.PI * 2) * 30,
                      scale: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={cn("pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-[#f2755a]")}
                  />
                ))}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>
    </motion.article>
  );
}
