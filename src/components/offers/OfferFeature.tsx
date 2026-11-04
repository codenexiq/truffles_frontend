"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import {
  CalendarCheck,
  CalendarDays,
  Check,
  Info,
  MessageCircle,
  MoreHorizontal,
  Quote,
  Share2,
  Star,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LiveCountdown } from "./LiveCountdown";
import { GUEST_REVIEWS } from "@/data/testimonials";
import { cn } from "@/utils";
import type { Promotion } from "@/data/promotions";

interface OfferFeatureProps {
  promo: Promotion;
  index: number;
}

// Card colours are fixed hex values (not theme tokens) so the card stays white in both light and dark mode.
const OUTLINE_BTN =
  "inline-flex items-center justify-center gap-2 border border-[#18181b] px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-[#ffffff]";

const HOLD_MS = 3000; // pause between slides
const SLIDE_S = 0.85; // how long one slide takes

/**
 * One row of three pictures. Every few seconds it slides by exactly one picture, then rests.
 * `dir` is the direction the pictures travel; `startDelay` offsets the two rows so they don't move together.
 */
function PhotoRow({
  srcs,
  dir,
  label,
  startDelay = 0,
}: {
  srcs: string[];
  dir: "left" | "right";
  label: string;
  startDelay?: number;
}) {
  const reduce = useReducedMotion();
  const loop = [...srcs, ...srcs]; // two copies: after n slides the row looks identical, so it can jump back unseen
  const n = srcs.length;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const hovering = useRef(false);
  const x = useMotionValue(0);

  useEffect(() => {
    if (reduce) return;
    const tileWidth = () => trackRef.current?.firstElementChild?.getBoundingClientRect().width ?? 0;
    // Moving right starts at the end of the strip so there is always a picture to the left.
    x.set(dir === "left" ? 0 : -n * tileWidth());

    let timer = 0;
    let busy = false;
    const slide = () => {
      const w = tileWidth();
      if (!w || busy || hovering.current || document.hidden) return;
      busy = true;
      const to = dir === "left" ? x.get() - w : x.get() + w;
      animate(x, to, {
        duration: SLIDE_S,
        ease: [0.65, 0, 0.35, 1],
        onComplete: () => {
          // Back to the identical-looking start, without anyone noticing.
          if (dir === "left" && x.get() <= -n * w + 0.5) x.set(0);
          if (dir === "right" && x.get() >= -0.5) x.set(-n * w);
          busy = false;
        },
      });
    };

    const start = window.setTimeout(() => {
      slide();
      timer = window.setInterval(slide, HOLD_MS + SLIDE_S * 1000);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [reduce, dir, n, startDelay, x]);

  return (
    <div
      ref={rowRef}
      className="group/row relative min-h-0 overflow-hidden rounded-[1.5rem]"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <motion.div ref={trackRef} className="flex h-full w-max" style={{ x }}>
        {loop.map((src, i) => (
          <div key={`${src}-${i}`} className="h-full shrink-0 pr-3" aria-hidden={i >= srcs.length}>
            <div className="relative h-full w-[185px] overflow-hidden rounded-[1.25rem] bg-black sm:w-[225px] lg:w-[245px]">
              <Image
                src={src}
                alt={i === 0 ? label : ""}
                fill
                sizes="300px"
                draggable={false}
                className="object-cover transition-transform duration-700 group-hover/row:scale-105"
              />
            </div>
          </div>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
    </div>
  );
}

export function OfferFeature({ promo, index }: OfferFeatureProps) {
  const reverse = index % 2 === 1;
  const review = GUEST_REVIEWS.find((r) => r.id === promo.reviewId) ?? null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Six slots, three per row, filled from the offer's pictures (wrapping if an offer has fewer than six).
  const pool = Array.from(new Set([promo.image, promo.image2, ...(promo.gallery ?? [])]));
  const pick = (i: number) => pool[i % pool.length];
  const topPhotos = [0, 1, 2].map(pick);
  const bottomPhotos = [3, 4, 5].map(pick);

  const reserveHref = `/reservations?offer=${promo.id}`;
  const enquireHref = `/contact?offer=${promo.id}`;

  async function share() {
    const url = `${window.location.origin}/offers#${promo.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: promo.title, text: promo.description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* the visitor closed the share sheet, or the browser refused: nothing to do */
    }
  }

  return (
    <article id={promo.id} className="scroll-mt-32">
      <Reveal variant={reverse ? "left" : "right"}>
        <div className="grid gap-6 rounded-[2rem] bg-[#ffffff] p-3.5 text-[#18181b] shadow-[0_30px_70px_-35px_rgba(0,0,0,0.55)] sm:p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-9">
          {/* Photos: two rows of three, each sliding one picture every few seconds. Top row moves left, bottom row moves right. */}
          <div
            className={cn(
              "theme-dark relative grid h-[330px] grid-rows-2 gap-3 sm:h-[380px] lg:h-auto lg:min-h-[440px]",
              reverse && "lg:order-2"
            )}
          >
            <PhotoRow srcs={topPhotos} dir="left" label={`${promo.label}: ${promo.title}`} />
            <PhotoRow srcs={bottomPhotos} dir="right" label="" startDelay={1500} />

            {/* Labels stay put while the pictures slide underneath */}
            <span className="pointer-events-none absolute left-4 top-3.5 hidden text-base font-medium text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] sm:block">
              #{promo.category}
            </span>
            <span
              className={cn(
                "pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-[10px]",
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
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] px-3.5 py-1.5 font-serif text-base font-semibold text-[#0a0a0c] shadow-[0_8px_24px_rgba(212,175,55,0.4)] sm:bottom-4 sm:left-4 sm:px-4 sm:py-2 sm:text-lg">
              {promo.highlight}
            </span>
          </div>

          {/* Details */}
          <div className="flex min-w-0 flex-col py-1 pr-1 sm:pr-3 lg:py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#8a6a1c]">{promo.label}</p>
            <h3 className="mt-2 font-serif text-2xl font-medium leading-snug text-[#18181b] sm:text-3xl">
              {promo.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-[#71717a] sm:text-base">
              {promo.description}
            </p>

            <ul className="mt-4 space-y-2">
              {promo.details.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-[#3f3f46]">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[#8a6a1c]" />
                  {d}
                </li>
              ))}
            </ul>

            {promo.liveWindow && (
              <div className="mt-4">
                <LiveCountdown from={promo.liveWindow.from} to={promo.liveWindow.to} />
              </div>
            )}

            {promo.includes && (
              <div className="mt-5">
                <p className="mb-2.5 text-[11px] uppercase tracking-[0.25em] text-[#8a6a1c]">What&apos;s included</p>
                <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {promo.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#52525b]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8a6a1c]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {promo.note && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-[#eadfb5] bg-[#fbf7e9] px-3.5 py-2.5 text-xs text-[#52525b]">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8a6a1c]" />
                {promo.note}
              </p>
            )}

            {promo.gallery && (
              <div className="mt-4 grid grid-cols-4 gap-2.5">
                {promo.gallery.map((src, i) => (
                  <motion.div
                    key={src}
                    whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="relative aspect-square overflow-hidden rounded-xl border border-[#e4e4e7]"
                  >
                    <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                  </motion.div>
                ))}
              </div>
            )}

            {review && (
              <figure className="relative mt-4 rounded-xl border border-[#eadfb5] bg-[#fbf7e9] p-5">
                <Quote className="absolute right-4 top-4 h-6 w-6 text-[#d4af37] opacity-40" />
                <div className="mb-2 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <blockquote className="font-serif text-sm font-light italic leading-relaxed text-[#3f3f46]">
                  &ldquo;{review.comment}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-xs text-[#71717a]">
                  {review.name} · {review.occasion}
                </figcaption>
              </figure>
            )}

            {/* Main actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {promo.soon ? (
                <>
                  <Link href={enquireHref}>
                    <Button variant="primary" size="md" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Ask About This Offer
                    </Button>
                  </Link>
                  <Link href={reserveHref} className={OUTLINE_BTN}>
                    Reserve a Table
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
                  <Link href={enquireHref} className={OUTLINE_BTN}>
                    <MessageCircle className="h-4 w-4" />
                    Enquire
                  </Link>
                </>
              )}
            </div>

            {/* Footer row: host, date, share, more */}
            <div className="relative mt-auto flex items-center gap-3 pt-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]">
                <Utensils className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-medium text-[#18181b]">By Truffles Rooftop</p>
                <p className="mt-1 truncate text-sm font-light text-[#71717a]">{promo.details[0]}</p>
              </div>

              <div className="relative flex items-center gap-2.5">
                <AnimatePresence>
                  {copied && (
                    <motion.span
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      role="status"
                      className="absolute -top-9 right-0 whitespace-nowrap rounded-full bg-[#18181b] px-3 py-1 text-xs text-[#ffffff]"
                    >
                      Link copied
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.button
                  type="button"
                  onClick={share}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  aria-label={`Share ${promo.title}`}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#e5c378] to-[#aa771c] text-[#0a0a0c] shadow-[0_8px_18px_-6px_rgba(170,119,28,0.7)]"
                >
                  <Share2 className="h-[18px] w-[18px]" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  aria-label="More options"
                  aria-expanded={menuOpen}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#18181b] text-[#18181b]"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute bottom-14 right-0 z-10 w-56 origin-bottom-right overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#ffffff] py-1.5 text-sm text-[#18181b] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                    >
                      <Link href={reserveHref} className="block px-4 py-2.5 hover:bg-[#f4f4f5]">
                        Reserve a table
                      </Link>
                      <Link href={enquireHref} className="block px-4 py-2.5 hover:bg-[#f4f4f5]">
                        Ask about this offer
                      </Link>
                      {promo.addon && (
                        <Link
                          href={`${reserveHref}&addon=${promo.addon.param}`}
                          className="block px-4 py-2.5 hover:bg-[#f4f4f5]"
                        >
                          {promo.addon.label}
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
