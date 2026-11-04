import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FloatingGlows } from "@/components/motion/FloatingGlows";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { GUEST_REVIEWS } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-24 sm:py-28 bg-band relative overflow-hidden border-t border-white/5">
      {/* Soft gold glows that drift slowly behind the cards */}
      <FloatingGlows />

      <Container className="relative z-10">
        <SectionHeading
          badge="GUEST LOVE"
          title="Loved by Our Guests"
          subtitle="Birthdays, anniversaries, hi-tea afternoons and everything in between."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {GUEST_REVIEWS.map((review, i) => (
            <TestimonialCard key={review.id} testimonial={review} index={i} />
          ))}
        </div>

        <Reveal variant="up" className="mt-14 text-center">
          <p className="text-sm text-zinc-400">
            Dined with us?{" "}
            <Link
              href="/contact"
              className="text-gold underline-offset-4 hover:underline hover:text-gold-light transition-colors"
            >
              We&apos;d love to hear from you.
            </Link>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
