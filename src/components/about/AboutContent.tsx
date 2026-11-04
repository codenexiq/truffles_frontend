"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Award, Check, Compass, MapPin, ShieldCheck, Tag, Wine } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/motion/Counter";
import { EventCardUI } from "@/components/events/EventCardUI";
import { IMAGES } from "@/data/images";
import { WideCard } from "./WideCard";

// The wording below is the existing About-page text; only the layout and the small fact labels are new.
const PILLARS = [
  {
    icon: Compass,
    title: "Artisanal Alba Sourcing",
    image: IMAGES.truffleShaved,
    description:
      "We partner exclusively with multi-generational trifolao (truffle hunters) in Piedmont and Umbria, ensuring certified organic harvest and peak aroma.",
    a: "Piedmont & Umbria",
    b: "Certified organic",
  },
  {
    icon: Award,
    title: "Culinary Rigor & Craft",
    image: IMAGES.pasta,
    description:
      "Every single ribbon of pasta is rolled by hand each morning using 40 egg yolks per kilo, replicating the golden standard of Northern Italy.",
    a: "Rolled by hand daily",
    b: "40 yolks per kilo",
  },
  {
    icon: Wine,
    title: "Archival Sommelier Vault",
    image: IMAGES.wineCellar,
    description:
      "A temperature-controlled collection exceeding 1,400 Grand Cru and Premier Cru selections, curated to harmonize with the intense aromatic profile of truffles.",
    a: "1,400+ selections",
    b: "Grand & Premier Cru",
  },
  {
    icon: ShieldCheck,
    title: "Sustainability & Reverence",
    image: IMAGES.rusticSpread,
    description:
      "We honor the forest soil and biodiversity through sustainable foraging practices, ethical butchery, and zero-waste kitchen techniques.",
    a: "Zero-waste kitchen",
    b: "Ethical butchery",
  },
] as const;

const STATS = [
  { to: 2018, suffix: "", plain: true, label: "The vision was born" },
  { to: 1400, suffix: "+", plain: false, label: "Cru selections in the vault" },
  { to: 40, suffix: "", plain: false, label: "Egg yolks per kilo of pasta" },
  { to: 20, suffix: "+", plain: false, label: "Years of fine-dining craft" },
] as const;

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export function AboutContent() {
  const router = useRouter();
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-page pb-24 pt-20 sm:pt-28">
      {/* floating gold glows */}
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
        <SectionHeading
          badge="OUR HERITAGE"
          title="The Symphony of Earth & Elegance"
          subtitle="Born from an obsession with the elusive Alba white truffle, Truffles Cafe & Restaurant was created to be a temple of sensory delight."
        />

        {/* Story */}
        <WideCard
          image={IMAGES.pastaTruffle}
          alt="A creamy truffle risotto"
          pill="The Odyssey"
          title="From the Foggy Forests of Piedmont to Our Dining Salon"
          paragraphs={[
            "In the autumn of 2018, Executive Chef Alessandro Monti spent months walking the oak woodlands of Langhe alongside master truffle hunters and their trained lagotto romagnolo hounds. Witnessing the reverent unearthing of a pristine 800-gram white truffle ignited the vision for what Truffles Cafe & Restaurant is today.",
            "Our mission is singular: to honor this extraordinary gift of nature through uncompromising culinary craft, warm bespoke hospitality, and an atmosphere that transports every guest into an intimate celebration of life.",
          ]}
          facts={["Autumn 2018", "Langhe woodlands", "800-gram white truffle"]}
          buttonLabel="Explore the Menu"
          href="/menu"
        />

        {/* Animated numbers */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="my-16 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={rise}
              whileHover={{ y: -6, scale: 1.03 }}
              className="rounded-[1.6rem] bg-[#ffffff] px-5 py-6 text-center shadow-[0_20px_45px_-26px_rgba(0,0,0,0.5)] ring-1 ring-black/5"
            >
              <p className="font-serif text-4xl font-medium text-[#8a6a1c] sm:text-5xl">
                {s.plain ? <PlainYear to={s.to} /> : <Counter to={s.to} suffix={s.suffix} />}
              </p>
              <p className="mt-2 text-[13px] leading-snug text-[#52525b]">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pillars: the Events-style cards */}
        <SectionHeading badge="OUR PILLARS" title="What We Stand For" subtitle="Four promises behind every plate." />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PILLARS.map((p, i) => (
            <EventCardUI
              key={p.title}
              index={i}
              image={p.image}
              alt={p.title}
              title={p.title}
              subtitle={p.description}
              infoA={{ icon: <Tag className="h-5 w-5" />, text: p.a }}
              infoB={{ icon: <Check className="h-5 w-5" />, text: p.b }}
              buttonLabel="Book a Table"
              onClick={() => router.push("/reservations")}
            />
          ))}
        </motion.div>

        {/* Chef */}
        <div className="mt-16">
          <WideCard
            reverse
            image={IMAGES.chefPlating}
            alt="The chef plating a dish"
            pill="Culinary Leadership"
            title="Chef Alessandro Monti"
            paragraphs={[
              "Alumnus of three-Michelin-starred establishments in Modena and Paris, Chef Monti brings over two decades of fine dining precision to every degustation menu served at Truffles.",
            ]}
            facts={["Two decades of fine dining", "Modena & Paris"]}
            buttonLabel="Taste His Menu"
            href="/menu"
          />
        </div>

        {/* Closing call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center gap-4 text-center"
        >
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <MapPin className="h-4 w-4 text-gold" /> Truffles Rooftop Restaurant, F-10, Islamabad
          </p>
          <Link
            href="/reservations"
            className="relative inline-flex items-center overflow-hidden rounded-sm bg-gradient-to-r from-[#e5c378] via-[#d4af37] to-[#aa771c] px-9 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#0a0a0c] shadow-[0_0_30px_rgba(212,175,55,0.3)] transition hover:brightness-110"
          >
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ left: "-30%" }}
                animate={{ left: ["-30%", "130%"] }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.6 }}
              />
            )}
            <span className="relative">Reserve Your Table With Us</span>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

/** A year counts up too, but without a thousands separator ("2018", not "2,018"). */
function PlainYear({ to }: { to: number }) {
  return <Counter to={to} grouping={false} />;
}
