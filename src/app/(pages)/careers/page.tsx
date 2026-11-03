import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Award, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
export const metadata: Metadata = {
  title: "Careers & Brigade Opportunities | Truffles Cafe & Restaurant",
  description:
    "Join the Michelin-caliber brigade at Truffles Cafe & Restaurant. Explore opportunities across culinary, sommelier, and guest relations.",
};

const POSITIONS = [
  {
    title: "Chef de Partie (Handmade Pasta & Sauté)",
    department: "Culinary Brigade",
    type: "Full-Time • Evening Service",
    description:
      "Looking for an experienced pasta specialist with mastery over egg dough, extruded shapes, and emulsion finishing with Alba and Norcia truffles.",
  },
  {
    title: "Assistant Sommelier / Cellar Master",
    department: "Wine & Beverage",
    type: "Full-Time",
    description:
      "Join our cellar team managing 1,400+ vintage labels. Requires deep knowledge of Piedmont, Tuscany, Bordeaux, and vintage Champagne pairings.",
  },
  {
    title: "Maître d'Hôtel & Front-of-House Captain",
    department: "Guest Relations",
    type: "Full-Time",
    description:
      "Lead evening salon service, VIP protocol, tableside truffle shaving ceremonies, and guest dietary bespoke care.",
  },
];

export default function CareersPage() {
  return (
    <div className="pt-32 pb-24 bg-page min-h-screen relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <Container className="relative z-10 max-w-5xl">
        <SectionHeading
          badge="JOIN OUR BRIGADE"
          title="The Pursuit of Gastronomic Perfection"
          subtitle="We are seeking passionate culinarians, hospitality artisans, and wine professionals committed to Michelin-caliber standards."
        />

        <div className="space-y-6 mb-16">
          {POSITIONS.map((pos, idx) => (
            <Reveal
              key={idx}
              className="luxury-card rounded-2xl p-7 sm:p-9 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:-translate-y-1 transition-all"
             variant="left" delay={idx * 110}>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border border-gold/40 bg-[#d4af37]/10 text-gold font-medium">
                    {pos.department}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {pos.type}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-white font-normal group-hover:text-gold-light transition-colors">
                  {pos.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-2xl leading-relaxed">
                  {pos.description}
                </p>
              </div>

              <Link href="/contact" className="shrink-0">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Culture Card */}
        <div className="rounded-2xl border border-white/5 bg-surface p-8 sm:p-10 text-center space-y-4">
          <Award className="w-8 h-8 text-gold mx-auto" />
          <h4 className="font-serif text-2xl text-white font-normal">
            A Culture of Mentorship & Craft
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
            Our team members receive competitive compensation, comprehensive health benefits,
            annual harvest trips to Piedmont, and sommelier scholarship stipends.
          </p>
        </div>
      </Container>
    </div>
  );
}
