import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { OffersList } from "@/components/offers/OffersList";
import { CTASection } from "@/components/sections/CTASection";
import { PROMOTIONS } from "@/data/promotions";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Special Offers | Truffles Rooftop, F-10 Islamabad",
  description:
    "Hi-Tea for Rs. 1,995, 20% off lunch, Valentine's candlelit dinner, Truffles Anniversary 30% off, Iftar buffet, Eid specials and Dine + Decor packages at Truffles Rooftop Restaurant, F-10 Islamabad.",
};

export default function OffersPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <Image
          src={IMAGES.interiorWarm}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/60 to-page" />
        <div className="aurora" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ Special Offers ✦
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Offers made for" delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="every occasion" delay={0.55} wordClassName="animate-shimmer" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Hi-tea afternoons, lunch deals, festive menus and styled dining packages
            on the rooftop. Pick an offer, then reserve or ask us anything.
          </p>

          {/* Jump links to each offer */}
          <Stagger className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2.5" stagger={0.06} delay={0.9}>
            {PROMOTIONS.map((p) => (
              <StaggerItem key={p.id}>
                <Link
                  href={`#${p.id}`}
                  className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold-light"
                >
                  {p.label}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <OffersList />
      <CTASection />
    </>
  );
}
