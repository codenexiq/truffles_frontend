import { IMAGES } from "./images";

// ============================================
// Events page content.
// Source: "Truffles Restaurant Website Plan", Section 1.C.
// Photos are stock placeholders: swap in Truffles' own event photos
// (public/images/events/) and short videos (`video` below) when ready.
// ============================================

export type EventTypeId =
  | "birthday"
  | "anniversary"
  | "corporate"
  | "bridal-shower"
  | "proposal"
  | "graduation"
  | "engagement"
  | "nikkah";

export interface EventType {
  id: EventTypeId;
  title: string;
  /** Singular, for sentences ("a birthday party"). */
  short: string;
  blurb: string;
  image: string;
}

/** The eight event types listed in the plan. */
export const EVENT_TYPES: EventType[] = [
  { id: "birthday", short: "birthday party", title: "Birthday Parties", blurb: "A festive rooftop setup for the guest of honour.", image: IMAGES.evBirthday },
  { id: "anniversary", short: "anniversary celebration", title: "Anniversaries", blurb: "An intimate evening, styled around your story.", image: IMAGES.evAnniversary },
  { id: "corporate", short: "corporate event", title: "Corporate Events", blurb: "Dinners, team celebrations and client evenings.", image: IMAGES.evCorporate },
  { id: "bridal-shower", short: "bridal shower", title: "Bridal Showers", blurb: "A pretty, photo-ready setting for the bride-to-be.", image: IMAGES.evBridal },
  { id: "proposal", short: "proposal", title: "Proposals", blurb: "A private moment, beautifully set up.", image: IMAGES.evProposal },
  { id: "graduation", short: "graduation celebration", title: "Graduation Events", blurb: "Celebrate the milestone with family and friends.", image: IMAGES.evGraduation },
  { id: "engagement", short: "engagement", title: "Engagements", blurb: "Bring both families together over dinner.", image: IMAGES.evEngagement },
  { id: "nikkah", short: "Nikkah", title: "Nikkah", blurb: "A warm, elegant setting for your Nikkah gathering.", image: IMAGES.evNikkah },
];

export const eventTypeTitle = (id: string) =>
  EVENT_TYPES.find((t) => t.id === id)?.title ?? "";

export const eventTypeShort = (id: string) =>
  EVENT_TYPES.find((t) => t.id === id)?.short ?? "";

export interface EventPackage {
  id: string;
  title: string;
  occasion: EventTypeId;
  includes: string[];
  /** Shown as-is, e.g. "Rs. 25,000". Leave undefined until pricing is confirmed. */
  price?: string;
}

/** Dine + Decor packages (plan: "Packages for Birthday, Anniversary, bride to be, grad and Proposal setups"). */
export const EVENT_PACKAGES: EventPackage[] = [
  { id: "birthday", title: "Birthday Package", occasion: "birthday", includes: ["Dinner at Truffles", "Premium decor styling", "Customised to your theme"] },
  { id: "anniversary", title: "Anniversary Package", occasion: "anniversary", includes: ["Dinner at Truffles", "Premium decor styling", "Customised to your story"] },
  { id: "bride", title: "Bride-to-Be Package", occasion: "bridal-shower", includes: ["Dinner at Truffles", "Premium decor styling", "Customised to your theme"] },
  { id: "graduation", title: "Graduation Package", occasion: "graduation", includes: ["Dinner at Truffles", "Premium decor styling", "Customised to your school colours"] },
  { id: "proposal", title: "Proposal Package", occasion: "proposal", includes: ["Dinner at Truffles", "Premium decor styling", "A private, styled setup"] },
];

export interface GalleryItem {
  id: string;
  type: EventTypeId;
  src: string;
  alt: string;
  /** Optional short clip (mp4 in /public/videos). Shows a play button. */
  video?: string;
}

/** Gallery of events. Replace the placeholders with real photos and clips. */
export const EVENT_GALLERY: GalleryItem[] = [
  { id: "g1", type: "birthday", src: IMAGES.evBirthday, alt: "Balloon decor for a birthday party" },
  { id: "g2", type: "anniversary", src: IMAGES.evAnniversary, alt: "A styled anniversary dinner table" },
  { id: "g3", type: "nikkah", src: IMAGES.evNikkah, alt: "A floral aisle set up for a Nikkah" },
  { id: "g4", type: "corporate", src: IMAGES.evCorporate, alt: "A boardroom set up for a corporate event" },
  { id: "g5", type: "bridal-shower", src: IMAGES.evBridal, alt: "A long table styled for a bridal shower" },
  { id: "g6", type: "proposal", src: IMAGES.evProposal, alt: "Rings resting on roses for a proposal" },
  { id: "g7", type: "graduation", src: IMAGES.evGraduation, alt: "A graduate celebrating" },
  { id: "g8", type: "engagement", src: IMAGES.evEngagement, alt: "Decorated chairs for an engagement" },
  { id: "g9", type: "anniversary", src: IMAGES.evAnniversary2, alt: "Table decor with fresh flowers" },
  { id: "g10", type: "birthday", src: IMAGES.evBirthday2, alt: "Confetti at a birthday celebration" },
  { id: "g11", type: "nikkah", src: IMAGES.evNikkah2, alt: "A bride and groom with a bouquet" },
  { id: "g12", type: "bridal-shower", src: IMAGES.evBridal2, alt: "A bridal bouquet" },
  { id: "g13", type: "corporate", src: IMAGES.evCorporate2, alt: "A hall set up for a large corporate gathering" },
  { id: "g14", type: "engagement", src: IMAGES.evLongTable, alt: "A long banquet table for a family gathering" },
];
