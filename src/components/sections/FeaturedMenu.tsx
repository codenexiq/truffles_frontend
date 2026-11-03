"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MenuCard } from "@/components/cards/MenuCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/motion/Counter";
import { LUXURY_MENU_ITEMS } from "@/data/menuData";
import { Sparkles, ArrowRight } from "lucide-react";
import type { MenuCategory } from "@/types";

const CATEGORY_TABS: { id: "all" | MenuCategory; label: string }[] = [
  { id: "all", label: "Curated Signatures" },
  { id: "starters", label: "Starters & Caviar" },
  { id: "mains", label: "Handmade Pastas & Mains" },
  { id: "desserts", label: "Dolci & Sweets" },
  { id: "beverages", label: "Cellar & Champagne" },
];

export function FeaturedMenu() {
  const [activeCategory, setActiveCategory] = useState<"all" | MenuCategory>("all");

  const filteredItems =
    activeCategory === "all"
      ? LUXURY_MENU_ITEMS.slice(0, 6)
      : LUXURY_MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section className="py-28 bg-page relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.06)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="HAUTE GASTRONOMY"
          title="The Degustation Selections"
          subtitle="Every creation is a tribute to Italian heritage, rare seasonal truffles, and contemporary culinary artistry."
        />

        {/* Category Tabs — the gold pill glides between tabs (shared layout) */}
        <LayoutGroup id="featured-menu-tabs">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] transition-colors duration-300 cursor-pointer border ${
                    isActive
                      ? "border-transparent text-black font-semibold"
                      : "bg-surface text-zinc-400 hover:text-white border-white/5 hover:border-white/15"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="featured-tab-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#e5c378] to-[#aa771c] shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Menu Grid — cards spring in/out and re-flow when the filter changes */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((dish, i) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 20,
                  delay: (i % 3) * 0.08,
                }}
              >
                <MenuCard item={dish} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tasting Menu Highlight Card */}
        <Reveal variant="scale" className="mt-16 rounded-2xl border border-gold/30 bg-gradient-to-r from-surface via-surface to-surface p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Master Degustation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Autumn 9-Course Alba Truffle Tasting Journey
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-light leading-relaxed">
                An orchestration of seven savory courses and two sweet indulgences,
                each finished tableside with shaved seasonal white and black truffles.
                Optional Grand Cru Sommelier pairing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-center sm:text-right">
                <span className="block font-mono text-2xl font-semibold text-gold">
                  <Counter to={195} prefix="$" />
                </span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400">
                  Per Guest • Pairing +$115
                </span>
              </div>
              <Link href="/reservations">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <span>Reserve Tasting</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* View Full Menu CTA */}
        <div className="mt-12 text-center">
          <Link href="/menu">
            <Button variant="outline" size="md">
              View Complete À La Carte Menu
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
