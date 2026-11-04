"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { GuestReview } from "@/data/testimonials";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TestimonialCardProps {
  testimonial: GuestReview;
  /** Position in its row: alternates the tilt the card arrives with. */
  index?: number;
}

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.3, rotate: -40 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 340, damping: 15 } },
};

/**
 * A guest review as a white rounded card (the same look as the cards on the Events, Menu and Blog pages).
 * When it scrolls into view the card tilts in, the stars pop on one by one, and the quote and guest rise up.
 * Card colours are fixed hex values so the card stays white whatever the page background is.
 */
export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  const reduce = useReducedMotion();
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.article
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: { opacity: 0, y: 70, rotate: index % 2 ? 4 : -4, scale: 0.93, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.9, ease: EASE, delay: (index % 3) * 0.12, when: "beforeChildren", staggerChildren: 0.09 },
        },
      }}
      whileHover={reduce ? undefined : { y: -10, rotate: index % 2 ? -0.6 : 0.6 }}
      className="group relative flex h-full flex-col rounded-[2rem] bg-[#ffffff] p-6 text-[#18181b] shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-7"
    >
      {/* big quotation mark that settles in behind the text */}
      <motion.span
        aria-hidden="true"
        variants={{ hidden: { opacity: 0, scale: 0.4, rotate: -20 }, show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.9, ease: EASE } } }}
        className="pointer-events-none absolute right-6 top-6 text-[#d4af37]/25 transition-colors group-hover:text-[#d4af37]/45"
      >
        <Quote className="h-12 w-12" />
      </motion.span>

      {/* who said it */}
      <motion.div variants={rise} className="flex items-center gap-3.5">
        <motion.span
          variants={pop}
          whileHover={reduce ? undefined : { rotate: 360, scale: 1.08 }}
          transition={{ duration: 0.7 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] font-serif text-base text-[#f3e5ab]"
        >
          {initials}
        </motion.span>
        <div className="min-w-0">
          <h4 className="truncate font-sans text-[1.1rem] font-semibold leading-tight text-[#18181b]">{testimonial.name}</h4>
          {testimonial.source && testimonial.source !== "guest" ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-[#8a6a1c]">
              <span className="rounded-full border border-[#d4af37]/60 px-1.5 py-px">{testimonial.source}</span>
              {testimonial.handle &&
                (testimonial.link ? (
                  <a
                    href={testimonial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate normal-case tracking-normal underline-offset-2 hover:underline"
                  >
                    {testimonial.handle}
                  </a>
                ) : (
                  <span className="truncate normal-case tracking-normal">{testimonial.handle}</span>
                ))}
            </p>
          ) : (
            <p className="mt-0.5 text-[13px] text-[#71717a]">Guest at Truffles</p>
          )}
        </div>
      </motion.div>

      {/* stars: pop on one after another */}
      <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="mt-5 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span key={i} variants={pop} className="flex">
            <Star className={`h-4 w-4 ${i < testimonial.rating ? "fill-[#d4af37] text-[#d4af37]" : "text-[#d4d4d8]"}`} />
          </motion.span>
        ))}
      </motion.div>

      <motion.p variants={rise} className="mt-4 flex-1 font-serif text-[1.02rem] font-normal italic leading-relaxed text-[#3f3f46]">
        &ldquo;{testimonial.comment}&rdquo;
      </motion.p>

      <motion.div variants={rise} className="mt-6 flex items-center justify-between gap-3 border-t border-[#ececee] pt-4">
        <span className="rounded-full border border-[#eadfb5] bg-[#fbf7e9] px-3 py-1 text-[12px] font-medium text-[#6f5416]">
          {testimonial.occasion}
        </span>
        <span className="text-[12px] uppercase tracking-[0.18em] text-[#a1a1aa]">F-10 Rooftop</span>
      </motion.div>
    </motion.article>
  );
}
