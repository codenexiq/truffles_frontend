import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/constants";
import { IMAGES, unsplash } from "@/data/images";
import { Calendar, Phone, Sparkles } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
export function CTASection() {
  return (
    <section className="theme-dark py-28 bg-band relative overflow-hidden border-t border-white/10">
      {/* Cinematic photographic backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src={unsplash(IMAGES.interiorDark, 1800)}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-band/80" />
      </div>
      {/* Background Lighting Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.12)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <Reveal className="max-w-4xl mx-auto rounded-3xl border border-gold/40 bg-gradient-to-b from-surface via-surface to-[#0a0a0c] p-8 sm:p-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden" variant="scale">
          {/* Subtle gold badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-gold/30 bg-[#d4af37]/10 text-gold text-xs uppercase tracking-[0.25em] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BESPOKE HOSPITALITY</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-6">
            A Perfect Evening Overlooking Islamabad
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-10">
            Bring your family, bring your friends, and enjoy a perfect evening
            overlooking Islamabad.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4">
            <Link href="/reservations" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve A Table Online</span>
              </Button>
            </Link>

            {SITE_CONFIG.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>{p.display}</span>
                </Button>
              </a>
            ))}
          </div>

          <p className="mt-8 text-xs text-zinc-400 tracking-wide">
            Truffles Rooftop Restaurant, F-10 Islamabad
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
