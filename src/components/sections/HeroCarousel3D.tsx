"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FOOD_SLIDES } from "@/data/foodCarousel";

/**
 * 3D ring of dishes, ported from the cupcake carousel: a requestAnimationFrame loop drives a spring,
 * so nothing re-renders per frame. Drag / swipe, click a side dish, arrow keys, buttons and dots all work.
 */
const IDS = ["pasta", "risotto", "steak", "pizza", "cake", "cooler"];
const SLIDES = IDS.map((id) => FOOD_SLIDES.find((s) => s.id === id)).filter(
  (s): s is (typeof FOOD_SLIDES)[number] => Boolean(s),
);
const N = SLIDES.length;
const AUTOPLAY_MS = 4200;
const mod = (a: number) => ((a % N) + N) % N;

interface Metrics {
  W: number;
  H: number;
  cardH: number;
  Rx: number;
  Ry: number;
}
interface DragState {
  pointerId: number;
  startX: number;
  startPos: number;
  moved: boolean;
  itemIndex: number | null;
  samples: { x: number; t: number }[];
}

export function HeroCarousel3D() {
  const [active, setActive] = useState(0);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const target = useRef(0);
  const pos = useRef(0);
  const vel = useRef(0);
  const activeRef = useRef(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const drag = useRef<DragState | null>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const metrics = useRef<Metrics>({ W: 600, H: 480, cardH: 300, Rx: 200, Ry: 50 });

  const setTarget = useCallback((t: number) => {
    target.current = t;
    const next = mod(Math.round(t));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  }, []);
  const step = useCallback((d: number) => setTarget(Math.round(target.current) + d), [setTarget]);
  const goTo = useCallback(
    (index: number) => {
      let delta = index - mod(Math.round(target.current));
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      setTarget(Math.round(target.current) + delta);
    },
    [setTarget],
  );

  // ---------- measure + animation loop ----------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pos.current = reduce ? target.current : target.current - 0.9; // gentle spin-in on load
    vel.current = 0;

    const measure = () => {
      const r = stage.getBoundingClientRect();
      const W = r.width;
      const H = r.height;
      const cardH = Math.min(H * 0.76, W * 0.68);
      const cardW = cardH * 0.8;
      SLIDES.forEach((_, i) => {
        const el = itemRefs.current[i];
        if (!el) return;
        el.style.width = `${cardW}px`;
        el.style.height = `${cardH}px`;
        el.style.marginLeft = `${-cardW / 2}px`;
        el.style.marginTop = `${-cardH / 2}px`;
      });
      metrics.current = {
        W,
        H,
        cardH,
        Rx: Math.max(W * 0.2, Math.min(W * 0.36, W / 2 - (cardW * 0.8) / 2 - 8)),
        Ry: H * 0.08,
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);

    const t0 = performance.now();
    let last = t0;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = (now - t0) / 1000;
      const { H, cardH, Rx, Ry } = metrics.current;

      if (!dragging.current) {
        if (reduce) {
          pos.current = target.current;
          vel.current = 0;
        } else {
          const k = 70;
          const c = 2 * Math.sqrt(k) * 0.92;
          vel.current += (k * (target.current - pos.current) - c * vel.current) * dt;
          pos.current += vel.current * dt;
        }
      }

      const intro = reduce ? 1 : Math.min(1, time / 1.1);
      const introE = 1 - Math.pow(1 - intro, 3);
      const mx = pointer.current.x;
      const my = pointer.current.y;

      for (let i = 0; i < N; i++) {
        const item = itemRefs.current[i];
        const body = bodyRefs.current[i];
        const shadow = shadowRefs.current[i];
        if (!item || !body || !shadow) continue;

        let d = (((i - pos.current) % N) + N) % N;
        if (d > N / 2) d -= N;
        const phi = d * ((Math.PI * 2) / N);
        const zc = Math.cos(phi);
        const depth = (zc + 1) / 2; // 1 at the front, 0 at the back
        const front = Math.max(0, 1 - Math.abs(d));

        const x = Math.sin(phi) * Rx;
        const y = H * 0.02 - (1 - zc) * Ry;
        const s = (0.56 + 0.44 * depth) * (0.9 + 0.1 * introE);
        const float = reduce ? 0 : Math.sin(time * 1.5 + i * 1.7) * (3 + 5 * front) * (cardH / 320);
        const rotY = Math.sin(phi) * 32 + mx * 11 * front;
        const rotX = -my * 6 * front;
        const rotZ = reduce ? 0 : Math.sin(time * 0.9 + i) * 1.2 * (0.4 + 0.6 * front);

        item.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${s.toFixed(4)})`;
        item.style.zIndex = String(Math.round(zc * 100) + 100);
        item.style.opacity = ((0.4 + 0.6 * Math.pow(depth, 0.6)) * introE).toFixed(3);
        item.style.filter =
          depth > 0.985 ? "none" : `blur(${((1 - depth) * 2.2).toFixed(2)}px) brightness(${(0.6 + 0.4 * depth).toFixed(3)})`;
        body.style.transform = `translateY(${float.toFixed(2)}px) perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;

        const lift = -float;
        shadow.style.transform = `translateX(-50%) scaleX(${(1 - Math.max(-0.1, Math.min(0.2, lift * 0.01))).toFixed(3)})`;
        shadow.style.opacity = (0.95 - Math.max(-0.1, Math.min(0.3, lift * 0.02))).toFixed(3);
      }

      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.07;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.07;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // ---------- autoplay (pauses while the pointer is over the carousel) ----------
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (hovering.current || dragging.current || document.hidden) return;
      step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [step]);

  // ---------- pointer: drag, tap, parallax ----------
  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button > 0) return;
    const itemEl = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startPos: pos.current,
      moved: false,
      itemIndex: itemEl ? Number(itemEl.dataset.index) : null,
      samples: [{ x: e.clientX, t: performance.now() }],
    };
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.current.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      dragging.current = true;
      try {
        e.currentTarget.setPointerCapture(d.pointerId);
      } catch {
        /* capture can be refused; dragging still works */
      }
    }
    if (d.moved) {
      pos.current = d.startPos - dx / metrics.current.Rx;
      d.samples.push({ x: e.clientX, t: performance.now() });
      if (d.samples.length > 6) d.samples.shift();
    }
  };
  const onPointerEnd = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    if (d.moved) {
      dragging.current = false;
      const a = d.samples[0];
      const b = d.samples[d.samples.length - 1];
      const dt = Math.max(16, b.t - a.t) / 1000;
      const v = Math.max(-6, Math.min(6, -((b.x - a.x) / dt) / metrics.current.Rx));
      vel.current = v * 0.3;
      setTarget(Math.round(pos.current + v * 0.16));
    } else if (d.itemIndex !== null && e.type === "pointerup") {
      goTo(d.itemIndex);
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      step(-1);
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      step(1);
      e.preventDefault();
    }
  };

  const current = SLIDES[active];

  return (
    <div className="relative mx-auto w-full max-w-[620px]" role="region" aria-roledescription="carousel" aria-label="Signature dishes">
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="Signature dishes. Use the arrow keys to turn the ring."
        className="relative h-[350px] cursor-grab touch-pan-y select-none rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing sm:h-[400px]"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerEnter={() => (hovering.current = true)}
        onPointerLeave={() => {
          hovering.current = false;
          pointer.current.tx = 0;
          pointer.current.ty = 0;
        }}
      >
        {/* Breathing glow behind the ring */}
        <div className="animate-breathe pointer-events-none absolute left-1/2 top-[48%] aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.32),rgba(212,175,55,0.1)_55%,transparent)] blur-xl" />

        <div className="absolute inset-0">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-index={i}
              className="absolute left-1/2 top-1/2 will-change-[transform,opacity]"
              style={{ opacity: 0 }}
            >
              {/* Contact shadow on the "floor" */}
              <div
                ref={(el) => {
                  shadowRefs.current[i] = el;
                }}
                className="absolute -bottom-[7%] left-1/2 h-[9%] w-[78%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(0,0,0,0.65),transparent)] blur-[5px]"
              />
              <div
                ref={(el) => {
                  bodyRefs.current[i] = el;
                }}
                className="absolute inset-0 origin-[50%_85%] overflow-hidden rounded-[1.6rem] border border-gold/45 bg-black shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)] will-change-transform"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="260px"
                  priority={i === 0}
                  draggable={false}
                  className="pointer-events-none select-none object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" />
                <span className="pointer-events-none absolute bottom-3 left-3 right-3 truncate font-serif text-lg text-white">
                  {slide.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption + controls */}
      <div className="mt-3 flex flex-col items-center gap-3">
        <div className="min-h-[56px] text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-light">{current.category}</span>
              <p className="font-serif text-2xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">{current.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous dish"
            className="cursor-pointer rounded-full border border-gold/40 bg-black/30 p-2.5 text-gold backdrop-blur-md transition-colors hover:bg-gold/15"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show ${s.title}`}
                aria-current={i === active}
                className="cursor-pointer p-1"
              >
                <motion.span
                  animate={{ width: i === active ? 24 : 7, opacity: i === active ? 1 : 0.45 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="block h-[7px] rounded-full bg-gold"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next dish"
            className="cursor-pointer rounded-full border border-gold/40 bg-black/30 p-2.5 text-gold backdrop-blur-md transition-colors hover:bg-gold/15"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
