"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Hero photo that drifts and zooms slowly as you scroll away from the top. */
export function EventsHeroBg({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.18]);

  return (
    <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0">
      <Image src={src} alt="" aria-hidden fill priority sizes="100vw" className="object-cover opacity-40 animate-kenburns" />
    </motion.div>
  );
}
