"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PROMOTIONS } from "@/data/promotions";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Seconds each slide stays on screen (also drives the progress bar). */
const SLIDE_SECONDS = 6;

const imageVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 80, scale: 1.08 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -80, transition: { duration: 0.5, ease: EASE } }),
};

const copyVariants: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const line: Variants = {
  enter: { opacity: 0, y: 26 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

export function PromoBanner() {
  const [[index, direction], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = PROMOTIONS.length;
  const promo = PROMOTIONS[index];

  const go = useCallback(
    (dir: number) =>
      setPage(([i]) => [(i + dir + count) % count, dir]),
    [count]
  );
  const jump = (target: number) =>
    setPage(([i]) => [target, target >= i ? 1 : -1]);

  return (
    <section
      className="relative bg-page py-20 sm:py-24 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Current offers and promotions"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[820px] max-w-[95vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.09)_0%,_transparent_70%)]" />

      <Container className="relative z-10">
        <SectionHeading
          badge="NOW AT TRUFFLES"
          title="Offers & Celebrations"
          subtitle="Hi-tea, lunch deals, festive menus and styled dining packages. Take a look at what's on."
          className="!mb-10"
        />

        <Reveal variant="scale">
          <div
            className="theme-dark relative overflow-hidden rounded-3xl border border-gold/30 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Slide stage */}
            <motion.div
              className="relative h-[560px] sm:h-[460px] touch-pan-y"
              onPanEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={promo.id}
                  className="absolute inset-0"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}: ${promo.label}`}
                >
                  {/* Photo */}
                  <motion.div
                    className="absolute inset-0"
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <Image
                      src={promo.image}
                      alt=""
                      fill
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/70 to-black/25" />
                  </motion.div>

                  {/* Copy */}
                  <motion.div
                    variants={copyVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative z-10 flex h-full max-w-2xl flex-col justify-end sm:justify-center gap-4 px-7 pb-24 pt-10 sm:px-14 sm:pb-16"
                  >
                    <motion.span
                      variants={line}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/50 bg-black/40 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.25em] text-gold-light backdrop-blur-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-gold" />
                      {promo.label}
                    </motion.span>

                    <motion.p
                      variants={line}
                      className="font-serif text-5xl sm:text-7xl font-medium leading-none text-gold-gradient"
                    >
                      {promo.highlight}
                    </motion.p>

                    <motion.h3
                      variants={line}
                      className="font-serif text-2xl sm:text-3xl font-normal text-white"
                    >
                      {promo.title}
                    </motion.h3>

                    <motion.p
                      variants={line}
                      className="max-w-lg text-sm sm:text-base font-light leading-relaxed text-zinc-300"
                    >
                      {promo.description}
                    </motion.p>

                    <motion.ul variants={line} className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs sm:text-sm text-gold-light">
                      {promo.details.map((d) => (
                        <li key={d} className="flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-gold" />
                          {d}
                        </li>
                      ))}
                    </motion.ul>

                    <motion.div variants={line} className="mt-2 flex flex-wrap items-center gap-3">
                      <Link
                        href={`/offers#${promo.id}`}
                        className="group inline-flex items-center gap-2 rounded-sm bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a0a0c] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:brightness-110"
                      >
                        View Offer
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href={`/reservations?offer=${promo.id}`}
                        className="inline-flex items-center rounded-sm border border-white/25 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-light"
                      >
                        Reserve a Table
                      </Link>
                      {promo.soon && (
                        <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                          Details coming soon
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous offer"
                className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:block cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next offer"
                className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-2.5 text-white backdrop-blur-sm transition-colors hover:border-gold hover:text-gold sm:block cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Dots */}
            <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2">
              {PROMOTIONS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => jump(i)}
                  aria-label={`Show offer ${i + 1}: ${p.label}`}
                  aria-current={i === index}
                  className="cursor-pointer p-1.5"
                >
                  <motion.span
                    animate={{ width: i === index ? 28 : 8, opacity: i === index ? 1 : 0.45 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    className="block h-2 rounded-full bg-gold"
                  />
                </button>
              ))}
            </div>

            {/* Progress bar. Its CSS animation ending advances the slide, so
                hovering (which pauses it) also pauses the rotation. */}
            <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/10">
              <span
                key={promo.id}
                onAnimationEnd={() => go(1)}
                className="block h-full origin-left bg-gradient-to-r from-[#aa771c] to-[#f3e5ab]"
                style={{
                  animation: `promoProgress ${SLIDE_SECONDS}s linear forwards`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
