// ============================================
// Luxury photography — served locally from /public/images
// (downloaded so there is no runtime remote fetch; always loads,
//  even offline, and never depends on an external optimizer).
// ============================================

/**
 * Resolve an image source. Accepts a local key path and returns it as-is.
 * Kept as a helper so call sites can stay uniform.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept so existing call sites can still pass a width
export function unsplash(src: string, _w?: number): string {
  return src;
}

const base = "/images";

export const IMAGES = {
  // Hero & atmosphere
  heroInterior: `${base}/heroInterior.jpg`,
  heroDish: `${base}/heroDish.jpg`,
  interiorWarm: `${base}/interiorWarm.jpg`,
  interiorDark: `${base}/interiorDark.jpg`,

  // Story
  truffleShaved: `${base}/truffleShaved.jpg`,
  chefPlating: `${base}/chefPlating.jpg`,
  chefPortrait: `${base}/chefPortrait.jpg`,

  // Cellar & drinks
  wineCellar: `${base}/wineCellar.jpg`,
  wineGlasses: `${base}/wineGlasses.jpg`,

  // Dishes
  platedElegant: `${base}/platedElegant.jpg`,
  rusticSpread: `${base}/rusticSpread.jpg`,
  pasta: `${base}/pasta.jpg`,
  pastaTruffle: `${base}/pastaTruffle.jpg`,
  steak: `${base}/steak.jpg`,
  platedDark: `${base}/platedDark.jpg`,
  chocolate: `${base}/chocolate.jpg`,
  dessert: `${base}/dessert.jpg`,

  // Desserts, hi-tea and drinks (added for the homepage carousel / offers)
  dessertCake: `${base}/dessertCake.jpg`,
  pannaCotta: `${base}/pannaCotta.jpg`,
  cupcakes: `${base}/cupcakes.jpg`,
  pancakes: `${base}/pancakes.jpg`,
  pizza: `${base}/pizza.jpg`,
  mintCooler: `${base}/mintCooler.jpg`,
  bakery: `${base}/bakery.jpg`,

  // Events (stock placeholders until Truffles' own event photos arrive)
  evBirthday: `${base}/events/birthday-balloons.jpg`,
  evBirthday2: `${base}/events/birthday-confetti.jpg`,
  evAnniversary: `${base}/events/anniversary-table.jpg`,
  evAnniversary2: `${base}/events/anniversary-decor.jpg`,
  evCorporate: `${base}/events/corporate-boardroom.jpg`,
  evCorporate2: `${base}/events/corporate-hall.jpg`,
  evBridal: `${base}/events/bridal-table.jpg`,
  evBridal2: `${base}/events/bridal-bouquet.jpg`,
  evProposal: `${base}/events/proposal-rings.jpg`,
  evGraduation: `${base}/events/graduation-cap.jpg`,
  evEngagement: `${base}/events/engagement-chairs.jpg`,
  evNikkah: `${base}/events/nikkah-aisle.jpg`,
  evNikkah2: `${base}/events/nikkah-couple.jpg`,
  evLongTable: `${base}/events/long-table.jpg`,
} as const;
