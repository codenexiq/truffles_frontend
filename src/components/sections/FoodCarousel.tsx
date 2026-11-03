"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FOOD_SLIDES } from "@/data/foodCarousel";

const N = FOOD_SLIDES.length;
const AUTOPLAY_MS = 3200;

/** Shortest signed distance from the active slide, wrapping around the ends. */
function offsetFrom(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export function FoodCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageW, setStageW] = useState(1000);

  // Card size follows the stage width, so it fits phones and desktops.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setStageW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % N), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused]);

  const cardW = Math.min(340, stageW * 0.68);
  const cardH = cardW * 1.25;
  const step = cardW * 0.72;
  const go = (d: number) => setActive((a) => (a + d + N) % N);
  const current = FOOD_SLIDES[active];

  return (
    <section
      className="relative overflow-hidden bg-band py-24 sm:py-28"
      aria-roledescription="carousel"
      aria-label="Food gallery"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)]" />

      <Container className="relative z-10">
        <SectionHeading
          badge="FROM OUR KITCHEN"
          title="A Taste of Truffles"
          subtitle="Fresh plates, sweet endings and everything in between."
        />

        <Reveal variant="up">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Stage */}
            <motion.div
              ref={stageRef}
              className="relative mx-auto touch-pan-y select-none"
              style={{ height: cardH + 24, perspective: 1400 }}
              onPanEnd={(_, info) => {
                if (info.offset.x < -50) go(1);
                else if (info.offset.x > 50) go(-1);
              }}
            >
              {FOOD_SLIDES.map((slide, i) => {
                const o = offsetFrom(i, active);
                const abs = Math.abs(o);
                const visible = abs <= 2;
                return (
                  <motion.button
                    key={slide.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show ${slide.title}`}
                    aria-hidden={!visible}
                    tabIndex={visible ? 0 : -1}
                    initial={false}
                    animate={{
                      x: o * step,
                      scale: 1 - abs * 0.14,
                      rotateY: o * -9,
                      opacity: visible ? 1 - abs * 0.28 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                    style={{
                      width: cardW,
                      height: cardH,
                      left: `calc(50% - ${cardW / 2}px)`,
                      zIndex: 10 - abs,
                      pointerEvents: visible ? "auto" : "none",
                    }}
                    className="theme-dark absolute top-3 cursor-pointer overflow-hidden rounded-2xl border border-gold/30 bg-black shadow-[0_25px_60px_-20px_rgba(0,0,0,0.85)] outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="340px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {/* Dim the side cards so the centre one reads as focused */}
                    <motion.div
                      className="absolute inset-0 bg-black"
                      initial={false}
                      animate={{ opacity: abs === 0 ? 0 : 0.35 + abs * 0.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.button>
                );
              })}
            </motion.div>

            {/* Caption */}
            <div className="mt-8 flex min-h-[76px] flex-col items-center text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
                    {current.category}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                    {current.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous dish"
                className="rounded-full border border-gold/40 p-2.5 text-gold transition-colors hover:bg-gold/10 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {FOOD_SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to ${s.title}`}
                    aria-current={i === active}
                    className="cursor-pointer p-1"
                  >
                    <motion.span
                      animate={{ width: i === active ? 22 : 6, opacity: i === active ? 1 : 0.4 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="block h-1.5 rounded-full bg-gold"
                    />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next dish"
                className="rounded-full border border-gold/40 p-2.5 text-gold transition-colors hover:bg-gold/10 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
