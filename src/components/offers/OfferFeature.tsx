"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Info,
  MessageCircle,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/motion/Counter";
import { LiveCountdown } from "./LiveCountdown";
import { GUEST_REVIEWS } from "@/data/testimonials";
import { cn } from "@/utils";
import type { Promotion } from "@/data/promotions";

interface OfferFeatureProps {
  promo: Promotion;
  index: number;
}

/** Splits "Rs. 1,995" into a prefix and a number so the price can count up. */
function parsePrice(highlight: string) {
  const m = highlight.match(/^(Rs\.?\s*)([\d,]+)$/i);
  return m ? { prefix: m[1], value: Number(m[2].replace(/,/g, "")) } : null;
}

export function OfferFeature({ promo, index }: OfferFeatureProps) {
  const reverse = index % 2 === 1;
  const price = parsePrice(promo.highlight);
  // The plan asks for customer reviews on the hi-tea offer.
  const review = promo.id === "hi-tea" ? GUEST_REVIEWS[2] : null;

  const reserveHref = `/reservations?offer=${promo.id}`;
  const enquireHref = `/contact?offer=${promo.id}`;

  return (
    <article id={promo.id} className="scroll-mt-32">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Photo */}
        <Reveal
          variant={reverse ? "right" : "left"}
          className={cn(reverse && "lg:order-2")}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="theme-dark group relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/30 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]"
          >
            <Image
              src={promo.image}
              alt={`${promo.label}: ${promo.title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <span
              className={cn(
                "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] backdrop-blur-sm",
                promo.soon
                  ? "border-white/25 bg-black/50 text-zinc-200"
                  : promo.badge
                    ? "border-gold/50 bg-black/50 text-gold-light"
                    : "border-emerald-400/50 bg-black/50 text-emerald-300"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  promo.soon ? "bg-zinc-300" : promo.badge ? "bg-gold" : "bg-emerald-400"
                )}
              />
              {promo.soon ? "Coming soon" : (promo.badge ?? "Available")}
            </span>

            <span className="absolute bottom-4 left-4 rounded-full bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] px-4 py-2 font-serif text-lg font-semibold text-[#0a0a0c] shadow-[0_8px_24px_rgba(212,175,55,0.4)]">
              {promo.highlight}
            </span>
          </motion.div>
        </Reveal>

        {/* Details */}
        <Reveal variant={reverse ? "left" : "right"} delay={120}>
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-gold">
              <Sparkles className="h-3 w-3" />
              {promo.label}
            </span>

            <p className="font-serif text-5xl font-medium leading-none text-gold-gradient sm:text-6xl">
              {price ? <Counter to={price.value} prefix={price.prefix} /> : promo.highlight}
            </p>

            <h3 className="font-serif text-2xl font-normal text-zinc-100 sm:text-3xl">
              {promo.title}
            </h3>

            <p className="max-w-xl text-sm font-light leading-relaxed text-zinc-400 sm:text-base">
              {promo.description}
            </p>

            <ul className="space-y-2">
              {promo.details.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-zinc-200">
                  <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
                  {d}
                </li>
              ))}
            </ul>

            {promo.liveWindow && (
              <LiveCountdown from={promo.liveWindow.from} to={promo.liveWindow.to} />
            )}

            {promo.includes && (
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-gold">
                  What&apos;s included
                </p>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {promo.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {promo.note && (
              <p className="flex items-start gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3.5 py-2.5 text-xs text-zinc-300">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                {promo.note}
              </p>
            )}

            {promo.gallery && (
              <div className="grid grid-cols-4 gap-2.5">
                {promo.gallery.map((src, i) => (
                  <motion.div
                    key={src}
                    whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="relative aspect-square overflow-hidden rounded-xl border border-gold/25"
                  >
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  </motion.div>
                ))}
              </div>
            )}

            {review && (
              <figure className="luxury-card relative rounded-xl p-5">
                <Quote className="absolute right-4 top-4 h-6 w-6 text-gold opacity-20" />
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#d4af37] text-gold" />
                  ))}
                </div>
                <blockquote className="font-serif text-sm font-light italic leading-relaxed text-zinc-200">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-xs text-zinc-400">
                  {review.name} · {review.occasion}
                </figcaption>
              </figure>
            )}

            {/* Calls to action: reservation or enquiry, carrying the offer along */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {promo.soon ? (
                <>
                  <Link href={enquireHref}>
                    <Button variant="primary" size="md" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Ask About This Offer
                    </Button>
                  </Link>
                  <Link href={reserveHref}>
                    <Button variant="outline" size="md">
                      Reserve a Table
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={reserveHref}>
                    <Button variant="primary" size="md" className="flex items-center gap-2">
                      <CalendarCheck className="h-4 w-4" />
                      Reserve This Offer
                    </Button>
                  </Link>
                  <Link href={enquireHref}>
                    <Button variant="outline" size="md" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Enquire
                    </Button>
                  </Link>
                  {promo.addon && (
                    <Link
                      href={`${reserveHref}&addon=${promo.addon.param}`}
                      className="text-xs uppercase tracking-[0.18em] text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline"
                    >
                      {promo.addon.label}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
