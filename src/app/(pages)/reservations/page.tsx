import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { EventsHeroBg } from "@/components/events/EventsHeroBg";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { ReservationAside } from "@/components/reservations/ReservationAside";
import { ReservationSteps } from "@/components/reservations/ReservationSteps";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Reserve a Table | Truffles Rooftop, F-10 Islamabad",
  description:
    "Reserve a table at Truffles Rooftop Restaurant, F-10 Islamabad. Request a booking online, or call 0328-5566992 or 051-8776483.",
};

export default function ReservationsPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <EventsHeroBg src={IMAGES.heroDish} />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />
        <HeroParticles className="pointer-events-none absolute inset-0" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ Reservations ✦
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Reserve your" delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="table" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Bring your family, bring your friends, and enjoy a perfect evening overlooking Islamabad.
          </p>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-page py-14 sm:py-20">
        <FloatingGlows />
        <Container className="relative z-10">
          {/* How it works: a real sequence */}
          <ReservationSteps />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal variant="left" className="lg:col-span-8">
              <ReservationForm />
            </Reveal>

            <div className="lg:col-span-4">
              <ReservationAside />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
