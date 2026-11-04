import PizzaStage from "./pizza/PizzaStage";
import { badgeFont, sans, serif } from "./pizza/fonts";

/** Home-page signature-dishes section: a pinned wheel that turns to the next dish as you scroll. */
export function PizzaWheel() {
  return (
    <section aria-label="Signature dishes" className={`${serif.variable} ${sans.variable} ${badgeFont.variable}`}>
      <PizzaStage />
    </section>
  );
}
