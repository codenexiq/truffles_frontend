"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Cake, Flower2, GraduationCap, Gem, Heart, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EVENT_PACKAGES } from "@/data/eventsData";
import { selectEventType } from "./eventBus";

const ICONS: Record<string, LucideIcon> = {
  birthday: Cake,
  anniversary: Heart,
  bride: Flower2,
  graduation: GraduationCap,
  proposal: Gem,
};

export function EventPackages() {
  return (
    <section className="relative overflow-hidden bg-band py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.07)_0%,_transparent_70%)]" />
      <Container className="relative z-10">
        <SectionHeading
          badge="DINE + DECOR PACKAGES"
          title="Pre-Designed Packages"
          subtitle="Dinner and premium decor in one. Every package can be customised to your theme."
        />

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {EVENT_PACKAGES.map((pkg) => {
            const Icon = ICONS[pkg.id] ?? Gem;
            return (
              <StaggerItem key={pkg.id} className="h-full">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="luxury-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-7"
                >
                  <span className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gold/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-gold transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-5 font-serif text-2xl text-zinc-100">{pkg.title}</h3>

                  <ul className="relative mt-4 flex-1 space-y-2">
                    {pkg.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        {i}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-6 border-t border-white/10 pt-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Package price</p>
                    <p className="mt-1 font-serif text-2xl text-gold-gradient">
                      {pkg.price ?? "On request"}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => selectEventType(pkg.occasion)}
                    >
                      Enquire About This Package
                    </Button>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <p className="mt-10 text-center text-sm text-zinc-400">
          Want the full picture?{" "}
          <Link href="/offers#dine-decor" className="text-gold underline-offset-4 hover:text-gold-light hover:underline">
            See the Dine + Decor offer
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
