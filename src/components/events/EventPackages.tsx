"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Tag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EVENT_PACKAGES } from "@/data/eventsData";
import { IMAGES } from "@/data/images";
import { EventCardUI } from "./EventCardUI";
import { selectEventType } from "./eventBus";

const PHOTOS: Record<string, string> = {
  birthday: IMAGES.evBirthday2,
  anniversary: IMAGES.evAnniversary2,
  bride: IMAGES.evBridal2,
  graduation: IMAGES.evGraduation,
  proposal: IMAGES.evProposal,
};

export function EventPackages() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-band py-20 sm:py-28">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)]"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      />
      <Container className="relative z-10">
        <SectionHeading
          badge="DINE + DECOR PACKAGES"
          title="Pre-Designed Packages"
          subtitle="Dinner and premium decor in one. Every package can be customised to your theme."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {EVENT_PACKAGES.map((pkg, i) => (
            <EventCardUI
              key={pkg.id}
              index={i}
              image={PHOTOS[pkg.id] ?? IMAGES.evLongTable}
              alt={pkg.title}
              title={pkg.title}
              subtitle="Dine + Decor package"
              bullets={pkg.includes}
              infoA={{ icon: <Tag className="h-5 w-5" />, text: pkg.price ?? "Price on request" }}
              infoB={{ icon: <Check className="h-5 w-5" />, text: `${pkg.includes.length} inclusions` }}
              buttonLabel="Enquire About This Package"
              onClick={() => selectEventType(pkg.occasion)}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 text-center text-sm text-zinc-400"
        >
          Want the full picture?{" "}
          <Link href="/offers#dine-decor" className="text-gold underline-offset-4 hover:text-gold-light hover:underline">
            See the Dine + Decor offer
          </Link>
          .
        </motion.p>
      </Container>
    </section>
  );
}
