import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, ShieldCheck, Wine, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { Reveal } from "@/components/ui/Reveal";
export const metadata: Metadata = {
  title: "Our Heritage & Philosophy | Truffles Cafe & Restaurant",
  description:
    "Discover the story of Truffles Cafe & Restaurant. From the foggy hills of Alba to our Michelin-selected dining salon in New York.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Artisanal Alba Sourcing",
    description:
      "We partner exclusively with multi-generational trifolao (truffle hunters) in Piedmont and Umbria, ensuring certified organic harvest and peak aroma.",
  },
  {
    icon: Award,
    title: "Culinary Rigor & Craft",
    description:
      "Every single ribbon of pasta is rolled by hand each morning using 40 egg yolks per kilo, replicating the golden standard of Northern Italy.",
  },
  {
    icon: Wine,
    title: "Archival Sommelier Vault",
    description:
      "A temperature-controlled collection exceeding 1,400 Grand Cru and Premier Cru selections, curated to harmonize with the intense aromatic profile of truffles.",
  },
  {
    icon: ShieldCheck,
    title: "Sustainability & Reverence",
    description:
      "We honor the forest soil and biodiversity through sustainable foraging practices, ethical butchery, and zero-waste kitchen techniques.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 bg-page min-h-screen relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10 max-w-5xl">
        <SectionHeading
          badge="OUR HERITAGE"
          title="The Symphony of Earth & Elegance"
          subtitle="Born from an obsession with the elusive Alba white truffle, Truffles Cafe & Restaurant was created to be a temple of sensory delight."
        />

        {/* Story Section */}
        <Reveal className="luxury-card rounded-2xl p-8 sm:p-12 space-y-6 border border-gold/30 mb-16" variant="scale">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-medium block">
            THE ODYSSEY
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            From the Foggy Forests of Piedmont to Our Dining Salon
          </h3>
          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            In the autumn of 2018, Executive Chef Alessandro Monti spent months
            walking the oak woodlands of Langhe alongside master truffle hunters
            and their trained lagotto romagnolo hounds. Witnessing the reverent
            unearthing of a pristine 800-gram white truffle ignited the vision for
            what Truffles Cafe & Restaurant is today.
          </p>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Our mission is singular: to honor this extraordinary gift of nature
            through uncompromising culinary craft, warm bespoke hospitality, and
            an atmosphere that transports every guest into an intimate celebration of life.
          </p>
        </Reveal>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={i}
                className="luxury-card rounded-xl p-7 border border-white/5 space-y-3"
               variant="up" delay={i * 120}>
                <div className="w-10 h-10 rounded-full border border-gold/40 bg-[#d4af37]/5 flex items-center justify-center text-gold">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-white font-normal">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </Reveal>
            );
          })}
        </div>

        {/* Executive Chef Spotlight */}
        <div className="rounded-2xl border border-white/10 bg-surface p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#d4af37] to-[#aa771c] p-[2px] shrink-0">
            <div className="w-full h-full rounded-full bg-page flex items-center justify-center font-serif text-2xl font-bold text-gold-light">
              AM
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-medium">
              CULINARY LEADERSHIP
            </span>
            <h4 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Chef Alessandro Monti
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-2xl">
              Alumnus of three-Michelin-starred establishments in Modena and Paris,
              Chef Monti brings over two decades of fine dining precision to every
              degustation menu served at Truffles.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/reservations">
            <Button variant="primary" size="lg">
              Reserve Your Table With Us
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
