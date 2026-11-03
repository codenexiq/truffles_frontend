"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  CalendarCheck,
  PartyPopper,
  Phone,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const PAGES = [
  {
    href: "/menu",
    title: "Menu",
    text: "Starters, mains, desserts and drinks.",
    icon: UtensilsCrossed,
  },
  {
    href: "/offers",
    title: "Offers",
    text: "Hi-tea, lunch deals and festive menus.",
    icon: Tag,
  },
  {
    href: "/events",
    title: "Events",
    text: "Birthdays, proposals, corporate and more.",
    icon: PartyPopper,
  },
  {
    href: "/reservations",
    title: "Reservations",
    text: "Book your evening on the rooftop.",
    icon: CalendarCheck,
  },
  {
    href: "/blog",
    title: "Blog",
    text: "New dishes, stories and behind the scenes.",
    icon: BookOpen,
  },
  {
    href: "/contact",
    title: "Contact Us",
    text: "Call, WhatsApp or find us in F-10.",
    icon: Phone,
  },
] as const;

export function KeyPages() {
  return (
    <section className="relative overflow-hidden bg-page py-24 sm:py-28">
      <Container className="relative z-10">
        <SectionHeading
          badge="EXPLORE"
          title="Plan Your Visit"
          subtitle="Everything you need, one tap away."
        />

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
          {PAGES.map(({ href, title, text, icon: Icon }) => (
            <StaggerItem key={href} className="h-full">
              <motion.div className="h-full" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                <Link
                  href={href}
                  className="group luxury-card relative flex h-full items-center gap-5 overflow-hidden rounded-2xl p-6 sm:p-7"
                >
                  <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/5 text-gold transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-[#0a0a0c]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block font-serif text-xl text-zinc-100 transition-colors group-hover:text-gold-light">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
                      {text}
                    </span>
                  </span>
                  <ArrowUpRight className="relative h-5 w-5 shrink-0 text-gold opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
