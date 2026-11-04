"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Flame, Leaf, MapPin, Sparkles, Star, Tag } from "lucide-react";
import { MENU_SECTIONS, TAG_LABEL, type Dish, type DishTag } from "@/data/menuItems";
import { EventCardUI, type CardBadge } from "@/components/events/EventCardUI";
import { formatPrice } from "@/utils";

const BADGE_FOR: Record<DishTag, Pick<CardBadge, "tone" | "icon">> = {
  bestseller: { tone: "gold", icon: <Star className="h-3 w-3" /> },
  special: { tone: "dark", icon: <Sparkles className="h-3 w-3" /> },
  new: { tone: "sky", icon: undefined },
  vegetarian: { tone: "green", icon: <Leaf className="h-3 w-3" /> },
  spicy: { tone: "red", icon: <Flame className="h-3 w-3" /> },
};

interface DishCardProps {
  dish: Dish;
  /** The highlights strip shows four cards across, so its cards use the compact type size. */
  large?: boolean;
  index?: number;
}

/** A dish, shown as the same white rounded card used on the Events and About pages. */
export function DishCard({ dish, large = false, index = 0 }: DishCardProps) {
  const router = useRouter();
  const section = MENU_SECTIONS.find((s) => s.id === dish.section)?.title ?? "Menu";

  const badges: CardBadge[] = dish.tags.map((t) => ({ label: TAG_LABEL[t], ...BADGE_FOR[t] }));
  // Second fact: a dietary note when there is one, otherwise where it is served.
  const diet = dish.tags.find((t) => t === "vegetarian" || t === "spicy");

  return (
    <motion.div
      initial={large ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      // a little wave across each row of three cards
      variants={{ hidden: {}, show: { transition: { delayChildren: (index % 3) * 0.12 } } }}
      className="h-full"
    >
      <EventCardUI
        index={index}
        image={dish.image}
        alt={dish.name}
        title={dish.name}
        subtitle={dish.description}
        clamp
        compact={large}
        badges={badges}
        infoA={{ icon: <Tag className="h-5 w-5" />, text: dish.price !== undefined ? formatPrice(dish.price) : section }}
        infoB={
          diet
            ? { icon: diet === "spicy" ? <Flame className="h-5 w-5" /> : <Leaf className="h-5 w-5" />, text: TAG_LABEL[diet] }
            : { icon: <MapPin className="h-5 w-5" />, text: large ? "F-10" : "F-10 Rooftop" }
        }
        buttonLabel="Reserve a Table"
        onClick={() => router.push("/reservations")}
      />
    </motion.div>
  );
}
