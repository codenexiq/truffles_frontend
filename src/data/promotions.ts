import { IMAGES } from "./images";

// ============================================
// Promotions: homepage rotating banner AND the /offers page.
// Source: "Truffles Restaurant Website Plan" (Section 1.B).
// Only facts from the plan are used. Anything marked TBC there is `soon: true`
// or carried in `note`, and is shown to guests as "coming soon".
// ============================================

export type OfferCategory = "daily" | "seasonal" | "celebration";

export interface Promotion {
  id: string;
  category: OfferCategory;
  /** Small label above the headline. */
  label: string;
  /** The big number / phrase, e.g. "Rs. 1,995" or "20% Off". */
  highlight: string;
  title: string;
  description: string;
  /** Short facts shown as a list (dates, timings...). */
  details: string[];
  image: string;
  /** Second photo shown under the first one on the offer card. */
  image2: string;
  /** Details still to be confirmed. */
  soon?: boolean;
  /** Overrides the "Available" photo badge for date-bound offers. */
  badge?: string;
  /** What the offer includes. */
  includes?: string[];
  /** Shown under `includes`, e.g. "Full menu coming soon". */
  note?: string;
  /** Extra photos (e.g. the hi-tea setup). */
  gallery?: string[];
  /** Daily time window in Pakistan time; drives the live countdown. */
  liveWindow?: { from: [number, number]; to: [number, number] };
  /** Optional add-on offered on the reservation form. */
  addon?: { label: string; param: string };
  /** Guest review (id from testimonials.ts) shown on the card. Left out while an offer is still coming soon. */
  reviewId?: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: "hi-tea",
    category: "daily",
    label: "Hi-Tea Special",
    highlight: "Rs. 1,995",
    title: "Hi-Tea, every single day",
    description:
      "Sweet, savoury and freshly brewed, served with the view over Islamabad. Bring friends, family or a good book and settle in for the afternoon.",
    details: ["Starting 1st February", "7 days a week · 3:00 – 6:00 PM"],
    badge: "From 1st February",
    image: IMAGES.pannaCotta,
    image2: IMAGES.mintCooler,
    note: "The full hi-tea menu breakdown is coming soon.",
    gallery: [IMAGES.pannaCotta, IMAGES.cupcakes, IMAGES.bakery, IMAGES.pancakes],
    includes: ["Sweet and savoury selections", "Freshly brewed drinks", "Rooftop view over Islamabad"],
    reviewId: "rev-3",
  },
  {
    id: "lunch",
    category: "daily",
    label: "Lunch Time Offer",
    highlight: "20% Off",
    title: "Lunch on the rooftop",
    description:
      "Enjoy 20% off during our lunch window. It is a limited-time offer, so come in before the clock runs out.",
    details: ["Every day · 12:00 – 3:30 PM", "Limited-time offer"],
    image: IMAGES.pasta,
    image2: IMAGES.pastaTruffle,
    note: "The list of discounted dishes is coming soon.",
    liveWindow: { from: [12, 0], to: [15, 30] },
    gallery: [IMAGES.pasta, IMAGES.pizza, IMAGES.steak, IMAGES.platedDark],
    includes: ["20% off during the lunch window", "Every day, 12:00 to 3:30 PM", "Limited-time offer"],
  },
  {
    id: "anniversary",
    category: "seasonal",
    label: "Truffles Anniversary",
    highlight: "30% Off",
    title: "Celebrate with us",
    description:
      "Our anniversary is your treat. Enjoy 30% off on selected items for the day.",
    details: ["24th February", "Selected items at 30% off"],
    badge: "24th February",
    image: IMAGES.dessertCake,
    image2: IMAGES.bakery,
    gallery: [IMAGES.dessertCake, IMAGES.pancakes, IMAGES.cupcakes, IMAGES.pannaCotta],
    includes: ["30% off on selected items", "One day only: 24th February"],
    note: "The list of selected items is coming soon.",
    reviewId: "rev-2",
  },
  {
    id: "valentines",
    category: "seasonal",
    label: "Valentine's Day",
    highlight: "Candlelit Dinner",
    title: "A table for two, by candlelight",
    description:
      "A special candlelit dinner menu in a setting made for two. Pre-book your table to secure your evening.",
    details: ["Available for one week only", "Pre-booking available"],
    badge: "One week only",
    image: IMAGES.interiorWarm,
    image2: IMAGES.dessertCake,
    includes: [
      "Special candlelit dinner menu",
      "Pre-booking through the reservation form",
      "Optional decor add-ons for a romantic setup",
    ],
    addon: { label: "Add premium decor", param: "premium-decor" },
    gallery: [IMAGES.evAnniversary, IMAGES.evProposal, IMAGES.interiorWarm, IMAGES.interiorDark],
    reviewId: "rev-2",
  },
  {
    id: "ramadan",
    category: "seasonal",
    label: "Ramadan",
    highlight: "Iftar Buffet",
    title: "Iftar & Sehri at Truffles",
    description:
      "Break your fast with a full Iftar buffet, with family and friends around the table.",
    details: ["Full buffet menu", "Sehri & Iftar timings to be announced"],
    image: IMAGES.rusticSpread,
    image2: IMAGES.steak,
    soon: true,
    includes: ["Full Iftar buffet menu", "Sehri and Iftar timings"],
    note: "Full menu and timings coming soon.",
    gallery: [IMAGES.rusticSpread, IMAGES.platedDark, IMAGES.bakery, IMAGES.pastaTruffle],
  },
  {
    id: "eid",
    category: "seasonal",
    label: "Eid & Chaand Raat",
    highlight: "Eid Specials",
    title: "Celebrate Eid with the family",
    description:
      "An exclusive Eid menu, family discounts and premium dining experiences for the whole family.",
    details: ["Exclusive Eid menu", "Family discounts"],
    image: IMAGES.dessert,
    image2: IMAGES.pancakes,
    soon: true,
    includes: [
      "Exclusive Eid menu",
      "Family discounts",
      "Premium dining experiences",
    ],
    note: "Eid menu details coming soon.",
    gallery: [IMAGES.dessert, IMAGES.dessertCake, IMAGES.rusticSpread, IMAGES.cupcakes],
  },
  {
    id: "dine-decor",
    category: "celebration",
    label: "Dine + Decor Packages",
    highlight: "3 Deals",
    title: "Your occasion, fully styled",
    description:
      "Dinner and premium decor in one package. We style the setup around your occasion, and you enjoy the evening.",
    details: ["Customisable premium decor", "Pricing on request"],
    image: IMAGES.platedElegant,
    image2: IMAGES.evBirthday2,
    includes: [
      "Birthday setups",
      "Anniversary setups",
      "Bride-to-be celebrations",
      "Graduation celebrations",
      "Proposal setups",
      "Customisation with premium decor",
    ],
    note: "Package pricing is shared on enquiry.",
    gallery: [IMAGES.evBirthday, IMAGES.evBridal, IMAGES.evProposal, IMAGES.evGraduation],
    reviewId: "rev-1",
  },
];

export const OFFER_CATEGORIES: { id: "all" | OfferCategory; label: string }[] = [
  { id: "all", label: "All Offers" },
  { id: "daily", label: "Every Day" },
  { id: "seasonal", label: "Festive & Seasonal" },
  { id: "celebration", label: "Celebrations" },
];

/** Occasion to pre-select on the reservation form for an offer. */
export const OFFER_OCCASION: Record<string, string> = {
  valentines: "Date Night",
  anniversary: "Anniversary",
  "dine-decor": "Celebration",
};

export const findPromotion = (id: string | null | undefined) =>
  PROMOTIONS.find((p) => p.id === id);
