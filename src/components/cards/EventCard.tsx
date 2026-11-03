import { formatDate, formatPrice } from "@/utils";
import type { RestaurantEvent } from "@/types";
import { Calendar, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EventCardProps {
  event: RestaurantEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="luxury-card rounded-2xl p-7 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Top Gold Corner Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#d4af37]/15 via-transparent to-transparent pointer-events-none" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gold">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-mono">{formatDate(event.date)}</span>
          </div>
          {event.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-gold/40 bg-[#d4af37]/10 text-gold">
              <Sparkles className="w-2.5 h-2.5" />
              Featured Gala
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl text-white font-normal mb-2 group-hover:text-gold-light transition-colors">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 font-mono">
          <Clock className="w-3.5 h-3.5 text-gold" />
          <span>{event.time}</span>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed mb-6">
          {event.description}
        </p>
      </div>

      <div className="border-t border-white/[0.07] pt-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">
            Entry / Cover
          </span>
          <span className="font-mono text-lg font-semibold text-gold">
            {event.price ? formatPrice(event.price) : "Complimentary"}
          </span>
        </div>
        <Link href="/reservations">
          <Button variant="primary" size="sm">
            Reserve Seat
          </Button>
        </Link>
      </div>
    </div>
  );
}
