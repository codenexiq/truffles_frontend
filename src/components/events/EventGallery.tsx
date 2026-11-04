"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, MapPin, Play, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { EVENT_GALLERY, EVENT_TYPES, eventTypeTitle, type EventTypeId } from "@/data/eventsData";
import { EventCardUI } from "./EventCardUI";

const subscribe = () => () => {};

export function EventGallery() {
  const [filter, setFilter] = useState<"all" | EventTypeId>("all");
  const [open, setOpen] = useState<number | null>(null);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const items = filter === "all" ? EVENT_GALLERY : EVENT_GALLERY.filter((g) => g.type === filter);
  const usedTypes = new Set(EVENT_GALLERY.map((g) => g.type));
  const tabs = [
    { id: "all" as const, label: "All" },
    ...EVENT_TYPES.filter((t) => usedTypes.has(t.id)).map((t) => ({ id: t.id as EventTypeId, label: t.title })),
  ];

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  // Keyboard + scroll lock while the lightbox is open
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  const current = open !== null ? items[open] : null;

  return (
    <section className="relative overflow-hidden bg-band py-20 sm:py-28">
      <Container>
        <SectionHeading
          badge="EVENT GALLERY"
          title="Moments We've Hosted"
          subtitle="A look at the setups and celebrations on our rooftop."
        />

        <AnimatedTabs
          groupId="event-gallery-tabs"
          className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
          active={filter}
          onChange={(id) => {
            setFilter(id);
            setOpen(null);
          }}
          tabs={tabs}
        />

        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.div
                key={g.id}
                layout
                initial="hidden"
                whileInView="show"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                viewport={{ once: true, amount: 0.12 }}
                // a little wave across each row of four cards
                variants={{ hidden: {}, show: { transition: { delayChildren: (i % 4) * 0.1 } } }}
                className="h-full"
              >
                <EventCardUI
                  index={i}
                  image={g.src}
                  alt={g.alt}
                  title={eventTypeTitle(g.type)}
                  subtitle={g.alt}
                  clamp
                  badges={g.video ? [{ label: "Video", tone: "gold", icon: <Play className="h-3 w-3 fill-current" /> }] : undefined}
                  infoA={{ icon: <Camera className="h-5 w-5" />, text: g.video ? "Video clip" : "Event photo" }}
                  infoB={{ icon: <MapPin className="h-5 w-5" />, text: "F-10 Rooftop" }}
                  buttonLabel={g.video ? "Watch Clip" : "View Photo"}
                  onClick={() => setOpen(i)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Lightbox (photo or short video) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                key="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="Event gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="theme-dark fixed inset-0 z-[90] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md"
                onClick={() => setOpen(null)}
              >
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(null)}
                  className="absolute right-4 top-4 z-10 rounded-full border border-white/25 bg-black/50 p-2.5 text-white transition-colors hover:border-gold hover:text-gold cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous"
                      onClick={(e) => {
                        e.stopPropagation();
                        step(-1);
                      }}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white transition-colors hover:border-gold hover:text-gold cursor-pointer"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next"
                      onClick={(e) => {
                        e.stopPropagation();
                        step(1);
                      }}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white transition-colors hover:border-gold hover:text-gold cursor-pointer"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <AnimatePresence mode="wait">
                  <motion.figure
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative m-0 h-[78vh] w-full max-w-5xl"
                  >
                    {current.video ? (
                      <video src={current.video} controls autoPlay playsInline className="h-full w-full object-contain" />
                    ) : (
                      <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" priority />
                    )}
                    <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-sm text-zinc-300">
                      {current.alt}
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
