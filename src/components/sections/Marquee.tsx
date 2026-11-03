const ITEMS = [
  "Rooftop Dining",
  "Hi-Tea 3 – 6 PM",
  "Lunch · 20% Off",
  "Birthdays",
  "Anniversaries",
  "Proposals",
  "Bridal Showers",
  "Corporate Events",
  "Nikkah & Engagements",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-gold/15 bg-band py-5">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10 bg-gradient-to-r from-band to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10 bg-gradient-to-l from-band to-transparent" />

      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-serif text-xl sm:text-2xl italic text-zinc-400"
          >
            {item}
            <span className="text-gold text-sm not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
