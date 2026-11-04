"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Leaf, Search, Star, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { DishCard } from "./DishCard";
import { HighlightsStrip } from "./HighlightsStrip";
import { MENU_ITEMS, MENU_SECTIONS, type MenuSectionId } from "@/data/menuItems";
import { cn } from "@/utils";

const toggleCls = (on: boolean) =>
  cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer",
    on
      ? "border-gold bg-gold/15 text-gold-light"
      : "border-white/10 bg-surface text-zinc-400 hover:border-white/25 hover:text-zinc-100"
  );

export function MenuBrowser({ afterHighlights }: { afterHighlights?: ReactNode }) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [onlyBest, setOnlyBest] = useState(false);
  const [onlyVeg, setOnlyVeg] = useState(false);
  const [active, setActive] = useState<MenuSectionId>(MENU_SECTIONS[0].id);

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

            <HighlightsStrip />
          </Container>
        </section>
      )}

      {/* Slot for the 3D cupcake carousel: directly after the bestsellers strip */}
      {!filtering && <div className="mt-16 sm:mt-24">{afterHighlights}</div>}

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
      <div className="relative overflow-hidden bg-page pb-24 pt-16">
        <motion.div
          className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
          animate={reduce ? undefined : { y: [0, 60, 0], x: [0, 30, 0] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute -right-24 top-2/3 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
          animate={reduce ? undefined : { y: [0, -70, 0], x: [0, -30, 0] }}
          transition={{ duration: 17, ease: "easeInOut", repeat: Infinity }}
          aria-hidden="true"
        />
        <Container className="relative z-10">
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
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative mb-8 flex flex-wrap items-end justify-between gap-3 pb-4"
                >
                  <div>
                    <h2 className="font-serif text-3xl text-zinc-100 sm:text-4xl">{s.title}</h2>
                    <p className="mt-1 text-sm font-light text-zinc-400">{s.blurb}</p>
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={s.dishes.length}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="text-xs uppercase tracking-[0.2em] text-gold"
                    >
                      {s.dishes.length} {s.dishes.length === 1 ? "dish" : "dishes"}
                    </motion.span>
                  </AnimatePresence>
                  {/* gold rule that draws itself under the heading */}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-gold via-gold/40 to-transparent"
                  />
                </motion.div>

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
