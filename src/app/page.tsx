import { HeroSection } from "@/components/sections/HeroSection";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { Marquee } from "@/components/sections/Marquee";
import { FoodCarousel } from "@/components/sections/FoodCarousel";
import { KeyPages } from "@/components/sections/KeyPages";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Homepage, following "Truffles Restaurant Website Plan" 1.A:
 * hero · rotating promotions · food carousel · key page links ·
 * testimonials · reservation call-to-action.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PromoBanner />
      <Marquee />
      <FoodCarousel />
      <KeyPages />
      <Testimonials />
      <CTASection />
    </>
  );
}
