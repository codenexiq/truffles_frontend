"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, MapPin, Tag } from "lucide-react";
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
  const [liked, setLiked] = useState<Record<string, boolean>>({});
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

  const cardW = Math.min(320, stageW * 0.72);
  const cardH = cardW * 1.42 + 20;
  const step = cardW * 0.9;
  const go = (d: number) => setActive((a) => (a + d + N) % N);

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
                  <motion.div
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={slide.title}
                    aria-hidden={!visible}
                    onClick={() => abs !== 0 && setActive(i)}
                    initial={false}
                    animate={{
                      x: o * step,
                      scale: 1 - abs * 0.14,
                      rotateY: o * -9,
                      opacity: visible ? 1 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 140, damping: 20 }}
                    style={{
                      width: cardW,
                      height: cardH,
                      left: `calc(50% - ${cardW / 2}px)`,
                      zIndex: 10 - abs,
                      pointerEvents: visible ? "auto" : "none",
                    }}
                    className={`absolute top-3 flex flex-col overflow-hidden rounded-[2rem] bg-[#ffffff] p-3.5 text-[#18181b] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] ${
                      abs === 0 ? "" : "cursor-pointer"
                    }`}
                  >
                    {/* Photo with soft, generously rounded corners */}
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.6rem]">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                    </div>

                    <div className="px-1.5 pt-4">
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-[#0b0b0d]">
                        {slide.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-[#71717a]">Signature dish</p>

                      <div className="mt-3 flex items-center gap-5 text-sm text-[#27272a]">
                        <span className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#b8902f]" aria-hidden="true" />
                          {slide.category}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#b8902f]" aria-hidden="true" />
                          F-10
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2.5 pb-1">
                        <Link
                          href="/reservations"
                          tabIndex={abs === 0 ? 0 : -1}
                          className="flex-1 rounded-full bg-[#18181b] py-3 text-center text-sm font-medium text-[#ffffff] transition-colors hover:bg-black focus-visible:ring-2 focus-visible:ring-gold outline-none"
                        >
                          Reserve a Table
                        </Link>
                        <motion.button
                          type="button"
                          tabIndex={abs === 0 ? 0 : -1}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => setLiked((l) => ({ ...l, [slide.id]: !l[slide.id] }))}
                          aria-label={liked[slide.id] ? `Unsave ${slide.title}` : `Save ${slide.title}`}
                          aria-pressed={!!liked[slide.id]}
                          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#e4e4e7] text-orange-400 outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          <Heart
                            className="h-5 w-5"
                            fill={liked[slide.id] ? "currentColor" : "none"}
                            aria-hidden="true"
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Dim the side cards so the centre one reads as focused */}
                    <motion.div
                      className="pointer-events-none absolute inset-0 bg-black"
                      initial={false}
                      animate={{ opacity: abs === 0 ? 0 : 0.28 + abs * 0.1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-5">
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
