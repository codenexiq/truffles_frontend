"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient floating gold embers rendered on a canvas behind the hero.
 * Continuous, lightweight motion — visible without any scrolling.
 */
export function HeroParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      a: number;
      tw: number;
    };
    let parts: P[] = [];

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const count = Math.min(Math.round((w * h) / 22000), 90);
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.28 + 0.05),
        vx: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.12,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += 0.02;
        if (p.y < -6) {
          p.y = h + 6;
          p.x = Math.random() * w;
        }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 207, 154, ${alpha.toFixed(3)})`;
        ctx.shadowColor = "rgba(212, 168, 106, 0.7)";
        ctx.shadowBlur = 7;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    size();
    seed();
    draw();

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        size();
        seed();
      }, 180);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else draw();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.clearTimeout(rt);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
