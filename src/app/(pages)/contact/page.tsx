import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { EventsHeroBg } from "@/components/events/EventsHeroBg";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactAside } from "@/components/forms/ContactAside";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Contact Us | Truffles Rooftop, F-10 Islamabad",
  description:
    "Contact Truffles Rooftop Restaurant in F-10, Islamabad. Call 0328-5566992 or 051-8776483, message us on WhatsApp, or send an enquiry.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <EventsHeroBg src={IMAGES.platedElegant} />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />
        <HeroParticles className="pointer-events-none absolute inset-0" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ Contact Us ✦
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="We'd love to" delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="hear from you" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Questions, feedback or ideas? Call, WhatsApp or send us a message.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-page py-16 sm:py-24">
        <FloatingGlows />
        <Container className="relative z-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <ContactAside />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
