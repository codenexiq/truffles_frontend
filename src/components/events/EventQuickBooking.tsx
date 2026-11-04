"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/constants";
import { whatsappLink } from "@/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

// White rounded cards (the same look as the cards on the other pages), in fixed colours so they stay white
// whatever the page background is.
const CARD =
  "relative rounded-[2rem] bg-[#ffffff] p-6 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-7";

const cardIn = (i: number): Variants => ({
  hidden: { opacity: 0, x: 70, rotate: i % 2 ? -3 : 3, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE, delay: i * 0.14, when: "beforeChildren", staggerChildren: 0.09 },
  },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 17 } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } } as const;

/** The two cards beside the event enquiry form: quick booking by phone / WhatsApp, and where to find us. */
export function EventQuickBooking() {
  const reduce = useReducedMotion();
  const hoverLift = reduce ? undefined : { y: -6 };

  return (
    <div className="space-y-5">
      <motion.div {...inView} variants={cardIn(0)} whileHover={hoverLift} className={CARD}>
        <motion.p
          variants={pop}
          className="inline-block rounded-full bg-gradient-to-r from-[#e5c378] to-[#c99a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1305]"
        >
          Quick booking
        </motion.p>
        <motion.h3 variants={rise} className="mt-3 font-sans text-[1.6rem] font-semibold leading-tight text-[#18181b]">
          Call or WhatsApp
        </motion.h3>
        <motion.p variants={rise} className="mt-2 text-[0.95rem] font-light leading-relaxed text-[#71717a]">
          The fastest way to check a date and talk through your plans.
        </motion.p>

        <div className="mt-5 space-y-2.5">
          <motion.a
            variants={rise}
            href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles! I would like to book an event.")}
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
            <span className="relative">WhatsApp {SITE_CONFIG.phones[0].display}</span>
          </motion.a>

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
        </div>
      </motion.div>

      <motion.div {...inView} variants={cardIn(1)} whileHover={hoverLift} className={`${CARD} flex items-center gap-4`}>
        <motion.span
          variants={pop}
          animate={reduce ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
        >
          <MapPin className="h-5 w-5" />
        </motion.span>
        <motion.div variants={rise}>
          <p className="font-sans text-[1.2rem] font-semibold leading-tight text-[#18181b]">{SITE_CONFIG.address.venue}</p>
          <p className="mt-0.5 text-[0.95rem] text-[#71717a]">
            {SITE_CONFIG.address.area}, {SITE_CONFIG.address.city}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
