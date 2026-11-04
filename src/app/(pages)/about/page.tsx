import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { EventsHeroBg } from "@/components/events/EventsHeroBg";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { Marquee } from "@/components/sections/Marquee";
import { AboutContent } from "@/components/about/AboutContent";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Our Heritage & Philosophy | Truffles Cafe & Restaurant",
  description:
    "Discover the story of Truffles Cafe & Restaurant. From the foggy hills of Alba to our Michelin-selected dining salon in New York.",
};

export default function AboutPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-24 pt-40 text-center sm:pb-28 sm:pt-48">
        <EventsHeroBg src={IMAGES.interiorWarm} />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />
        <HeroParticles className="pointer-events-none absolute inset-0" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ About Truffles ✦
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Our story," delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="served with care" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            The people, the craft and the promises behind every plate.
          </p>
        </Container>
      </section>

      <Marquee items={["Our Story", "Handmade Pasta", "Alba Truffles", "The Sommelier Vault", "Sustainable Kitchen", "Rooftop Dining"]} />
      <AboutContent />
    </>
  );
}
