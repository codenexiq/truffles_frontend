import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";
import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { PdfDownload } from "@/components/menu/PdfDownload";
import { CTASection } from "@/components/sections/CTASection";
import { IMAGES } from "@/data/images";

export const metadata: Metadata = {
  title: "Menu | Truffles Rooftop, F-10 Islamabad",
  description:
    "Explore the Truffles Rooftop menu: appetizers, main course, desserts and beverages, with our bestsellers and chef's specials. Download the PDF menu.",
};

export default function MenuPage() {
  return (
    <>
      {/* Page hero */}
      <section className="theme-dark relative isolate overflow-hidden bg-band pb-20 pt-40 text-center sm:pb-24 sm:pt-48">
        <Image
          src={IMAGES.heroDish}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-band/80 via-band/55 to-page" />
        <div className="aurora" />

        <Container className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-gold-light backdrop-blur-md">
            ✦ Our Menu ✦
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-normal leading-[1.05] text-white sm:text-6xl md:text-7xl">
            <SplitText text="Fresh, flavourful," delay={0.2} />{" "}
            <span className="italic">
              <SplitText text="made to share" delay={0.5} wordClassName="animate-shimmer" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-300 sm:text-base">
            Appetizers, main course, desserts and beverages, served with a view over Islamabad.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <PdfDownload />
            </Magnetic>
            <Magnetic>
              <Link
                href="/reservations"
                className="inline-flex items-center rounded-sm border border-white/25 bg-white/5 px-7 py-4 text-sm uppercase tracking-[0.2em] text-white backdrop-blur-sm transition hover:border-gold hover:text-gold-light"
              >
                Reserve a Table
              </Link>
            </Magnetic>
          </div>
        </Container>
      </section>

      <MenuBrowser />
      <CTASection />
    </>
  );
}
