"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EVENT_TYPES } from "@/data/eventsData";
import { EventCardUI } from "./EventCardUI";
import { selectEventType } from "./eventBus";

export function EventTypeGrid() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-page py-20 sm:py-28">
      {/* Soft gold glows that float behind the cards */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-gold/15 blur-3xl"
        animate={reduce ? undefined : { y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 13, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        animate={reduce ? undefined : { y: [0, -60, 0], x: [0, -30, 0] }}
        transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <SectionHeading
          badge="EVENTS WE HOST"
          title="A Rooftop for Every Celebration"
          subtitle="Private and corporate events with the Islamabad skyline as the backdrop. Choose your occasion to start planning."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {EVENT_TYPES.map((t, i) => (
            <EventCardUI
              key={t.id}
              index={i}
              image={t.image}
              alt={t.title}
              title={t.title}
              subtitle={t.blurb}
              infoA={{ icon: <Tag className="h-5 w-5" />, text: "Dine + Decor" }}
              infoB={{ icon: <MapPin className="h-5 w-5" />, text: "F-10 Rooftop" }}
              buttonLabel="Plan This Event"
              onClick={() => selectEventType(t.id)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
