"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { AnimatedTabs } from "@/components/motion/AnimatedTabs";
import { OfferFeature } from "./OfferFeature";
import { OFFER_CATEGORIES, PROMOTIONS, type OfferCategory } from "@/data/promotions";

/** Filter tabs plus the full list of offers. */
export function OffersList() {
  const [category, setCategory] = useState<"all" | OfferCategory>("all");

  const shown =
    category === "all" ? PROMOTIONS : PROMOTIONS.filter((p) => p.category === category);

  return (
    <section className="relative bg-page py-20 sm:py-24">
      <Container>
        <AnimatedTabs
          groupId="offers-tabs"
          className="mb-16 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          active={category}
          onChange={setCategory}
          tabs={OFFER_CATEGORIES}
        />

        <motion.div layout className="space-y-24 sm:space-y-32">
          <AnimatePresence mode="popLayout">
            {shown.map((promo, i) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 140, damping: 20 }}
              >
                <OfferFeature promo={promo} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
