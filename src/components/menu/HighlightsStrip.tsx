"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { DishCard } from "./DishCard";
import { HIGHLIGHTS } from "@/data/menuItems";

const GAP = 20; // px between cards
const SPEED = 42; // px per second: a slow, steady drift

/**
 * The bestsellers row: a continuous, endless scroll. The cards drift left at a constant speed and the row is
 * repeated, so when the last card leaves the first one is already right behind it (there is never a jump back).
 * It stops while the mouse is over it, and can be dragged with a finger or the mouse.
 */
export function HighlightsStrip() {
  const reduce = useReducedMotion();
  const viewRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track || reduce) return;

    let x = 0; // how far the row has travelled
    let cardW = 320;
    let hovering = false;
    let visible = false;
    let drag: { startClientX: number; startX: number; moved: boolean } | null = null;
    const N = HIGHLIGHTS.length;

    const measure = () => {
      const cs = getComputedStyle(view);
      const inner = view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // Four across on desktop (exactly filling the page width), a fixed card width on smaller screens.
      cardW = window.innerWidth >= 1024 ? (inner - 3 * GAP) / 4 : window.innerWidth >= 640 ? 320 : Math.min(320, window.innerWidth * 0.78);
      view.style.setProperty("--card-w", `${cardW}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(view);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.05 });
    io.observe(view);

    const wrap = (v: number) => {
      const period = (cardW + GAP) * N;
      return ((v % period) + period) % period;
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      if (!hovering && !drag && !document.hidden) x = wrap(x + SPEED * dt);
      track.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
    };
    raf = requestAnimationFrame(frame);

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };
    const onFocusIn = () => {
      hovering = true;
    };
    const onFocusOut = () => {
      hovering = false;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      drag = { startClientX: e.clientX, startX: x, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.startClientX;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        try {
          view.setPointerCapture(e.pointerId);
        } catch {
          /* capture can be refused; dragging still works */
        }
      }
      if (drag.moved) x = wrap(drag.startX - dx);
    };
    const onUp = () => {
      // keep the "moved" flag for a moment so the click that ends a drag does not open a card
      const d = drag;
      drag = null;
      if (d?.moved) {
        view.dataset.dragged = "1";
        window.setTimeout(() => delete view.dataset.dragged, 60);
      }
    };
    const onClickCapture = (e: MouseEvent) => {
      if (view.dataset.dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    view.addEventListener("pointerenter", onEnter);
    view.addEventListener("pointerleave", onLeave);
    view.addEventListener("focusin", onFocusIn);
    view.addEventListener("focusout", onFocusOut);
    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    view.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      view.removeEventListener("pointerenter", onEnter);
      view.removeEventListener("pointerleave", onLeave);
      view.removeEventListener("focusin", onFocusIn);
      view.removeEventListener("focusout", onFocusOut);
      view.removeEventListener("pointerdown", onDown);
      view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", onUp);
      view.removeEventListener("pointercancel", onUp);
      view.removeEventListener("click", onClickCapture, true);
    };
  }, [reduce]);

  // Reduced motion: a plain row the visitor scrolls by hand.
  if (reduce) {
    return (
      <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-10 pt-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {HIGHLIGHTS.map((d, i) => (
          <div key={d.id} className="w-[78vw] shrink-0 sm:w-[320px] lg:w-[calc((100%-60px)/4)]">
            <DishCard dish={d} large index={i} />
          </div>
        ))}
      </div>
    );
  }

  return (
    // The viewport is a little wider than the page container and fades out at its edges, so shadows are never cut
    // off with a straight line and cards slide in and out softly.
    <div
      ref={viewRef}
      className="-mx-4 -mb-12 cursor-grab touch-pan-y select-none overflow-hidden px-4 pb-16 pt-3 [-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_14px,black_44px,black_calc(100%-44px),transparent_calc(100%-14px)),linear-gradient(to_bottom,black_calc(100%-44px),transparent)] active:cursor-grabbing sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <div ref={trackRef} className="flex w-max will-change-transform" style={{ gap: GAP }}>
        {/* two copies of the row: the second one is what slides in behind the first, so the loop has no seam */}
        {[0, 1].map((copy) =>
          HIGHLIGHTS.map((d, i) => (
            <div
              key={`${copy}-${d.id}`}
              className="shrink-0"
              style={{ width: "var(--card-w, 320px)" }}
              aria-hidden={copy === 1 || undefined}
              inert={copy === 1}
            >
              <DishCard dish={d} large index={i} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
