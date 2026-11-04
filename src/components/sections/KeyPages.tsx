"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, BookOpen, ChevronRight, MoreHorizontal, Phone, Utensils } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/motion/Counter";
import { IMAGES } from "@/data/images";
import { PROMOTIONS } from "@/data/promotions";
import { cn } from "@/utils";

// Card colours are fixed hex values (not theme tokens) so the white cards stay white in light and dark mode.
const INK = "text-[#18181b]";
const SOFT = "text-[#71717a]";
const GOLD_TEXT = "text-[#8a6a1c]";
const CARD =
  "relative flex flex-col rounded-[1.9rem] bg-[#ffffff] p-3.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] ring-1 ring-black/5";

const EASE = [0.16, 1, 0.3, 1] as const;

// ---------- animation variants ----------
/** The card itself flies in from a side (or from below), then its contents follow one after another. */
const cardFrom = (x: number, y: number): Variants => ({
  hidden: { opacity: 0, x, y, scale: 0.94, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE, when: "beforeChildren", staggerChildren: 0.09 },
  },
});
const child: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const pop: Variants = {
  hidden: { opacity: 0, scale: 0.55 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 320, damping: 17 } },
};
const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0 round 1.4rem)" },
  show: { clipPath: "inset(0 0 0% 0 round 1.4rem)", transition: { duration: 1.1, ease: EASE } },
};
const zoomOut: Variants = {
  hidden: { scale: 1.35 },
  show: { scale: 1, transition: { duration: 1.6, ease: EASE } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } } as const;
const lift = { whileHover: { y: -10 }, transition: { type: "spring", stiffness: 300, damping: 22 } } as const;

/** Small gold pill: it pops in when its card arrives. */
function Pill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <motion.span
      variants={pop}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium",
        dark ? "bg-[#18181b] text-[#ffffff]" : "bg-gradient-to-r from-[#e5c378] to-[#c99a2e] text-[#1a1305]"
      )}
    >
      {children}
    </motion.span>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <motion.p variants={child} className={cn("flex flex-wrap items-center gap-x-2 text-[14px]", SOFT)}>
      {items.map((t, i) => (
        <span key={t} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-[#c4c4c8]">•</span>}
          {t}
        </span>
      ))}
    </motion.p>
  );
}

/** Round Truffles mark used where the reference shows an author or publisher logo. */
function Mark() {
  return (
    <motion.span
      variants={pop}
      whileHover={{ rotate: 360, scale: 1.1 }}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4af37] bg-[#0a0a0c] text-[#d4af37]"
    >
      <Utensils className="h-4 w-4" aria-hidden="true" />
    </motion.span>
  );
}

/** Photo that is wiped in from the top and slowly zooms out, then zooms in again on hover. */
function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div variants={wipe} className={cn("relative overflow-hidden bg-black", className)}>
      <motion.div variants={zoomOut} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
      </motion.div>
      {/* a light sweep when the card is hovered */}
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[130%] group-hover:opacity-100" />
    </motion.div>
  );
}

/** The "Offers" card's mini list: it cycles through the real offers every few seconds. */
function OfferTicker() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % PROMOTIONS.length), 3200);
    return () => window.clearInterval(t);
  }, [reduce]);
  const o = PROMOTIONS[i];

  return (
    <motion.div variants={child} className="relative mx-1 mt-3 h-[74px] overflow-hidden rounded-2xl border border-[#e4e4e7]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={o.id}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -26 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0 flex items-center gap-3 px-3"
        >
          <Image src={o.image} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
          <span className={cn("min-w-0 truncate text-[15px] font-medium", INK)}>{o.label}</span>
          <span className={cn("ml-auto shrink-0 text-[13px]", SOFT)}>{o.highlight}</span>
        </motion.div>
      </AnimatePresence>
      {/* progress dots */}
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
        {PROMOTIONS.map((p, k) => (
          <motion.span
            key={p.id}
            animate={{ width: k === i ? 14 : 4, opacity: k === i ? 1 : 0.35 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="h-1 rounded-full bg-[#d4af37]"
          />
        ))}
      </div>
    </motion.div>
  );
}

export function KeyPages() {
  const reduce = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-page py-24 sm:py-28">
      {/* Faint grid that drifts slowly, like a moving backdrop */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(128,128,128,0.13)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.13)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
        animate={reduce ? undefined : { backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        aria-hidden="true"
      />
      {/* Two soft gold glows that float behind the cards */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        animate={reduce ? undefined : { y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        animate={reduce ? undefined : { y: [0, -50, 0], x: [0, -30, 0] }}
        transition={{ duration: 15, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <SectionHeading badge="EXPLORE" title="Plan Your Visit" subtitle="Everything you need, one tap away." />

        {/* Featured: reservations (flies in from the left) */}
        <motion.article
          {...inView}
          variants={cardFrom(-80, 0)}
          {...lift}
          className={cn(CARD, "group grid gap-5 md:grid-cols-[minmax(0,5fr)_minmax(0,9fr)] md:p-4")}
        >
          <Photo src={IMAGES.heroDish} alt="The rooftop terrace overlooking the city" className="aspect-[4/3] md:aspect-auto md:min-h-[230px]" />

          <div className="flex min-w-0 flex-col py-1 pr-1 md:pr-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Pill dark>Reservations</Pill>
              <Tags items={["Rooftop", "F-10", "Daily"]} />
              <motion.span variants={child} className={cn("ml-auto hidden text-[14px] sm:block", SOFT)}>
                Book ahead
              </motion.span>
              <motion.div variants={pop} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="More ways to book"
                  aria-expanded={menuOpen}
                  className="relative z-10 flex h-8 w-14 cursor-pointer items-center justify-center rounded-full border border-[#d4d4d8] text-[#18181b] transition-colors hover:bg-[#f4f4f5]"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.92 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      className="absolute right-0 top-10 z-20 w-52 origin-top-right overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#ffffff] py-1.5 text-sm text-[#18181b] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                    >
                      <a href="tel:03285566992" className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f4f4f5]">
                        <Phone className="h-4 w-4 text-[#8a6a1c]" /> 0328-5566992
                      </a>
                      <a href="tel:0518776483" className="flex items-center gap-2 px-4 py-2.5 hover:bg-[#f4f4f5]">
                        <Phone className="h-4 w-4 text-[#8a6a1c]" /> 051-8776483
                      </a>
                      <Link href="/contact" className="block px-4 py-2.5 hover:bg-[#f4f4f5]">
                        Send an enquiry
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.h3 variants={child} className={cn("mt-4 font-sans text-xl font-semibold leading-snug sm:text-[1.6rem]", INK)}>
              <Link href="/reservations" className="after:absolute after:inset-0 after:content-['']">
                Book your evening on the rooftop
              </Link>
            </motion.h3>
            <motion.p variants={child} className={cn("mt-3 line-clamp-2 max-w-3xl text-[15px] leading-relaxed", SOFT)}>
              Bring your family, bring your friends, and enjoy a perfect evening overlooking Islamabad. Reserve a table
              online, or call 0328-5566992 | 051-8776483.
            </motion.p>

            <motion.div variants={child} className="mt-auto flex items-center gap-3 pt-5">
              <Mark />
              <span className={cn("text-[15px]", SOFT)}>
                In <span className={cn("font-medium", INK)}>Truffles Rooftop</span>
              </span>
              <span className={cn("ml-auto flex items-center gap-1.5 text-[15px]", INK)}>
                F-10, Islamabad
                <ArrowUpRight className="h-4 w-4 text-[#8a6a1c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.div>
          </div>
        </motion.article>

        {/* Three cards: from the left, from below, from the right */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Offers */}
          <motion.article {...inView} variants={cardFrom(-60, 40)} {...lift} className={cn(CARD, "group")}>
            <div className="rounded-[1.4rem] border border-[#e4e4e7] bg-[#f6f6f7] p-4">
              <Pill>Offers</Pill>
              <div className="mt-3">
                <Tags items={["Hi-Tea", "Lunch", "Festive"]} />
              </div>
              <motion.h3 variants={child} className={cn("mt-3 font-sans text-lg font-semibold leading-snug", INK)}>
                <Link href="/offers" className="after:absolute after:inset-0 after:content-['']">
                  Hi-tea, lunch deals, festive menus and styled dining packages
                </Link>
              </motion.h3>
              <motion.div variants={child} className="mt-4 flex items-center gap-2.5">
                <Mark />
                <span className={cn("text-[15px]", SOFT)}>
                  By <span className={cn("font-medium", INK)}>Truffles Rooftop</span>
                </span>
              </motion.div>
            </div>

            <motion.p variants={child} className={cn("mt-5 px-1 text-[15px] font-semibold", INK)}>
              Offers (<Counter to={PROMOTIONS.length} duration={1.4} />)
            </motion.p>
            <OfferTicker />

            <motion.div variants={child} className="mt-auto pt-5">
              <Link
                href="/offers"
                className="relative z-10 mx-1 mb-1 flex items-center justify-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] py-3 text-[15px] font-semibold text-[#0a0a0c] shadow-[0_10px_24px_-10px_rgba(170,119,28,0.8)] transition-all hover:brightness-110"
              >
                {/* shine that sweeps across the button now and then */}
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    initial={{ left: "-30%" }}
                    animate={{ left: ["-30%", "130%"] }}
                    transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.8 }}
                  />
                )}
                <span className="relative flex items-center gap-1">
                  View All Offers <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </motion.article>

          {/* Menu */}
          <motion.article {...inView} variants={cardFrom(0, 70)} {...lift} className={cn(CARD, "group")}>
            <Photo src={IMAGES.pastaTruffle} alt="A creamy truffle risotto from the menu" className="aspect-[4/3]" />
            <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
              <Tags items={["Menu", "Starters & Mains", "Drinks"]} />
              <motion.h3 variants={child} className={cn("mt-3 font-sans text-lg font-semibold leading-snug", INK)}>
                <Link href="/menu" className="after:absolute after:inset-0 after:content-['']">
                  Starters, mains, desserts and drinks
                </Link>
              </motion.h3>
              <motion.div variants={child} className="mt-auto flex items-center gap-2.5 pt-5">
                <Mark />
                <span className={cn("text-[15px]", SOFT)}>
                  In <span className={cn("font-medium", INK)}>Menu</span>
                </span>
                <span className={cn("ml-auto text-[14px]", INK)}>F-10, Islamabad</span>
              </motion.div>
            </div>
          </motion.article>

          {/* Events */}
          <motion.article {...inView} variants={cardFrom(60, 40)} {...lift} className={cn(CARD, "group")}>
            <Photo src={IMAGES.evBirthday} alt="Birthday balloons at a rooftop celebration" className="aspect-[4/3]" />
            <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Pill>Events</Pill>
                <Tags items={["Celebrations", "Corporate"]} />
              </div>
              <motion.h3 variants={child} className={cn("mt-3 font-sans text-lg font-semibold leading-snug", INK)}>
                <Link href="/events" className="after:absolute after:inset-0 after:content-['']">
                  Birthdays, proposals, corporate dinners and more
                </Link>
              </motion.h3>
              <motion.div variants={child} className="mt-auto flex items-center gap-2.5 pt-5">
                <Mark />
                <span className={cn("text-[15px]", SOFT)}>
                  In <span className={cn("font-medium", INK)}>Events</span>
                </span>
                <span className={cn("ml-auto text-[14px]", INK)}>F-10, Islamabad</span>
              </motion.div>
            </div>
          </motion.article>
        </div>

        {/* The remaining pages: the two pills spring up one after the other */}
        <motion.div
          {...inView}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { href: "/blog", icon: BookOpen, label: "Blog: new dishes and stories" },
            { href: "/contact", icon: Phone, label: "Contact us: call, WhatsApp or find us" },
          ].map(({ href, icon: Icon, label }) => (
            <motion.div key={href} variants={pop} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={href}
                className="group inline-flex items-center gap-2 rounded-full bg-[#ffffff] px-5 py-3 text-[14px] font-medium text-[#18181b] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
              >
                <Icon className={cn("h-4 w-4", GOLD_TEXT)} /> {label}
                <ArrowUpRight className="h-4 w-4 text-[#8a6a1c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
