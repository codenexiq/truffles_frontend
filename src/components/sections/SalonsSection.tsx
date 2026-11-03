import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { IMAGES, unsplash } from "@/data/images";
import { Users, Wine, Flame, Sparkles } from "lucide-react";

const SALONS = [
  {
    id: "salon-1",
    name: "The Sommelier Wine Vault",
    capacity: "Up to 12 Guests",
    description:
      "An intimate subterranean sanctuary enveloped by 1,400 rare vintage bottles. Features dedicated master sommelier service and bespoke vertical wine pairings.",
    icon: Wine,
    badge: "Exclusive Cellar",
    image: IMAGES.wineCellar,
  },
  {
    id: "salon-2",
    name: "The Chef's Tasting Counter",
    capacity: "Up to 8 Guests",
    description:
      "Front-row seats to culinary theatricality. Watch Executive Chef Monti craft each course with tableside truffle shaving and live fire finishing.",
    icon: Flame,
    badge: "Front-Row Gastronomy",
    image: IMAGES.chefPlating,
  },
  {
    id: "salon-3",
    name: "The Grand Velvet Salon",
    capacity: "Up to 45 Guests",
    description:
      "Gilded vintage mirrors, hand-cut Austrian crystal chandeliers, and opulent banquettes designed for grand celebrations, weddings, and executive galas.",
    icon: Sparkles,
    badge: "Grand Occasions",
    image: IMAGES.heroInterior,
  },
  {
    id: "salon-4",
    name: "The Starlit Terrace & Lounge",
    capacity: "Up to 24 Guests",
    description:
      "A climate-controlled private terrace overlooking the city skyline. Ideal for sunset champagne aperitivos, digestifs, and bespoke cocktail parties.",
    icon: Users,
    badge: "Open Air & Skyline",
    image: IMAGES.interiorWarm,
  },
];

export function SalonsSection() {
  return (
    <section className="py-24 sm:py-28 bg-band relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-[#d4af37]/5 blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="EXCLUSIVE EXPERIENCES"
          title="Private Salons & Dining Sanctuaries"
          subtitle="From intimate anniversary dinners to distinguished executive summits, our private dining rooms offer discretion, unmatched elegance, and bespoke service."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SALONS.map((salon, i) => {
            const Icon = salon.icon;
            return (
              <Reveal
                key={salon.id}
                variant="up"
                delay={i * 110}
                className="luxury-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Salon photography */}
                <div className="img-zoom relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={unsplash(salon.image, 700)}
                    alt={salon.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-full border border-gold/50 bg-black/50 theme-dark backdrop-blur-sm flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="absolute top-3 right-3 text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-white/15 text-zinc-200 bg-black/50 theme-dark backdrop-blur-sm">
                    {salon.badge}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif text-xl text-white font-normal mb-1.5 group-hover:text-gold-light transition-colors">
                      {salon.name}
                    </h3>
                    <span className="text-xs font-mono text-gold block mb-3">
                      {salon.capacity}
                    </span>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {salon.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/[0.05] mt-5">
                    <Link
                      href="/reservations"
                      className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-light transition-colors flex items-center justify-between"
                    >
                      <span>Request Private Salon</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
            Custom tasting menus &amp; dedicated sommelier available for all private events
          </p>
          <Link href="/contact">
            <Button variant="outline" size="sm">
              Inquire with Private Events Concierge
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
