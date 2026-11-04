"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitText } from "@/components/motion/SplitText";
import { IMAGES, unsplash } from "@/data/images";
import { ArrowRight, Sparkles, Coffee, Percent, PartyPopper, MapPin } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Optional hero video. Put a file in /public/videos (for example
 * "/videos/hero.mp4") and set this path: it replaces the photo slideshow.
 */
const HERO_VIDEO_SRC = "" as string;

/** Ambiance and signature dishes, crossfading. */
const HERO_SLIDES = [
  { src: IMAGES.heroDish, alt: "The rooftop terrace overlooking the city" },
  { src: IMAGES.dessert, alt: "A grilled steak being sliced at the table" },
  { src: IMAGES.interiorWarm, alt: "The dining room in the evening" },
  { src: IMAGES.pastaTruffle, alt: "Creamy truffle risotto" },
];

function HeroBackdrop() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (HERO_VIDEO_SRC) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % HERO_SLIDES.length), 6500);
    return () => window.clearInterval(t);
  }, []);

  if (HERO_VIDEO_SRC) {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }

  const slide = HERO_SLIDES[i];
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={slide.src}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      >
        <Image
          src={unsplash(slide.src, 2000)}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover animate-kenburns"
        />
      </motion.div>
    </AnimatePresence>
  );
}

/** Fade-and-rise used for every hero element after the headline. */
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

export function HeroSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Photo drifts slower than the page; copy rises and fades as you leave.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="theme-dark relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-band pt-28 pb-24"
    >
      {/* Cinematic background photography (parallax) */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-x-0 top-0 -bottom-[22%] z-0"
      >
        <HeroBackdrop />
        {/* Light scrim only: keeps the white text readable and lets the photo show */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
      </motion.div>

      {/* Floating gold embers */}
      <HeroParticles className="absolute inset-0 z-[1] pointer-events-none" />

      <Container className="relative z-10">
        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Location badge */}
          <motion.div
            {...rise(0.1)}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/40 bg-black/40 backdrop-blur-md"
          >
            <motion.span
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.25, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
            </motion.span>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gold-light font-medium">
              Rooftop Dining • F-10, Islamabad
            </span>
          </motion.div>

          {/* Headline: words rise out of a mask, one after another */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.08] [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
              <span className="block">
                <SplitText text="Where Truffle Mastery" delay={0.3} />
              </span>
              <span className="block italic font-light">
                <SplitText
                  text="Becomes High Art"
                  delay={0.7}
                  wordClassName="animate-shimmer"
                />
              </span>
            </h1>
            <motion.p
              {...rise(1.2)}
              className="max-w-2xl mx-auto text-sm sm:text-lg text-zinc-200 font-light leading-relaxed pt-2 [text-shadow:0_1px_14px_rgba(0,0,0,0.8)]"
            >
              Bring your family, bring your friends, and enjoy a perfect
              evening overlooking Islamabad.
            </motion.p>
            <motion.p
              {...rise(1.35)}
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gold-light [text-shadow:0_1px_10px_rgba(0,0,0,0.8)]"
            >
              <MapPin className="w-4 h-4 text-gold" />
              <span>Truffles Rooftop Restaurant, F-10 Islamabad</span>
            </motion.p>
          </div>

          {/* Action CTAs */}
          <motion.div
            {...rise(1.5)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Magnetic className="w-full sm:w-auto">
              <Link href="/reservations" className="block w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 group"
                >
                  <span>Reserve A Table</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <Link href="/menu" className="block w-full sm:w-auto">
                <Button variant="glass" size="lg" className="w-full sm:w-auto">
                  Explore The Menu
                </Button>
              </Link>
            </Magnetic>
          </motion.div>

          {/* Floating luxury status pill */}
          <motion.div {...rise(1.7)} className="pt-8">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-3.5 px-6 sm:px-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-2xl text-xs text-zinc-300"
            >
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-gold" />
                <span>Hi-Tea · Rs. 1,995 · 3–6 PM daily</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-600" />
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-gold" />
                <span>Lunch Offer · 20% off · 12–3:30 PM</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-600" />
              <div className="flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-gold" />
                <span>Birthdays · Proposals · Events</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: copyOpacity }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500"
      >
        <span>Scroll</span>
        <span className="relative block w-px h-11 overflow-hidden bg-gradient-to-b from-[#d4af37] to-transparent">
          <motion.span
            className="absolute left-0 w-full h-1/2 bg-[#f3e5ab]"
            animate={{ top: ["-50%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-band to-transparent pointer-events-none z-[2]" />
    </section>
  );
}
