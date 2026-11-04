import { HeroSection } from "@/components/sections/HeroSection";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { Marquee } from "@/components/sections/Marquee";
import { FoodCarousel } from "@/components/sections/FoodCarousel";
import { KeyPages } from "@/components/sections/KeyPages";
import { PizzaWheel } from "@/components/sections/PizzaWheel";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

/**
 * Homepage, following "Truffles Restaurant Website Plan" 1.A:
 * hero · food carousel ("A Taste of Truffles") · rotating promotions · key page links · pizza wheel ·
 * testimonials · reservation call-to-action.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FoodCarousel />
      <PromoBanner />
      <Marquee />
      <KeyPages />
      <PizzaWheel />
      <Testimonials />
      <CTASection />
    </>
  );
}
