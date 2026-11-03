import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Mail, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ContactForm } from "@/components/forms/ContactForm";
import { OpeningTimes } from "@/components/layout/OpeningTimes";
import { SITE_CONFIG } from "@/constants";
import { IMAGES } from "@/data/images";
import { whatsappLink } from "@/utils";

export const metadata: Metadata = {
  title: "Contact Us | Truffles Rooftop, F-10 Islamabad",
  description:
    "Contact Truffles Rooftop Restaurant in F-10, Islamabad. Call 0328-5566992 or 051-8776483, message us on WhatsApp, or send an enquiry.",
};

const iconWrap =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-gold";

export default function ContactPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <Image src={IMAGES.platedElegant} alt="" aria-hidden fill priority sizes="100vw" className="object-cover opacity-35 animate-kenburns" />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />

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

      <section className="bg-page py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal variant="left" className="lg:col-span-7">
              <ContactForm />
            </Reveal>

            <div className="space-y-5 lg:col-span-5">
              <Reveal variant="right">
                <div className="luxury-card rounded-2xl p-7">
                  <div className="flex items-center gap-3">
                    <span className={iconWrap}><MapPin className="h-4 w-4" /></span>
                    <h2 className="font-serif text-xl text-zinc-100">Find us</h2>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                    {SITE_CONFIG.address.venue}
                    <br />
                    {SITE_CONFIG.address.area}, {SITE_CONFIG.address.city}, {SITE_CONFIG.address.country}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">Overlooking Islamabad</p>
                </div>
              </Reveal>

              <Reveal variant="right" delay={120}>
                <div className="luxury-card rounded-2xl p-7">
                  <div className="flex items-center gap-3">
                    <span className={iconWrap}><Phone className="h-4 w-4" /></span>
                    <h2 className="font-serif text-xl text-zinc-100">Call or WhatsApp</h2>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                    {SITE_CONFIG.phones.map((p) => (
                      <li key={p.tel}>
                        <a href={`tel:${p.tel}`} className="font-mono text-gold hover:underline">{p.display}</a>
                      </li>
                    ))}
                    {SITE_CONFIG.email && (
                      <li className="flex items-center gap-2 pt-1">
                        <Mail className="h-4 w-4 text-gold" />
                        <a href={`mailto:${SITE_CONFIG.email}`} className="text-gold hover:underline">{SITE_CONFIG.email}</a>
                      </li>
                    )}
                  </ul>
                  <a
                    href={whatsappLink(SITE_CONFIG.whatsapp, "Hello Truffles!")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-[#0a0a0c]"
                  >
                    <MessageCircle className="h-4 w-4" /> Message on WhatsApp
                  </a>
                </div>
              </Reveal>

              <Reveal variant="right" delay={240}>
                <div className="luxury-card rounded-2xl p-7">
                  <div className="flex items-center gap-3">
                    <span className={iconWrap}><Clock className="h-4 w-4" /></span>
                    <h2 className="font-serif text-xl text-zinc-100">Opening times</h2>
                  </div>
                  <div className="mt-4">
                    <OpeningTimes />
                  </div>
                </div>
              </Reveal>

              <Reveal variant="right" delay={360}>
                <p className="px-1 text-sm text-zinc-400">
                  Want a table?{" "}
                  <Link href="/reservations" className="text-gold underline-offset-4 hover:underline">Reserve online</Link>.
                  Planning an event?{" "}
                  <Link href="/events#enquire" className="text-gold underline-offset-4 hover:underline">Start here</Link>.
                </p>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
