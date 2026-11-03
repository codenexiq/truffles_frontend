// ============================================
// Homepage testimonials.
// PLACEHOLDER TEXT: replace with real guest reviews (Google reviews, DMs,
// event feedback) before launch. Keep `occasion` short.
// ============================================

export interface GuestReview {
  id: string;
  name: string;
  occasion: string;
  rating: number;
  comment: string;
  /** Who wrote it. Influencer and blogger reviews get a badge (plan 1.E). */
  source?: "guest" | "influencer" | "blogger";
  /** Instagram / TikTok / blog handle, for influencer and blogger reviews. */
  handle?: string;
  /** Link to the original post. */
  link?: string;
}

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: "rev-1",
    name: "Ayesha K.",
    occasion: "Birthday dinner",
    rating: 5,
    comment:
      "We booked the rooftop for my sister's birthday and the team made it feel special from the first minute. The decor, the food and the view were all spot on.",
  },
  {
    id: "rev-2",
    name: "Hamza R.",
    occasion: "Anniversary",
    rating: 5,
    comment:
      "A calm, beautiful evening above the city. Service was attentive without hovering, and the desserts were the highlight.",
  },
  {
    id: "rev-3",
    name: "Sana M.",
    occasion: "Hi-Tea with friends",
    rating: 5,
    comment:
      "Perfect for a relaxed afternoon. Great spread, lovely setting, and we stayed far longer than we planned to.",
  },
];
