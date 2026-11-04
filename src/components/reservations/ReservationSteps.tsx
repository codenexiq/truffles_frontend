"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarCheck, CheckCheck, Send } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { icon: Send, title: "Send your request", text: "Choose your date, time and party size." },
  { icon: CheckCheck, title: "We confirm", text: "Our team confirms your table with you." },
  { icon: CalendarCheck, title: "Enjoy the evening", text: "Arrive and enjoy the view over Islamabad." },
] as const;

const cardIn = (i: number): Variants => ({
  hidden: { opacity: 0, y: 60, rotate: i % 2 ? 3 : -3, scale: 0.93, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE, delay: i * 0.16, when: "beforeChildren", staggerChildren: 0.08 },
  },
});
const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.4, rotate: -40 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 320, damping: 15 } },
};

/** "How it works": three white cards in a row, with a gold line that draws itself between them. */
export function ReservationSteps() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mb-12">
      {/* the line that links the steps (desktop only) */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.6, delay: 0.4, ease: EASE }}
        className="absolute left-[16%] right-[16%] top-1/2 hidden h-px origin-left bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/70 to-[#d4af37]/0 sm:block"
      />
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardIn(i)}
            whileHover={reduce ? undefined : { y: -8 }}
            className="relative flex items-start gap-4 rounded-[1.8rem] bg-[#ffffff] p-5 text-[#18181b] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
          >
            <motion.span
              variants={pop}
              whileHover={reduce ? undefined : { rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.7 }}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
            >
              <Icon className="h-5 w-5" />
            </motion.span>
            <div>
              <motion.p variants={rise} className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8a6a1c]">
                Step {i + 1}
              </motion.p>
              <motion.p variants={rise} className="mt-0.5 font-sans text-[1.15rem] font-semibold leading-snug text-[#18181b]">
                {title}
              </motion.p>
              <motion.p variants={rise} className="mt-1 text-[0.9rem] font-light leading-snug text-[#71717a]">
                {text}
              </motion.p>
            </div>
            {/* big faint step number */}
            <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 font-serif text-5xl text-[#d4af37]/15">
              {i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
