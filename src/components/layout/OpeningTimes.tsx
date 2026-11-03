import { BUSINESS_HOURS, HOURS_CONFIRMED, SITE_CONFIG } from "@/constants";

/**
 * Opening times. Until the real weekly hours are confirmed (HOURS_CONFIRMED in
 * constants), this shows only what Truffles has actually announced (the lunch
 * and hi-tea windows) and points guests to call, instead of showing sample hours.
 */
export function OpeningTimes({ className }: { className?: string }) {
  if (HOURS_CONFIRMED) {
    return (
      <ul className={className ?? "space-y-2.5 text-xs text-zinc-400 font-light"}>
        {BUSINESS_HOURS.map((s) => (
          <li key={s.day} className="flex justify-between items-center py-0.5 border-b border-white/[0.04]">
            <span>{s.day}</span>
            <span className="text-zinc-200 font-mono">{s.isClosed ? "Closed" : `${s.open} – ${s.close}`}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className ?? "space-y-2.5 text-xs text-zinc-400 font-light"}>
      <ul className="space-y-2.5">
        <li className="flex justify-between gap-4 border-b border-white/[0.04] py-0.5">
          <span>Lunch offer · 20% off</span>
          <span className="font-mono text-zinc-200">12:00 – 3:30 PM</span>
        </li>
        <li className="flex justify-between gap-4 border-b border-white/[0.04] py-0.5">
          <span>Hi-Tea (from 1st Feb)</span>
          <span className="font-mono text-zinc-200">3:00 – 6:00 PM</span>
        </li>
      </ul>
      <p className="pt-1">
        For today&apos;s opening times, call{" "}
        <a href={`tel:${SITE_CONFIG.phones[0].tel}`} className="text-gold hover:underline">
          {SITE_CONFIG.phones[0].display}
        </a>{" "}
        or message us on WhatsApp.
      </p>
    </div>
  );
}
