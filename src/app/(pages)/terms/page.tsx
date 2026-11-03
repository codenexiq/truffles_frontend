import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Terms & Conditions | Truffles Cafe & Restaurant",
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-page min-h-screen relative overflow-hidden">
      <Container className="relative z-10 max-w-4xl">
        <SectionHeading
          badge="SALON PROTOCOL"
          title="Terms of Service & Dining Policy"
          subtitle="Standards of excellence, reservation etiquette, and dining guidelines."
        />

        <div className="luxury-card rounded-2xl p-8 sm:p-12 border border-white/10 space-y-8 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              1. Reservation & Cancellation Policy
            </h3>
            <p>
              To ensure intimate dining and fresh procurement of seasonal Alba truffles,
              we require 48 hours notice for any cancellation or reduction in party size.
              Late cancellations for tasting menus may incur a nominal fee per guest.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              2. Dress Code Standard
            </h3>
            <p>
              We observe a <strong>Smart Elegant</strong> dress code throughout all dining
              salons and private vaults. Gentlemen are requested to wear collared shirts or
              tailored jackets. Athletic wear, hoodies, and beachwear are not permitted.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              3. Corkage & Wine Policy
            </h3>
            <p>
              Guests may bring up to two 750ml bottles per party of wines not currently
              featured on our cellar list. A corkage fee of $75 per bottle applies.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
