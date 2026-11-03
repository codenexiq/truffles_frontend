// ============================================
// Google Reviews widget (plan 1.E bonus).
//
// Set this to show Truffles' real Google rating on the Blog page. Leave it
// as `null` and the widget stays hidden, so no rating is ever invented.
//
//   export const GOOGLE_REVIEWS: GoogleReviewsConfig | null = {
//     rating: 4.6,
//     count: 312,
//     url: "https://g.page/r/XXXXXXXX/review", // the "Write a review" or Maps link
//   };
//
// Numbers must be copied from the real Google Business Profile. For a
// live-updating widget we would need the Google Places API and a Place ID.
// ============================================

export interface GoogleReviewsConfig {
  rating: number;
  count: number;
  url: string;
}

export const GOOGLE_REVIEWS: GoogleReviewsConfig | null = null;
