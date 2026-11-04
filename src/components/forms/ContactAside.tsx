"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { BUSINESS_HOURS, HOURS_CONFIRMED, SITE_CONFIG } from "@/constants";
import { whatsappLink } from "@/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

// White rounded cards (the same look as the cards on the Events, Menu and Reservations pages), in fixed colours so
// they stay white whatever the page background is.
const CARD =
  "relative rounded-[2rem] bg-[#ffffff] p-6 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-7";

/** Each card flies in from the right with a little tilt; its contents then follow one after another. */
const cardIn = (i: number): Variants => ({
  hidden: { opacity: 0, x: 70, rotate: i % 2 ? -3 : 3, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, delay: i * 0.12, when: "beforeChildren", staggerChildren: 0.09 },
  },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -40 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 320, damping: 16 } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } } as const;

/** Round dark badge with a gold icon, as used on the other pages' cards. */
function Badge({ children, float }: { children: React.ReactNode; float?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      variants={pop}
      animate={float && !reduce ? { y: [0, -4, 0] } : undefined}
      transition={float ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      whileHover={reduce ? undefined : { rotate: 360, scale: 1.1 }}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
    >
      {children}
    </motion.span>
  );
}

/** The cards beside the contact form: where we are, how to reach us, and when we are open. */
export function ContactAside() {
  const reduce = useReducedMotion();
  const hoverLift = reduce ? undefined : { y: -6 };

  return (
    <div className="space-y-5">
      {/* Find us */}
      <motion.div {...inView} variants={cardIn(0)} whileHover={hoverLift} className={CARD}>
        <div className="flex items-center gap-3.5">
          <Badge float>
            <MapPin className="h-5 w-5" />
          </Badge>
          <motion.h2 variants={rise} className="font-sans text-[1.5rem] font-semibold text-[#18181b]">
            Find us
          </motion.h2>
        </div>
        <motion.p variants={rise} className="mt-4 text-[0.98rem] leading-relaxed text-[#3f3f46]">
          {SITE_CONFIG.address.venue}
          <br />
          {SITE_CONFIG.address.area}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.country}
        </motion.p>
        <motion.p variants={rise} className="mt-2 inline-block rounded-full border border-[#eadfb5] bg-[#fbf7e9] px-3 py-1 text-[12px] font-medium text-[#6f5416]">
          Overlooking Islamabad
        </motion.p>
      </motion.div>

      {/* Call or WhatsApp */}
      <motion.div {...inView} variants={cardIn(1)} whileHover={hoverLift} className={CARD}>
        <div className="flex items-center gap-3.5">
          <Badge>
            <Phone className="h-5 w-5" />
          </Badge>
          <motion.h2 variants={rise} className="font-sans text-[1.5rem] font-semibold text-[#18181b]">
            Call or WhatsApp
          </motion.h2>
        </div>

        <div className="mt-5 space-y-2.5">
          {SITE_CONFIG.phones.map((p) => (
            <motion.a
              key={p.tel}
              variants={rise}
              href={`tel:${p.tel}`}
              whileHover={reduce ? undefined : { x: 6 }}
              className="group flex items-center gap-3.5 rounded-full border border-[#e4e4e7] bg-[#fafafa] py-2 pl-2 pr-5 transition-colors hover:border-[#d4af37] hover:bg-[#fbf7e9]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37] transition-transform duration-500 group-hover:rotate-[360deg]">
                <Phone className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[0.98rem] text-[#18181b]">{p.display}</span>
                <span className="block text-[11px] uppercase tracking-[0.15em] text-[#8a6a1c]">Tap to call</span>
              </span>
            </motion.a>
          ))}

          {SITE_CONFIG.email && (
            <motion.a
              variants={rise}
              href={`mailto:${SITE_CONFIG.email}`}
              whileHover={reduce ? undefined : { x: 6 }}
              className="flex items-center gap-3.5 rounded-full border border-[#e4e4e7] bg-[#fafafa] py-2 pl-2 pr-5 transition-colors hover:border-[#d4af37] hover:bg-[#fbf7e9]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]">
                <Mail className="h-4 w-4" />
              </span>
              <span className="truncate text-[0.98rem] text-[#18181b]">{SITE_CONFIG.email}</span>
            </motion.a>
          )}

          <motion.a
            variants={rise}
            href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles!")}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduce ? undefined : { scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-5 text-[0.98rem] font-semibold text-[#0a0a0c] shadow-[0_12px_26px_-12px_rgba(170,119,28,0.85)]"
          >
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ left: "-30%" }}
                animate={{ left: ["-30%", "130%"] }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.8 }}
              />
            )}
            <MessageCircle className="relative h-4 w-4" />
            <span className="relative">Message on WhatsApp</span>
          </motion.a>
        </div>
      </motion.div>

      {/* Opening times */}
      <motion.div {...inView} variants={cardIn(2)} whileHover={hoverLift} className={CARD}>
        <div className="flex items-center gap-3.5">
          <Badge>
            <motion.span
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="flex"
            >
              <Clock className="h-5 w-5" />
            </motion.span>
          </Badge>
          <motion.h2 variants={rise} className="font-sans text-[1.5rem] font-semibold text-[#18181b]">
            Opening times
          </motion.h2>
        </div>

        {/* Until the real weekly hours are confirmed this shows only what Truffles has announced (lunch and hi-tea). */}
        <ul className="mt-5 space-y-1">
          {(HOURS_CONFIRMED
            ? BUSINESS_HOURS.map((s) => ({ label: s.day, value: s.isClosed ? "Closed" : `${s.open} – ${s.close}` }))
            : [
                { label: "Lunch offer · 20% off", value: "12:00 – 3:30 PM" },
                { label: "Hi-Tea (from 1st Feb)", value: "3:00 – 6:00 PM" },
              ]
          ).map((r) => (
            <motion.li
              key={r.label}
              variants={rise}
              className="flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-[0.95rem] odd:bg-[#fafafa]"
            >
              <span className="text-[#52525b]">{r.label}</span>
              <span className="font-mono font-medium text-[#18181b]">{r.value}</span>
            </motion.li>
          ))}
        </ul>
        {!HOURS_CONFIRMED && (
          <motion.p variants={rise} className="mt-3 px-1 text-[0.9rem] leading-relaxed text-[#71717a]">
            For today&apos;s opening times, call{" "}
            <a href={`tel:${SITE_CONFIG.phones[0].tel}`} className="font-medium text-[#8a6a1c] hover:underline">
              {SITE_CONFIG.phones[0].display}
            </a>{" "}
            or message us on WhatsApp.
          </motion.p>
        )}
      </motion.div>

      {/* Where to go next */}
      <motion.div
        {...inView}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }}
        className="flex flex-wrap gap-3"
      >
        {[
          { href: "/reservations", label: "Want a table? Reserve online" },
          { href: "/events#enquire", label: "Planning an event? Start here" },
        ].map((l) => (
          <motion.div key={l.href} variants={pop} whileHover={reduce ? undefined : { y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-2 rounded-full bg-[#ffffff] px-5 py-3 text-[14px] font-medium text-[#18181b] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
            >
              {l.label}
              <ArrowUpRight className="h-4 w-4 text-[#8a6a1c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
