import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Privacy Policy | Truffles Cafe & Restaurant",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-page min-h-screen relative overflow-hidden">
      <Container className="relative z-10 max-w-4xl">
        <SectionHeading
          badge="LEGAL & DISCLOSURE"
          title="Privacy Policy"
          subtitle="How we honor and protect your personal information and reservation dossiers."
        />

        <div className="luxury-card rounded-2xl p-8 sm:p-12 border border-white/10 space-y-8 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              1. Information We Collect
            </h3>
            <p>
              When you reserve a table, join the Connoisseur Circle, or communicate
              with our concierge desk, we collect essential details such as your name,
              contact information, dietary preferences, and billing details for guaranteed bookings.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              2. How We Utilize Your Information
            </h3>
            <p>
              Information is used solely to execute your bespoke dining experience,
              coordinate dietary and allergy safeguards, communicate reservation updates,
              and, with your consent, share private cellar releases. We never sell or share
              your information with external third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-white font-normal">
              3. Data Security & Storage
            </h3>
            <p>
              Your personal dossiers and reservation history are protected using
              industry-standard encryption protocols. Payment transactions are processed
              via certified PCI-DSS compliant gateways.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
