"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Leaf, Sparkles, Star } from "lucide-react";
import { TAG_LABEL, type Dish, type DishTag } from "@/data/menuItems";
import { formatPrice } from "@/utils";
import { cn } from "@/utils";

const BADGE: Record<DishTag, { cls: string; icon?: typeof Star }> = {
  bestseller: { cls: "border-gold bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] text-[#0a0a0c]", icon: Star },
  special: { cls: "border-gold/60 bg-black/60 text-gold-light", icon: Sparkles },
  new: { cls: "border-sky-300/50 bg-black/60 text-sky-200" },
  vegetarian: { cls: "border-emerald-400/50 bg-black/60 text-emerald-300", icon: Leaf },
  spicy: { cls: "border-red-400/50 bg-black/60 text-red-300", icon: Flame },
};

/** Highlight badges are shown on the photo; vegetarian/spicy as small chips below. */
const PHOTO_TAGS: DishTag[] = ["bestseller", "special", "new"];

interface DishCardProps {
  dish: Dish;
  /** Larger photo, used in the highlights strip. */
  large?: boolean;
  index?: number;
}

export function DishCard({ dish, large = false, index = 0 }: DishCardProps) {
  const photoTags = dish.tags.filter((t) => PHOTO_TAGS.includes(t));
  const chipTags = dish.tags.filter((t) => !PHOTO_TAGS.includes(t));

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 160, damping: 20, delay: (index % 3) * 0.07 }}
      className="luxury-card group relative flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <div className={cn("theme-dark relative overflow-hidden", large ? "aspect-[5/4]" : "aspect-[4/3]")}>
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {photoTags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {photoTags.map((t) => {
              const Icon = BADGE[t].icon;
              return (
                <span
                  key={t}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm",
                    BADGE[t].cls
                  )}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {TAG_LABEL[t]}
                </span>
              );
            })}
          </div>
        )}

        {dish.price !== undefined && (
          <span className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] px-3 py-1 font-mono text-sm font-semibold text-[#0a0a0c] shadow-[0_6px_20px_rgba(212,175,55,0.35)]">
            {formatPrice(dish.price)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-xl text-zinc-100 transition-colors group-hover:text-gold-light sm:text-2xl">
          {dish.name}
        </h3>
        <p className="mt-2 flex-1 text-sm font-light leading-relaxed text-zinc-400">{dish.description}</p>

        {chipTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chipTags.map((t) => {
              const Icon = BADGE[t].icon;
              return (
                <span
                  key={t}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em]",
                    t === "vegetarian" && "border-emerald-500/40 text-emerald-500",
                    t === "spicy" && "border-red-500/40 text-red-500"
                  )}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {TAG_LABEL[t]}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}
