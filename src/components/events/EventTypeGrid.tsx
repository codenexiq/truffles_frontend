"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Cake,
  Flower2,
  GraduationCap,
  Gem,
  Heart,
  HeartHandshake,
  MoonStar,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EVENT_TYPES, type EventTypeId } from "@/data/eventsData";
import { selectEventType } from "./eventBus";

const ICONS: Record<EventTypeId, LucideIcon> = {
  birthday: Cake,
  anniversary: Heart,
  corporate: Briefcase,
  "bridal-shower": Flower2,
  proposal: Gem,
  graduation: GraduationCap,
  engagement: HeartHandshake,
  nikkah: MoonStar,
};

export function EventTypeGrid() {
  return (
    <section className="relative overflow-hidden bg-page py-20 sm:py-28">
      <Container>
        <SectionHeading
          badge="EVENTS WE HOST"
          title="A Rooftop for Every Celebration"
          subtitle="Private and corporate events with the Islamabad skyline as the backdrop. Choose your occasion to start planning."
        />

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {EVENT_TYPES.map((t) => {
            const Icon = ICONS[t.id];
            return (
              <StaggerItem key={t.id}>
                <motion.button
                  type="button"
                  onClick={() => selectEventType(t.id)}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  aria-label={`Plan ${t.title}`}
                  className="theme-dark group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border border-gold/25 text-left shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8)] outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent transition-colors duration-500 group-hover:from-black/95" />

                  <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-black/45 text-gold backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-[#0a0a0c]">
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="absolute inset-x-0 bottom-0 block p-5">
                    <span className="block font-serif text-xl text-white sm:text-2xl">{t.title}</span>
                    <span className="mt-1 block max-h-0 overflow-hidden text-xs font-light leading-relaxed text-zinc-300 opacity-0 transition-all duration-500 group-hover:max-h-16 group-hover:opacity-100 group-focus-visible:max-h-16 group-focus-visible:opacity-100">
                      {t.blurb}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-gold-light">
                      Plan this event
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </motion.button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
