import type { GuestReview } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  testimonial: GuestReview;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="luxury-card rounded-xl p-7 sm:p-8 h-full flex flex-col justify-between relative group transition-all duration-300 hover:-translate-y-1">
      {/* Decorative quotation mark */}
      <div className="absolute top-6 right-6 opacity-10 text-gold group-hover:opacity-20 transition-opacity">
        <Quote className="w-10 h-10" />
      </div>

      <div>
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < testimonial.rating ? "text-gold fill-[#d4af37]" : "text-zinc-700"
              }`}
            />
          ))}
        </div>

        <p className="font-serif text-sm sm:text-base text-zinc-200 italic font-light leading-relaxed mb-6">
          &ldquo;{testimonial.comment}&rdquo;
        </p>
      </div>

      <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#d4af37]/30 to-[#aa771c]/10 border border-gold/40 flex items-center justify-center text-xs font-serif text-gold-light">
            {initials}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-medium text-white tracking-wide truncate">
              {testimonial.name}
            </h4>
            {testimonial.source && testimonial.source !== "guest" && (
              <p className="mt-0.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-gold">
                <span className="rounded-full border border-gold/40 px-1.5 py-px">{testimonial.source}</span>
                {testimonial.handle &&
                  (testimonial.link ? (
                    <a href={testimonial.link} target="_blank" rel="noopener noreferrer" className="truncate normal-case tracking-normal underline-offset-2 hover:underline">
                      {testimonial.handle}
                    </a>
                  ) : (
                    <span className="truncate normal-case tracking-normal">{testimonial.handle}</span>
                  ))}
              </p>
            )}
          </div>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-gold">
          {testimonial.occasion}
        </span>
      </div>
    </div>
  );
}
