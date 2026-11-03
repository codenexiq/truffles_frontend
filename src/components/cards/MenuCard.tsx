import Image from "next/image";
import { formatPrice } from "@/utils";
import type { MenuItem } from "@/types";
import { Sparkles, Wine } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <div className="group relative luxury-card rounded-2xl transition-all duration-500 hover:-translate-y-1.5 overflow-hidden flex flex-col">
      {/* Photography header */}
      {item.image && (
        <div className="img-zoom relative aspect-[16/11] overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {item.isPopular && (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-gold/50 bg-black/55 theme-dark backdrop-blur-sm text-gold-light">
                <Sparkles className="w-2.5 h-2.5" />
                Signature
              </span>
            )}
            {item.isNew && (
              <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-emerald-400/50 bg-black/55 theme-dark backdrop-blur-sm text-emerald-300">
                Seasonal
              </span>
            )}
          </div>

          {/* Price chip */}
          <span className="absolute bottom-3 right-3 font-mono text-base sm:text-lg font-semibold text-[#0a0a0c] bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] px-3 py-1 rounded-full shadow-[0_6px_20px_rgba(212,175,55,0.35)]">
            {formatPrice(item.price)}
          </span>
        </div>
      )}

      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide text-zinc-100 group-hover:text-gold-light transition-colors mb-3">
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-4">
            {item.description}
          </p>
          {item.nutritionInfo && (
            <p className="text-[11px] text-zinc-500 mb-3 font-mono">
              {item.nutritionInfo.calories} kcal • Protein {item.nutritionInfo.protein} • Carbs{" "}
              {item.nutritionInfo.carbs}
            </p>
          )}
        </div>

        {/* Tags and wine pairing */}
        <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-zinc-400 bg-white/[0.03] border border-white/5 px-2.5 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
            {item.allergens && item.allergens.length > 0 && (
              <span className="text-[10px] text-zinc-500 italic py-0.5">
                Contains: {item.allergens.join(", ")}
              </span>
            )}
          </div>

          {item.isPopular && (
            <div className="flex items-center gap-1 text-[11px] text-gold/80">
              <Wine className="w-3 h-3" />
              <span className="italic">Sommelier Paired</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
