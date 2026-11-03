"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timer } from "lucide-react";

interface LiveCountdownProps {
  /** [hour, minute] in Pakistan time (24h). */
  from: [number, number];
  to: [number, number];
}

const TZ = "Asia/Karachi";

/** Seconds since midnight, in Pakistan time, regardless of the visitor's zone. */
function pktSeconds(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return get("hour") * 3600 + get("minute") * 60 + get("second");
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-12 w-14 overflow-hidden rounded-lg border border-gold/30 bg-black/30">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center font-mono text-2xl font-semibold tabular-nums text-gold-light"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
    </div>
  );
}

/**
 * Daily offer countdown. Inside the window it counts down to the end
 * ("Live now"); outside it counts down to the next start.
 */
export function LiveCountdown({ from, to }: LiveCountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(pktSeconds(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const start = from[0] * 3600 + from[1] * 60;
  const end = to[0] * 3600 + to[1] * 60;

  // Reserve the space before the first client tick so the layout doesn't jump.
  if (now === null) return <div className="h-[104px]" aria-hidden="true" />;

  const live = now >= start && now < end;
  const remaining = live ? end - now : (start - now + 86400) % 86400;
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return (
    <div className="theme-dark rounded-2xl border border-gold/30 bg-gradient-to-br from-surface to-band p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]">
        {live ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-emerald-300">Live now · ends in</span>
          </>
        ) : (
          <>
            <Timer className="h-3.5 w-3.5 text-gold" />
            <span className="text-gold-light">Starts in</span>
          </>
        )}
      </div>
      <div className="flex items-end gap-3" role="timer" aria-live="off">
        <Unit value={h} label="hours" />
        <span className="pb-6 font-mono text-xl text-gold">:</span>
        <Unit value={m} label="min" />
        <span className="pb-6 font-mono text-xl text-gold">:</span>
        <Unit value={s} label="sec" />
      </div>
    </div>
  );
}
