import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { ReviewForm } from "./ReviewForm";
import { GUEST_REVIEWS } from "@/data/testimonials";
import { GOOGLE_REVIEWS } from "@/data/googleReviews";

/** Guest stories: curated testimonials, a Google rating (when configured), and a review form. */
export function GuestStories() {
  return (
    <section id="reviews" className="relative scroll-mt-24 overflow-hidden border-t border-white/10 bg-band py-20 sm:py-28">
      <FloatingGlows />
      <Container className="relative z-10">
        <SectionHeading
          badge="GUEST STORIES"
          title="What Our Guests Say"
          subtitle="Real evenings, in our guests' own words. Dined with us? Add yours."
        />

        {GOOGLE_REVIEWS && (
          <Reveal className="mb-12">
            <Link
              href={GOOGLE_REVIEWS.url}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-card mx-auto flex w-fit items-center gap-4 rounded-2xl px-6 py-4 transition-colors hover:border-gold"
            >
              <span className="font-serif text-4xl text-gold-gradient">{GOOGLE_REVIEWS.rating.toFixed(1)}</span>
              <span>
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(GOOGLE_REVIEWS!.rating) ? "fill-[#d4af37] text-gold" : "text-zinc-600"}`}
                    />
                  ))}
                </span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                  {GOOGLE_REVIEWS.count} Google reviews <ExternalLink className="h-3 w-3" />
                </span>
              </span>
            </Link>
          </Reveal>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {GUEST_REVIEWS.map((r, i) => (
            <TestimonialCard key={r.id} testimonial={r} index={i} />
          ))}
        </div>

        <Reveal className="mx-auto mt-14 max-w-2xl">
          <ReviewForm />
        </Reveal>
      </Container>
    </section>
  );
}
