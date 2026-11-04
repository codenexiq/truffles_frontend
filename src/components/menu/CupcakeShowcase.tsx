import CupcakeCarousel from "./cupcake/CupcakeCarousel";
import { body, display } from "./cupcake/fonts";
import scope from "./cupcake/scope.module.css";

/** The supplied 3D cupcake carousel, imported unchanged (component, styles, data and images). */
export function CupcakeShowcase() {
  return (
    <section aria-label="Cupcakes" className={`${scope.scope} ${display.variable} ${body.variable}`}>
      <CupcakeCarousel />
    </section>
  );
}
