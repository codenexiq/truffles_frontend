"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check, Info } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { VideoPlayer } from "./VideoPlayer";
import type { Block } from "@/data/blogPosts";

const EASE = [0.16, 1, 0.3, 1] as const;

// Cards inside an article are fixed-colour white cards (like the cards on the other pages) so they stay white
// in both light and dark mode.
const WHITE_CARD = "rounded-[1.8rem] bg-[#ffffff] text-[#18181b] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.5)] ring-1 ring-black/5";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const itemIn: Variants = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};
const cardIn: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } } as const;

/** Renders a post's content blocks, each one animating in as it scrolls into view. */
export function PostBody({ blocks, title }: { blocks: Block[]; title: string }) {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <Reveal key={i}>
                <p className="text-base font-light leading-[1.85] text-zinc-300 sm:text-lg">{b.text}</p>
              </Reveal>
            );

          case "h2":
            return (
              <Reveal key={i}>
                <h2 className="relative inline-block pt-4 font-serif text-2xl text-zinc-100 sm:text-3xl">
                  {b.text}
                  {/* gold rule that draws itself under the heading */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 1, delay: 0.25, ease: EASE }}
                    className="mt-2 block h-px w-full origin-left bg-gradient-to-r from-gold to-transparent"
                  />
                </h2>
              </Reveal>
            );

          case "list":
            return (
              <motion.div key={i} {...inView} variants={cardIn} className={`${WHITE_CARD} p-6 sm:p-7`}>
                {b.title && <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a6a1c]">{b.title}</p>}
                <motion.ul variants={stagger} className="space-y-2.5">
                  {b.items.map((item) => (
                    <motion.li key={item} variants={itemIn} className="flex items-start gap-3 text-sm text-[#3f3f46] sm:text-base">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e5c378] to-[#c99a2e] text-[#1a1305]">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );

          case "quote":
            return (
              <Reveal key={i}>
                <blockquote className="relative border-l-2 border-gold pl-6">
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute -left-[2px] top-0 h-full w-[2px] origin-top bg-[#f3e5ab]"
                  />
                  <p className="font-serif text-xl italic leading-relaxed text-zinc-200 sm:text-2xl">&ldquo;{b.text}&rdquo;</p>
                  {b.cite && <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-gold">{b.cite}</footer>}
                </blockquote>
              </Reveal>
            );

          case "note":
            return (
              <motion.div
                key={i}
                {...inView}
                variants={cardIn}
                className="flex gap-3 rounded-[1.6rem] border border-[#eadfb5] bg-[#fbf7e9] p-5 text-[#3f3f46] shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]"
              >
                <motion.span
                  animate={reduce ? undefined : { rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3 }}
                  className="mt-0.5 flex shrink-0"
                >
                  <Info className="h-5 w-5 text-[#8a6a1c]" />
                </motion.span>
                <p className="text-sm leading-relaxed sm:text-base">
                  {b.label && <strong className="mr-2 font-semibold text-[#6f5416]">{b.label}:</strong>}
                  {b.text}
                </p>
              </motion.div>
            );

          case "pairing":
            return (
              <motion.div key={i} {...inView} variants={stagger} className="grid gap-4 sm:grid-cols-2">
                {b.items.map((p) => (
                  <motion.div
                    key={p.drink}
                    variants={cardIn}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className={`${WHITE_CARD} p-5`}
                  >
                    <p className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1a1305]">
                      Pairing
                    </p>
                    <p className="mt-3 font-sans text-xl font-semibold text-[#18181b]">{p.drink}</p>
                    <p className="text-sm text-[#8a6a1c]">with {p.with.toLowerCase()}</p>
                    <p className="mt-2 text-sm font-light leading-relaxed text-[#52525b]">{p.why}</p>
                  </motion.div>
                ))}
              </motion.div>
            );

          case "gallery":
            return (
              <motion.div key={i} {...inView} variants={stagger} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {b.images.map((img) => (
                  <motion.div
                    key={img.src}
                    variants={cardIn}
                    whileHover={{ y: -6, rotate: 1.5 }}
                    className="group relative aspect-square overflow-hidden rounded-[1.4rem] bg-black shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] ring-4 ring-white"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </motion.div>
                ))}
              </motion.div>
            );

          case "image":
            return (
              <motion.figure key={i} {...inView} variants={cardIn} className="m-0">
                <div className={`${WHITE_CARD} p-2.5`}>
                  <motion.div
                    initial={{ clipPath: "inset(0 0 100% 0 round 1.4rem)" }}
                    whileInView={{ clipPath: "inset(0 0 0% 0 round 1.4rem)" }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 1.1, ease: EASE }}
                    className="relative aspect-[16/10] overflow-hidden bg-black"
                  >
                    <motion.div
                      initial={{ scale: 1.3 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 1.5, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <Image src={b.src} alt={b.alt} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                    </motion.div>
                  </motion.div>
                </div>
                {b.caption && <figcaption className="mt-3 text-center text-xs text-zinc-500">{b.caption}</figcaption>}
              </motion.figure>
            );

          case "video":
            return (
              <Reveal key={i} variant="scale">
                <figure className="m-0">
                  <VideoPlayer video={b.video} title={b.caption ?? title} />
                  {b.caption && <figcaption className="mt-3 text-center text-xs text-zinc-500">{b.caption}</figcaption>}
                </figure>
              </Reveal>
            );

          case "cta":
            return (
              <motion.div
                key={i}
                {...inView}
                variants={cardIn}
                className="theme-dark flex flex-col items-start justify-between gap-5 rounded-[1.8rem] border border-gold/30 bg-gradient-to-br from-surface to-band p-6 sm:flex-row sm:items-center sm:p-8"
              >
                <p className="font-serif text-xl text-white sm:text-2xl">{b.text}</p>
                <Link
                  href={b.href}
                  className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-sm bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a0a0c] transition hover:brightness-110"
                >
                  {!reduce && (
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      initial={{ left: "-30%" }}
                      animate={{ left: ["-30%", "130%"] }}
                      transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.6 }}
                    />
                  )}
                  <span className="relative">{b.label}</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
        }
      })}
    </div>
  );
}
