"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FOOD_SLIDES } from "@/data/foodCarousel";

// A rotating 3D ring of dishes: every card faces outward, the ring turns to bring the next one to the front.
const IDS = ["pasta", "risotto", "steak", "pizza", "platters", "cake", "panna", "cooler"];
const SLIDES = IDS.map((id) => FOOD_SLIDES.find((s) => s.id === id)).filter(
  (s): s is (typeof FOOD_SLIDES)[number] => Boolean(s),
);
const N = SLIDES.length;
const STEP = 360 / N;
const AUTOPLAY_MS = 3400;

export function HeroCarousel3D() {
  const reduce = useReducedMotion();
  // `turn` grows without limit so the ring always spins the short way round.
  const [turn, setTurn] = useState(0);
  const [paused, setPaused] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxW, setBoxW] = useState(520);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setTurn((n) => n + 1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  // Pointer tilt: the whole ring leans toward the cursor.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 80, damping: 18 });
  const tiltX = useSpring(useTransform(py, [-1, 1], [14, 4]), { stiffness: 80, damping: 18 });

  const go = useCallback((d: number) => setTurn((n) => n + d), []);

  const cardW = Math.max(150, Math.min(230, boxW * 0.42));
  const cardH = cardW * 1.32;
  const radius = (cardW / 2) / Math.tan(Math.PI / N) + 14; // small gap between neighbours
  const front = ((turn % N) + N) % N;
  const current = SLIDES[front];

  return (
    <div
      className="relative mx-auto w-full max-w-[560px] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        px.set(0);
        py.set(0);
      }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Signature dishes"
    >
      {/* Glow under the ring */}
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-40 w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.35),transparent_70%)] blur-2xl" />

      <motion.div
        ref={boxRef}
        className="relative touch-pan-y"
        style={{ height: cardH + 60, perspective: 1300 }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -40) go(1);
          else if (info.offset.x > 40) go(-1);
        }}
      >
        {/* Tilt layer */}
        <motion.div
          className="absolute left-1/2 top-6"
          style={{
            width: cardW,
            height: cardH,
            marginLeft: -cardW / 2,
            transformStyle: "preserve-3d",
            rotateX: reduce ? 0 : tiltX,
            rotateY: reduce ? 0 : tiltY,
          }}
        >
          {/* The ring itself: pushed back so the front card sits on the screen plane */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ rotateY: -turn * STEP, z: -radius }}
            transition={{ type: "spring", stiffness: 55, damping: 15, mass: 1.1 }}
          >
            {SLIDES.map((slide, i) => {
              const d = Math.min((i - front + N) % N, (front - i + N) % N); // 0 = front
              return (
                <motion.button
                  key={slide.id}
                  type="button"
                  onClick={() => setTurn((n) => n + (((i - front + N + N / 2) % N) - N / 2))}
                  aria-label={`Show ${slide.title}`}
                  aria-current={d === 0}
                  className="absolute inset-0 cursor-pointer overflow-hidden rounded-[1.6rem] border border-gold/40 bg-black p-0 outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{
                    transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`,
                    backfaceVisibility: "hidden",
                    boxShadow: "0 30px 60px -25px rgba(0,0,0,0.9)",
                  }}
                  initial={false}
                  animate={{ opacity: d === 0 ? 1 : d === 1 ? 0.75 : 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="240px"
                    priority={i === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" />
                  {/* Glass reflection that sweeps over the front card */}
                  {d === 0 && !reduce && (
                    <motion.span
                      key={`shine-${turn}`}
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                      initial={{ x: "0%" }}
                      animate={{ x: "380%" }}
                      transition={{ duration: 1.1, delay: 0.45, ease: "easeOut" }}
                    />
                  )}
                  <span className="absolute bottom-3 left-3 right-3 truncate text-left font-serif text-lg text-white">
                    {slide.title}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Caption + controls */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous dish"
          className="cursor-pointer rounded-full border border-gold/40 bg-black/30 p-2.5 text-gold backdrop-blur-md transition-colors hover:bg-gold/15"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="min-w-[170px] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-light">
                {current.category}
              </span>
              <p className="font-serif text-xl text-white">{current.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next dish"
          className="cursor-pointer rounded-full border border-gold/40 bg-black/30 p-2.5 text-gold backdrop-blur-md transition-colors hover:bg-gold/15"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
