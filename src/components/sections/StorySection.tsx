import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/motion/Counter";
import { Parallax } from "@/components/motion/Parallax";
import { Button } from "@/components/ui/Button";
import { IMAGES, unsplash } from "@/data/images";
import { Award, ShieldCheck, HeartHandshake } from "lucide-react";

export function StorySection() {
  return (
    <section className="py-24 sm:py-28 bg-band border-y border-white/5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Layered Photography (5 cols) */}
          <Reveal variant="left" className="lg:col-span-5">
            <div className="relative">
              {/* Main image */}
              <div className="img-zoom group relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/30 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
                <Image
                  src={unsplash(IMAGES.truffleShaved, 1000)}
                  alt="Freshly shaved Alba white truffle over handmade pasta"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.3em] text-gold-light bg-black/50 theme-dark backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                  Piedmont &amp; Alba Heritage
                </span>
              </div>

              {/* Floating chef image */}
              <Parallax offset={-45} className="absolute -bottom-8 -right-4 sm:-right-8 w-32 h-40 sm:w-40 sm:h-52 rounded-xl overflow-hidden border border-gold/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)] hidden sm:block">
                <Image
                  src={unsplash(IMAGES.chefPlating, 500)}
                  alt="Executive chef finishing a plate tableside"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
              </Parallax>
            </div>

            {/* Stats strip */}
            <div className="mt-12 sm:mt-14 grid grid-cols-3 gap-2 luxury-card rounded-2xl p-6 text-center border border-gold/20">
              <div>
                <span className="font-serif text-2xl text-gold block font-semibold">
                  <Counter to={100} suffix="%" />
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Certified Alba
                </span>
              </div>
              <div className="border-x border-white/10">
                <span className="font-serif text-2xl text-gold block font-semibold">
                  <Counter to={1400} suffix="+" />
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Cellar Labels
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl text-gold block font-semibold">
                  <Counter to={48} suffix="h" />
                </span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Forest to Plate
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Philosophy & Chef Quote (7 cols) */}
          <Reveal variant="right" delay={120} className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
                <span>✦</span>
                <span>The Culinary Philosophy</span>
                <span>✦</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
                Gastronomy Crafted with Reverence, Intimacy, and Soul
              </h2>
            </div>

            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              At Truffles Cafe &amp; Restaurant, dining is not merely sustenance—it is an
              operatic dialogue between nature and culinary technique. Our team meticulously
              preserves old-world Italian pasta craft, paired with the pinnacle of modern
              French precision.
            </p>

            {/* Chef Quote Card */}
            <div className="border-l-2 border-gold pl-6 py-2 space-y-3 bg-white/[0.02] pr-4 rounded-r-lg">
              <p className="font-serif text-base sm:text-lg italic text-zinc-200 leading-relaxed">
                &ldquo;A truffle cannot be forced. It demands patience, humility, and the
                perfect harmony of ingredients to reveal its soul. That is our oath to every
                guest who enters our doors.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold/50">
                  <Image
                    src={unsplash(IMAGES.chefPortrait, 120)}
                    alt="Chef Alessandro Monti"
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-white font-medium block">
                    Chef Alessandro Monti
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Executive Chef &amp; Culinary Director
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:border-gold/30">
                <Award className="w-5 h-5 text-gold shrink-0" />
                <span className="text-xs text-zinc-300 font-light">
                  Daily Shaved Tableside
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:border-gold/30">
                <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                <span className="text-xs text-zinc-300 font-light">
                  Ethically Foraged
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 transition-colors hover:border-gold/30">
                <HeartHandshake className="w-5 h-5 text-gold shrink-0" />
                <span className="text-xs text-zinc-300 font-light">
                  Tailored Dietary Care
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button variant="outline" size="md">
                  Discover Our Heritage &amp; Team
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
