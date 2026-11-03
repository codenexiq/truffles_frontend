import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, CheckCheck, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { SITE_CONFIG } from "@/constants";
import { IMAGES } from "@/data/images";
import { whatsappLink } from "@/utils";

export const metadata: Metadata = {
  title: "Reserve a Table | Truffles Rooftop, F-10 Islamabad",
  description:
    "Reserve a table at Truffles Rooftop Restaurant, F-10 Islamabad. Request a booking online, or call 0328-5566992 or 051-8776483.",
};

const STEPS = [
  { icon: Send, title: "Send your request", text: "Choose your date, time and party size." },
  { icon: CheckCheck, title: "We confirm", text: "Our team confirms your table with you." },
  { icon: CalendarCheck, title: "Enjoy the evening", text: "Arrive and enjoy the view over Islamabad." },
] as const;

export default function ReservationsPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <Image src={IMAGES.heroDish} alt="" aria-hidden fill priority sizes="100vw" className="object-cover opacity-40 animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />

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

      <section className="bg-page py-14 sm:py-20">
        <Container>
          {/* How it works: a real sequence */}
          <Stagger className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3" stagger={0.1}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem key={title}>
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-surface p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Step {i + 1}</p>
                    <p className="mt-0.5 font-serif text-lg text-zinc-100">{title}</p>
                    <p className="mt-0.5 text-xs font-light text-zinc-400">{text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <Reveal variant="left" className="lg:col-span-8">
              <ReservationForm />
            </Reveal>

            <div className="space-y-5 lg:col-span-4">
              <Reveal variant="right">
                <div className="luxury-card rounded-2xl p-7">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Prefer to talk?</p>
                  <h2 className="mt-1 font-serif text-2xl text-zinc-100">Call or WhatsApp</h2>
                  <div className="mt-5 space-y-2.5">
                    {SITE_CONFIG.phones.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="flex items-center gap-3 rounded-lg border border-white/15 px-4 py-3 text-sm text-zinc-200 transition-colors hover:border-gold hover:text-gold"
                      >
                        <Phone className="h-4 w-4 text-gold" />
                        <span className="font-mono">{p.display}</span>
                      </a>
                    ))}
                    <a
                      href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles! I would like to book a table.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-4 py-3 text-sm font-semibold text-[#0a0a0c] transition hover:brightness-110"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp us
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal variant="right" delay={120}>
                <div className="luxury-card rounded-2xl p-7">
                  <h2 className="flex items-center gap-2 font-serif text-xl text-zinc-100">
                    <Sparkles className="h-4 w-4 text-gold" /> Good to know
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm font-light leading-relaxed text-zinc-400">
                    <li>
                      <strong className="font-medium text-zinc-200">Lunch:</strong> 20% off, 12:00 to 3:30 PM.{" "}
                      <Link href="/offers#lunch" className="text-gold underline-offset-4 hover:underline">See offer</Link>
                    </li>
                    <li>
                      <strong className="font-medium text-zinc-200">Hi-Tea:</strong> Rs. 1,995, 3:00 to 6:00 PM, from 1st February.{" "}
                      <Link href="/offers#hi-tea" className="text-gold underline-offset-4 hover:underline">See offer</Link>
                    </li>
                    <li>
                      <strong className="font-medium text-zinc-200">Groups &amp; events:</strong> planning a birthday, proposal or corporate event?{" "}
                      <Link href="/events#enquire" className="text-gold underline-offset-4 hover:underline">Plan it with us</Link>
                    </li>
                    <li>
                      <strong className="font-medium text-zinc-200">Same day?</strong> Please call or WhatsApp for the quickest answer.
                    </li>
                  </ul>
                </div>
              </Reveal>

              <Reveal variant="right" delay={240}>
                <div className="luxury-card flex items-start gap-3 rounded-2xl p-6">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div className="text-sm text-zinc-400">
                    <p className="font-serif text-lg text-zinc-100">{SITE_CONFIG.address.venue}</p>
                    <p>{SITE_CONFIG.address.area}, {SITE_CONFIG.address.city}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
