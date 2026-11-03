"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf, Search, Star, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { DishCard } from "./DishCard";
import { HIGHLIGHTS, MENU_ITEMS, MENU_SECTIONS, type MenuSectionId } from "@/data/menuItems";
import { cn } from "@/utils";

const toggleCls = (on: boolean) =>
  cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer",
    on
      ? "border-gold bg-gold/15 text-gold-light"
      : "border-white/10 bg-surface text-zinc-400 hover:border-white/25 hover:text-zinc-100"
  );

export function MenuBrowser() {
  const [query, setQuery] = useState("");
  const [onlyBest, setOnlyBest] = useState(false);
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [active, setActive] = useState<MenuSectionId>(MENU_SECTIONS[0].id);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const filtering = query.trim() !== "" || onlyBest || onlyVeg;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_ITEMS.filter((d) => {
      if (onlyBest && !d.tags.includes("bestseller")) return false;
      if (onlyVeg && !d.tags.includes("vegetarian")) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.includes(q))
      );
    });
  }, [query, onlyBest, onlyVeg]);

  const sections = MENU_SECTIONS.map((s) => ({
    ...s,
    dishes: visible.filter((d) => d.section === s.id),
  })).filter((s) => s.dishes.length > 0);

  // Highlight the category tab for the section currently on screen
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-menu-section]");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-menu-section") as MenuSectionId);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections.length]);

  const goTo = (id: MenuSectionId) => {
    setActive(id);
    document.getElementById(`menu-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollStrip = (dir: number) =>
    stripRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  const reset = () => {
    setQuery("");
    setOnlyBest(false);
    setOnlyVeg(false);
  };

  return (
    <>
      {/* Bestsellers & specialties */}
      {!filtering && (
        <section className="relative bg-page pt-20 sm:pt-24">
          <Container>
            <SectionHeading
              badge="GUEST FAVOURITES"
              title="Bestsellers & Specialties"
              subtitle="The dishes our guests order again and again, and the ones our kitchen is proudest of."
              className="!mb-10"
            />

            <div className="relative">
              <div
                ref={stripRef}
                className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
              >
                {HIGHLIGHTS.map((d, i) => (
                  <div key={d.id} className="w-[78vw] shrink-0 snap-start sm:w-[320px]">
                    <DishCard dish={d} large index={i} />
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label="Scroll favourites left"
                onClick={() => scrollStrip(-1)}
                className="absolute -left-2 top-1/3 z-10 hidden rounded-full border border-gold/40 bg-surface p-2.5 text-gold shadow-lg transition-colors hover:bg-gold hover:text-[#0a0a0c] lg:block cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Scroll favourites right"
                onClick={() => scrollStrip(1)}
                className="absolute -right-2 top-1/3 z-10 hidden rounded-full border border-gold/40 bg-surface p-2.5 text-gold shadow-lg transition-colors hover:bg-gold hover:text-[#0a0a0c] lg:block cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </Container>
        </section>
      )}

      {/* Sticky: categories + search + filters */}
      <div className="sticky top-[var(--header-h,0px)] z-40 mt-10 border-y border-white/10 bg-page/90 backdrop-blur-xl transition-[top] duration-500">
        <Container className="flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <AnimatedTabs
            groupId="menu-nav"
            className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&>button]:shrink-0 [&>button]:whitespace-nowrap [&::-webkit-scrollbar]:hidden"
            active={active}
            onChange={goTo}
            tabs={MENU_SECTIONS.map((s) => ({ id: s.id, label: s.title }))}
          />

          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu"
                aria-label="Search the menu"
                className="w-full rounded-full border border-white/15 bg-surface py-2.5 pl-10 pr-9 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button type="button" aria-pressed={onlyBest} onClick={() => setOnlyBest((v) => !v)} className={toggleCls(onlyBest)}>
              <Star className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bestsellers</span>
            </button>
            <button type="button" aria-pressed={onlyVeg} onClick={() => setOnlyVeg((v) => !v)} className={toggleCls(onlyVeg)}>
              <Leaf className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Vegetarian</span>
            </button>
          </div>
        </Container>
      </div>

      {/* Menu sections */}
      <div className="relative bg-page pb-24 pt-16">
        <Container>
          <p className="sr-only" role="status" aria-live="polite">
            {visible.length} dishes shown
          </p>

          {/* Plain conditional rendering (no exit animation): wrapping these in
              AnimatePresence broke the list when filters changed while scrolled. */}
          {sections.map((s) => (
              <motion.section
                key={s.id}
                id={`menu-${s.id}`}
                data-menu-section={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="scroll-mt-40 pb-20 last:pb-0"
              >
                <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-serif text-3xl text-zinc-100 sm:text-4xl">{s.title}</h2>
                    <p className="mt-1 text-sm font-light text-zinc-400">{s.blurb}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gold">
                    {s.dishes.length} {s.dishes.length === 1 ? "dish" : "dishes"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {s.dishes.map((d, i) => (
                    <DishCard key={d.id} dish={d} index={i} />
                  ))}
                </div>
              </motion.section>
          ))}

          {sections.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md py-16 text-center"
            >
              <p className="font-serif text-2xl text-zinc-100">No dishes match your search</p>
              <p className="mt-2 text-sm text-zinc-400">Try a different word, or clear the filters.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 rounded-full border border-gold/50 px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-[#0a0a0c] cursor-pointer"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </Container>
      </div>
    </>
  );
}
