import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { EventTypeGrid } from "@/components/events/EventTypeGrid";
import { EventPackages } from "@/components/events/EventPackages";
import { EnquirySection } from "@/components/events/EnquirySection";
import { EventGallery } from "@/components/events/EventGallery";
import { EventsHeroBg } from "@/components/events/EventsHeroBg";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { Marquee } from "@/components/sections/Marquee";
import { EVENT_TYPES } from "@/data/eventsData";
import { SITE_CONFIG } from "@/constants";
import { IMAGES } from "@/data/images";
import { whatsappLink } from "@/utils";

export const metadata: Metadata = {
  title: "Private & Corporate Events | Truffles Rooftop, F-10 Islamabad",
  description:
    "Host your birthday, anniversary, corporate event, bridal shower, proposal, graduation, engagement or Nikkah at Truffles Rooftop Restaurant, F-10 Islamabad. Dine + Decor packages, call or WhatsApp to book.",
};

export default function EventsPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-24 pt-40 text-center sm:pb-28 sm:pt-48">
        <EventsHeroBg src={IMAGES.evLongTable} />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />
        <HeroParticles className="pointer-events-none absolute inset-0" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ Private &amp; Corporate Events ✦
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Celebrate your" delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="moments above the city" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Truffles is a favourite venue for private and corporate events in F-10. Pick your
            occasion and we&apos;ll help you plan the rest.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <Link
                href="#enquire"
                className="inline-flex items-center rounded-sm bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#0a0a0c] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition hover:brightness-110"
              >
                Plan Your Event
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles! I would like to book an event.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/5 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:border-gold hover:text-gold-light"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </Magnetic>
          </div>
        </Container>
      </section>

      <Marquee items={EVENT_TYPES.map((t) => t.title)} />
      <EventTypeGrid />
      <EventPackages />
      <EnquirySection />
      <EventGallery />
    </>
  );
}
