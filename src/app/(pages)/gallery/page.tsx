"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { IMAGES, unsplash } from "@/data/images";

interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "salons" | "culinary" | "cellar";
  description: string;
  tag: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Tableside Shaving of Alba White Truffle",
    category: "culinary",
    description:
      "Hand-harvested 48 hours prior, shaved delicate and fragrant over 40-yolk egg tagliatelle.",
    tag: "Tableside Ritual",
    image: IMAGES.truffleShaved,
  },
  {
    id: "gal-2",
    title: "The Grand Velvet Salon",
    category: "salons",
    description:
      "Hand-cut Austrian crystal refracting warm amber light over bespoke velvet dining booths.",
    tag: "Architectural Grandeur",
    image: IMAGES.heroInterior,
  },
  {
    id: "gal-3",
    title: "The Subterranean Sommelier Wine Vault",
    category: "cellar",
    description:
      "Archival Grand Cru Bordeaux, Piedmontese Barolos, and vintage Champagnes resting at 13°C.",
    tag: "Archival Cellar",
    image: IMAGES.wineCellar,
  },
  {
    id: "gal-4",
    title: "Oscietra Royal Caviar on Truffled Brioche",
    category: "culinary",
    description:
      "Golden pearls of royal sturgeon caviar on toasted pain brioche with Périgord black truffle butter.",
    tag: "Haute Cuisine",
    image: IMAGES.platedElegant,
  },
  {
    id: "gal-5",
    title: "The Starlit Terrace & Lounge at Twilight",
    category: "salons",
    description:
      "Heated pergola lounge overlooking the illuminated city skyline, perfect for digestifs.",
    tag: "Evening Ambiance",
    image: IMAGES.interiorWarm,
  },
  {
    id: "gal-6",
    title: "Miyazaki A5 Wagyu Tenderloin",
    category: "culinary",
    description:
      "Binchotan charcoal searing, Périgord black truffle demi-glace, and smoked potato mousseline.",
    tag: "Master Cut",
    image: IMAGES.steak,
  },
];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "salons" | "culinary" | "cellar"
  >("all");

  const filtered =
    activeTab === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="pt-32 pb-24 bg-page min-h-screen relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          badge="VISUAL CHRONICLES"
          title="The Sanctuary in Light & Shadow"
          subtitle="Explore the intimate elegance of our dining salons, archival wine cellar, and the theatrical culinary artistry of our brigade."
        />

        {/* Filters */}
        <AnimatedTabs
          groupId="gallery-tabs"
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
          active={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "all" as const, label: "All Moments" },
            { id: "salons" as const, label: "The Salons & Ambiance" },
            { id: "culinary" as const, label: "Haute Cuisine" },
            { id: "cellar" as const, label: "The Wine Vault" },
          ]}
        />

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.figure
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: (i % 3) * 0.07 }}
                className="theme-dark group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 img-zoom cursor-pointer m-0"
              >
                <Image
                  src={unsplash(item.image, 800)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.25em] text-gold-light bg-black/50 theme-dark backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                  {item.tag}
                </span>

                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-xl text-white font-normal mb-1 group-hover:text-gold-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light leading-relaxed max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {item.description}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </div>
  );
}
