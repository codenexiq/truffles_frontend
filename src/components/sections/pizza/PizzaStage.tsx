"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./PizzaStage.module.css";

// The four dish photos supplied with the "Gericht" hero (transparent PNGs, kept in /public/images/wheel).
const DISHES = [
  {
    name: "Spring rolls & dipping sauces",
    src: "/images/wheel/dish-1.webp",
    tilt: 3.9,
    badge: -135,
    eyebrow: "Fresh & crisp",
    line1: "Spring Rolls",
    line2: "& Dipping Sauces",
    lead: "Crisp fried rolls and fresh rice-paper rolls on a bamboo basket, with lettuce, herbs and two dipping sauces.",
  },
  {
    name: "Grilled chicken, citrus & greens",
    src: "/images/wheel/dish-2.webp",
    tilt: -2.5,
    badge: -45,
    eyebrow: "Grilled to order",
    line1: "Grilled Chicken",
    line2: "Citrus & Greens",
    lead: "A grilled chicken breast with cherry tomatoes, carved carrot, lime and fresh herbs.",
  },
  {
    name: "Spicy tofu in a black bowl",
    src: "/images/wheel/dish-3.webp",
    tilt: 3,
    badge: -40,
    eyebrow: "Bold & spicy",
    line1: "Spicy Tofu",
    line2: "In A Black Bowl",
    lead: "Golden tofu tossed in a chilli sauce with peppers, crushed peanuts and fresh herbs.",
  },
  {
    name: "Fried egg & basil rice",
    src: "/images/wheel/dish-4.webp",
    tilt: -3,
    badge: -22,
    eyebrow: "Comfort plate",
    line1: "Basil Rice",
    line2: "& Fried Egg",
    lead: "Minced meat stir-fried with chilli and basil, topped with a crisp fried egg and served with cucumber.",
  },
] as const;
const N = DISHES.length;

interface Layout {
  W: number;
  cx: number;
  cy: number;
  R: number;
  thf: number;
  D: number;
  ringR: number;
  badge: number;
  badgeFont: number;
  dist: number;
}
const LAYOUTS: { desk: Layout; phone: Layout } = {
  desk: { W: 1920, cx: 2084, cy: 1136, R: 1017, thf: -135, D: 625, ringR: 1063, badge: 163, badgeFont: 48, dist: 0.46 },
  phone: { W: 390, cx: 195, cy: 585, R: 372, thf: -90, D: 270, ringR: 440, badge: 74, badgeFont: 22, dist: 0.46 },
};

/** Time between automatic turns of the wheel. */
const AUTOPLAY_MS = 7000; // time between automatic turns (3 seconds shorter than before; a turn itself takes 3.4 s)
const TURN_S = 3.4; // how long one turn of the wheel takes
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t); // sine ease: the softest start and stop, no sudden middle

const mod = (a: number) => ((a % N) + N) % N;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function PizzaStage() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dishRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(0);
  const [textIdx, setTextIdx] = useState(0); // the copy on screen; follows `active` after the old copy has left
  const [leaving, setLeaving] = useState(false);
  const [inView, setInView] = useState(false);

  const activeRef = useRef(-1);
  const target = useRef(0);
  const reduceRef = useRef(false);
  const lastTouchRef = useRef(0);

  const setActiveIndex = useCallback((a: number) => {
    if (a === activeRef.current) return;
    const first = activeRef.current === -1;
    activeRef.current = a;
    setActive(a);
    const cap = captionRef.current;
    if (cap && !first && !reduceRef.current) {
      cap.classList.remove(styles.swap);
      void cap.offsetWidth; // restart the CSS animation
      cap.classList.add(styles.swap);
    }
  }, []);

  /** Turn the wheel to dish `i` by the shortest way round. */
  const goTo = useCallback(
    (i: number) => {
      let delta = i - mod(Math.round(target.current));
      if (delta > N / 2) delta -= N;
      if (delta < -N / 2) delta += N;
      target.current = Math.round(target.current) + delta;
      lastTouchRef.current = performance.now();
      setActiveIndex(mod(target.current));
    },
    [setActiveIndex],
  );
  const step = useCallback((d: number) => {
    target.current = Math.round(target.current) + d;
    lastTouchRef.current = performance.now();
    setActiveIndex(mod(target.current));
  }, [setActiveIndex]);

  useEffect(() => {
    const outer = outerRef.current;
    const board = boardRef.current;
    const ringEl = ringRef.current;
    if (!outer || !board || !ringEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reduceRef.current = reduce;
    const mq = window.matchMedia("(max-width: 820px)");

    let L = mq.matches ? LAYOUTS.phone : LAYOUTS.desk;
    let s = 1;
    let sizePx = 0;
    let pos = 0;
    let vel = 0;
    let tweenFrom = 0;
    let tweenTo = 0;
    let tweenStart = 0;
    let prevPos = 0;
    let dragging = false;
    let drag: { id: number; x: number; startPos: number; moved: boolean; item: number | null; samples: { x: number; t: number }[] } | null = null;
    let tmx = 0;
    let tmy = 0;
    let mx = 0;
    let my = 0;
    let visible = false;
    let introStart: number | null = null;
    let hovering = false;

    const layout = () => {
      L = mq.matches ? LAYOUTS.phone : LAYOUTS.desk;
      s = board.clientWidth / L.W;
      sizePx = L.D * s;
      const rr = L.ringR * s;
      ringEl.style.left = `${L.cx * s - rr}px`;
      ringEl.style.top = `${L.cy * s - rr}px`;
      ringEl.style.width = ringEl.style.height = `${rr * 2}px`;
      DISHES.forEach((d, i) => {
        const el = dishRefs.current[i];
        const badge = badgeRefs.current[i];
        if (!el || !badge) return;
        el.style.width = el.style.height = `${sizePx}px`;
        const b = L.badge * s;
        const a = (d.badge * Math.PI) / 180;
        const dist = L.dist * sizePx;
        badge.style.width = badge.style.height = `${b}px`;
        badge.style.fontSize = `${L.badgeFont * s}px`;
        badge.style.left = `${sizePx / 2 + Math.cos(a) * dist - b / 2}px`;
        badge.style.top = `${sizePx / 2 + Math.sin(a) * dist - b / 2}px`;
      });
    };

    // ---------- pointer: drag the wheel, tap a dish, parallax ----------
    const onPointerDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      const t = e.target as HTMLElement;
      if (t.closest("a,button")) {
        drag = null;
        return;
      }
      const it = t.closest<HTMLElement>("[data-dish]");
      drag = { id: e.pointerId, x: e.clientX, startPos: pos, moved: false, item: it ? Number(it.dataset.dish) : null, samples: [{ x: e.clientX, t: performance.now() }] };
    };
    const onPointerMove = (e: PointerEvent) => {
      const r = board.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        dragging = true;
        board.classList.add(styles.dragging);
        try {
          board.setPointerCapture(drag.id);
        } catch {
          /* capture can be refused; dragging still works */
        }
      }
      if (drag.moved) {
        pos = drag.startPos - dx / (sizePx * 0.9);
        drag.samples.push({ x: e.clientX, t: performance.now() });
        if (drag.samples.length > 6) drag.samples.shift();
      }
    };
    const release = (e: PointerEvent) => {
      if (!drag) return;
      const d = drag;
      drag = null;
      board.classList.remove(styles.dragging);
      if (d.moved) {
        dragging = false;
        const a = d.samples[0];
        const b = d.samples[d.samples.length - 1];
        const dt = Math.max(16, b.t - a.t) / 1000;
        const v = clamp(-((b.x - a.x) / dt) / (sizePx * 0.9), -5, 5);
        vel = v * 0.25;
        tweenTo = Number.NaN; // force a fresh tween from the dragged position
        target.current = Math.round(pos + v * 0.18);
        setActiveIndex(mod(target.current));
      } else if (d.item !== null && e.type === "pointerup") {
        goTo(d.item);
      }
      lastTouchRef.current = performance.now();
    };
    const onLeave = () => {
      tmx = 0;
      tmy = 0;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        step(1);
        lastTouchRef.current = performance.now();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        step(-1);
        lastTouchRef.current = performance.now();
      }
    };

    // ---------- animation loop ----------
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (introStart === null) {
        introStart = now;
        pos = reduce ? target.current : target.current - 0.8; // the wheel spins in on arrival
        tweenFrom = pos;
        tweenTo = target.current;
        tweenStart = now + 250;
        prevPos = pos;
      }
      const time = (now - introStart) / 1000;

      if (!dragging) {
        if (reduce) {
          pos = target.current;
          vel = 0;
        } else {
          // A new target starts a new timed turn from wherever the wheel is now.
          if (target.current !== tweenTo) {
            tweenFrom = pos;
            tweenTo = target.current;
            tweenStart = now;
          }
          const dur = TURN_S * 1000 * Math.min(1.5, Math.max(0.6, Math.abs(tweenTo - tweenFrom)));
          const u = clamp((now - tweenStart) / dur, 0, 1);
          pos = tweenFrom + (tweenTo - tweenFrom) * easeInOut(u);
          vel = dt > 0 ? (pos - prevPos) / dt : 0;
        }
      } else {
        setActiveIndex(mod(Math.round(pos)));
      }
      prevPos = pos;
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      const introE = reduce ? 1 : 1 - Math.pow(1 - Math.min(1, time / 1.4), 3);

      ringEl.style.transform = `rotate(${(-pos * 90).toFixed(3)}deg)`;

      for (let i = 0; i < N; i++) {
        const o = dishRefs.current[i];
        const glow = glowRefs.current[i];
        const badge = badgeRefs.current[i];
        if (!o || !glow || !badge) continue;
        let d = (((i - pos) % N) + N) % N;
        if (d > N / 2) d -= N;
        const ad = Math.abs(d);
        const front = Math.max(0, 1 - ad);
        const ang = ((L.thf + d * 90) * Math.PI) / 180;
        let x = (L.cx + Math.cos(ang) * L.R) * s;
        let y = (L.cy + Math.sin(ang) * L.R) * s;
        const fl = reduce ? 0 : Math.sin(time * 1.2 + i * 1.3) * 6 * s * (0.35 + 0.65 * front);
        x += mx * 14 * s * front;
        y += my * 9 * s * front + fl;
        const roll = DISHES[i].tilt + clamp(vel * 7, -14, 14) + (reduce ? 0 : Math.sin(time * 0.8 + i) * 0.8 * front);
        const sc = (0.94 + 0.06 * introE) * (0.97 + 0.03 * front);
        o.style.transform = `translate3d(${(x - sizePx / 2).toFixed(2)}px,${(y - sizePx / 2).toFixed(2)}px,0) rotate(${roll.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
        const fadeT = clamp(1 - ad / 1.15, 0, 1);
        o.style.opacity = (fadeT * fadeT * (3 - 2 * fadeT) * introE).toFixed(3); // smoothstep: gradual in and out
        o.style.zIndex = String(Math.round(front * 10));
        glow.style.opacity = (0.25 + 0.75 * front).toFixed(3);
        badge.style.transform = `scale(${(0.9 + 0.1 * front).toFixed(3)})`;
      }
    };

    layout();
    const onEnter = () => {
      hovering = true;
    };
    const onExit = () => {
      hovering = false;
      lastTouchRef.current = performance.now();
    };
    // Autoplay: turn to the next dish on a timer; rests while the pointer is over the wheel, while dragging,
    // for a few seconds after any manual change, and while the section is off screen.
    const auto = window.setInterval(() => {
      if (reduce || !visible || hovering || dragging || document.hidden) return;
      if (performance.now() - lastTouchRef.current < 3000) return;
      step(1);
    }, AUTOPLAY_MS);
    const ro = new ResizeObserver(layout);
    ro.observe(board);
    mq.addEventListener("change", layout);
    board.addEventListener("pointerenter", onEnter);
    board.addEventListener("pointerleave", onExit);
    board.addEventListener("focusin", onEnter);
    board.addEventListener("focusout", onExit);
    board.addEventListener("pointerdown", onPointerDown);
    board.addEventListener("pointermove", onPointerMove);
    board.addEventListener("pointerup", release);
    board.addEventListener("pointercancel", release);
    board.addEventListener("pointerleave", onLeave);
    board.addEventListener("keydown", onKey);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) setInView(true);
      },
      { threshold: 0.25 },
    );
    io.observe(outer);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", layout);
      window.clearInterval(auto);
      board.removeEventListener("pointerenter", onEnter);
      board.removeEventListener("pointerleave", onExit);
      board.removeEventListener("focusin", onEnter);
      board.removeEventListener("focusout", onExit);
      board.removeEventListener("pointerdown", onPointerDown);
      board.removeEventListener("pointermove", onPointerMove);
      board.removeEventListener("pointerup", release);
      board.removeEventListener("pointercancel", release);
      board.removeEventListener("pointerleave", onLeave);
      board.removeEventListener("keydown", onKey);
    };
  }, [goTo, step, setActiveIndex]);

  // When the dish changes: the old text fades out, then the new text rises in (the .rise animation replays on remount).
  useEffect(() => {
    if (textIdx === active) return;
    if (reduceRef.current) {
      setTextIdx(active);
      return;
    }
    const t1 = window.setTimeout(() => setLeaving(true), 1100);
    const t2 = window.setTimeout(() => {
      setTextIdx(active);
      setLeaving(false);
    }, 1700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [active, textIdx]);

  const current = DISHES[active];
  const copy = DISHES[textIdx];

  return (
    <div ref={outerRef} className={styles.stage}>
      <div className={styles.pin}>
        <div ref={boardRef} className={`${styles.board} ${inView ? styles.in : ""}`} tabIndex={0} aria-label="Signature dishes. The wheel turns by itself; drag or use the arrow keys to turn it yourself.">
          <div ref={ringRef} className={styles.ring} aria-hidden="true">
            <svg viewBox="-1 -1 2 2" preserveAspectRatio="none">
              <circle r=".995" fill="rgba(255,255,255,.012)" stroke="rgba(220,202,135,.16)" strokeWidth=".0016" />
              <circle r=".965" fill="none" stroke="rgba(220,202,135,.38)" strokeWidth=".006" strokeDasharray=".004 .2483" />
            </svg>
          </div>

          {DISHES.map((d, i) => (
            <div
              key={d.src}
              ref={(el) => {
                dishRefs.current[i] = el;
              }}
              className={styles.dish}
              data-dish={i}
            >
              <div
                ref={(el) => {
                  glowRefs.current[i] = el;
                }}
                className={styles.glow}
              />
              <div className={styles.plate}>
                <Image src={d.src} alt={d.name} fill sizes="(max-width: 820px) 270px, 640px" priority={i === 0} draggable={false} />
              </div>
              <div
                ref={(el) => {
                  badgeRefs.current[i] = el;
                }}
                className={styles.badge}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}

          <div className={`${styles.hash} ${styles.fade}`} style={{ ["--d" as string]: "1s" }}>
            <span>#Truffles</span>
            <span>#Rooftop</span>
          </div>

          <div className={`${styles.content} ${leaving && textIdx !== active ? styles.leave : ""}`}>
            <div key={textIdx}>
              <p className={`${styles.eyebrow} ${styles.rise}`} style={{ ["--d" as string]: ".05s" }}>
                {copy.eyebrow}
              </p>
              <div className={`${styles.mark} ${styles.rise}`} style={{ ["--d" as string]: ".12s" }} aria-hidden="true" />
              <h2 className={styles.title}>
                <span className={styles.rise} style={{ ["--d" as string]: ".18s" }}>
                  {copy.line1}
                </span>
                <span className={styles.rise} style={{ ["--d" as string]: ".3s" }}>
                  {copy.line2}
                </span>
              </h2>
              <p className={`${styles.lead} ${styles.rise}`} style={{ ["--d" as string]: ".45s" }}>
                {copy.lead}
              </p>
              <Link className={`${styles.cta} ${styles.rise}`} style={{ ["--d" as string]: ".58s" }} href="/menu">
                Explore Menu
              </Link>
            </div>
          </div>

          <button
            className={`${styles.scroll} ${styles.fade}`}
            type="button"
            style={{ ["--d" as string]: "1.2s" }}
            aria-label="Next dish"
            onClick={() => step(1)}
          >
            <i />
            Scroll
          </button>

          <div ref={captionRef} className={styles.caption}>
            {current.name}
          </div>
          <div className={`${styles.slider} ${styles.fade}`} style={{ ["--d" as string]: "1.1s" }} role="group" aria-label="Dishes">
            {DISHES.map((d, i) => (
              <button
                key={d.src}
                className={styles.num}
                type="button"
                aria-current={i === active}
                aria-label={`Show ${d.name}`}
                onClick={() => goTo(i)}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <div className={styles.sr} aria-live="polite">
            {`${current.name}, ${active + 1} of ${N}`}
          </div>
        </div>
      </div>
    </div>
  );
}
