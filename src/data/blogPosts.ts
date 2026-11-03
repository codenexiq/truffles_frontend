import { IMAGES } from "./images";

// ============================================
// Blog content.
// Source: "Truffles Restaurant Website Plan", Section 1.E.
//
// The seed posts below use only facts from the plan plus general advice.
// They are a starting point for the marketing team: edit the text, add
// real photos, and add new posts at the TOP of POSTS. Newest first.
//
// Video posts: add a `video` to a post (and a `video` block in its body).
//   { kind: "file", src: "/videos/kitchen.mp4", poster: "/images/..." }
//   { kind: "youtube", id: "dQw4w9WgXcQ" }
// ============================================

export type BlogCategoryId = "menu" | "celebrations" | "videos";

export const BLOG_CATEGORIES: { id: BlogCategoryId; label: string }[] = [
  { id: "menu", label: "Menu & Dishes" },
  { id: "celebrations", label: "Celebrations" },
  { id: "videos", label: "Videos" },
];

export type VideoRef =
  | { kind: "file"; src: string; poster?: string }
  | { kind: "youtube"; id: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; title?: string; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "note"; label?: string; text: string }
  | { type: "pairing"; items: { drink: string; with: string; why: string }[] }
  | { type: "gallery"; images: { src: string; alt: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; video: VideoRef; caption?: string }
  | { type: "cta"; text: string; label: string; href: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  /** ISO date, YYYY-MM-DD */
  date: string;
  author: string;
  cover: string;
  coverAlt: string;
  /** Marks a video post (shows a play badge). */
  video?: VideoRef;
  body: Block[];
}

const TEAM = "The Truffles Team";

export const POSTS: BlogPost[] = [
  {
    slug: "hi-tea-at-truffles-what-to-expect",
    title: "Hi-Tea at Truffles: What to Expect",
    excerpt:
      "From 1st February, afternoons on our rooftop get a new ritual. Here is everything you need to know about the Hi-Tea Special.",
    category: "menu",
    date: "2026-11-03",
    author: TEAM,
    cover: IMAGES.pannaCotta,
    coverAlt: "Strawberry panna cotta served in glass jars",
    body: [
      { type: "p", text: "From 1st February, afternoons at Truffles get a new ritual. Our Hi-Tea Special is served every day of the week, from 3:00 to 6:00 PM, for Rs. 1,995." },
      { type: "h2", text: "Why hi-tea on a rooftop?" },
      { type: "p", text: "There is something about late-afternoon light over Islamabad that makes a slow cup of tea taste better. Hi-tea is built for exactly that: sweet and savoury plates, freshly brewed drinks, and no rush to leave." },
      { type: "gallery", images: [
        { src: IMAGES.pannaCotta, alt: "Strawberry panna cotta" },
        { src: IMAGES.cupcakes, alt: "Cupcakes with cream" },
        { src: IMAGES.bakery, alt: "Fresh bakes on display" },
        { src: IMAGES.pancakes, alt: "Pancakes with honey" },
      ] },
      { type: "list", title: "Good to know", items: [
        "Every day, 3:00 to 6:00 PM",
        "Rs. 1,995, starting 1st February",
        "Truffles Rooftop Restaurant, F-10, Islamabad",
        "Reserve ahead for weekends and larger groups",
      ] },
      { type: "note", label: "Coming soon", text: "The full hi-tea menu is being finalised. We will publish it here and on the Offers page as soon as it is ready." },
      { type: "cta", text: "Planning an afternoon with friends or family?", label: "Reserve Hi-Tea", href: "/reservations?offer=hi-tea" },
    ],
  },
  {
    slug: "how-to-pair-drinks-with-your-meal",
    title: "How to Pair Drinks With Your Meal",
    excerpt:
      "A simple guide to choosing the right drink for what is on your plate, from spicy starters to chocolate desserts.",
    category: "menu",
    date: "2026-10-30",
    author: TEAM,
    cover: "/images/menu/lemon-mint.jpg",
    coverAlt: "A tall glass of lemon and mint cooler",
    body: [
      { type: "p", text: "The right drink can lift a dish, and the wrong one can flatten it. You do not need to be an expert. A few simple ideas will get you most of the way." },
      { type: "h2", text: "Match the weight of the food" },
      { type: "p", text: "Light dishes like salads and starters pair best with light, crisp drinks. Rich, grilled or creamy dishes can handle something with more body or a bitter edge to balance them." },
      { type: "pairing", items: [
        { drink: "Lemon mint cooler", with: "Spicy dishes", why: "Citrus and mint cut through the heat and refresh your palate between bites." },
        { drink: "Iced tea with lime", with: "Grilled meats", why: "A little tannin and a squeeze of lime cleanse the palate so every bite tastes as good as the first." },
        { drink: "Cappuccino", with: "Creamy desserts", why: "The gentle bitterness of coffee balances sweetness and cream." },
        { drink: "Black tea", with: "Chocolate desserts", why: "Tea's dry finish keeps rich chocolate from feeling heavy." },
      ] },
      { type: "h2", text: "When in doubt, ask" },
      { type: "p", text: "Our team is happy to suggest a pairing for whatever you order. Just ask when you sit down." },
      { type: "cta", text: "See what is on the menu.", label: "View the Menu", href: "/menu" },
    ],
  },
  {
    slug: "planning-a-rooftop-proposal-checklist",
    title: "Planning a Rooftop Proposal: A Simple Checklist",
    excerpt:
      "Everything to think through before the big question, from the date to the decor, so the evening goes exactly to plan.",
    category: "celebrations",
    date: "2026-10-27",
    author: TEAM,
    cover: IMAGES.evProposal,
    coverAlt: "Two rings resting on pink roses",
    body: [
      { type: "p", text: "A proposal is a few minutes of an evening you will remember for life, so it helps to plan the rest around it. Here is a simple checklist." },
      { type: "list", title: "Your checklist", items: [
        "Pick the date and time. Think about when your partner is most relaxed.",
        "Contact us early so we can hold your table and talk through the setup.",
        "Choose a decor style. We offer proposal setups with premium decor, customised to you.",
        "Decide who will be there. A private moment, or family and friends nearby?",
        "Plan a way to capture the moment, whether a friend with a camera or a photographer.",
        "Keep the ring somewhere safe, and agree a signal with our team for when to begin.",
      ] },
      { type: "note", label: "Tip", text: "Tell us as much as you can when you enquire: the theme, colours, any special song or message. The more we know, the better the setup." },
      { type: "cta", text: "Ready to start planning?", label: "Plan Your Proposal", href: "/events?type=proposal#enquire" },
    ],
  },
  {
    slug: "valentines-candlelit-dinner-what-to-expect",
    title: "Valentine's Candlelit Dinner: What to Expect",
    excerpt:
      "A special candlelit dinner menu, a setting made for two, and optional decor to make the night even more romantic.",
    category: "celebrations",
    date: "2026-10-24",
    author: TEAM,
    cover: IMAGES.interiorWarm,
    coverAlt: "The dining room at Truffles in warm evening light",
    body: [
      { type: "p", text: "This Valentine's, we are setting the rooftop for two. For one week only, Truffles is serving a special candlelit dinner menu." },
      { type: "list", title: "What is included", items: [
        "A special candlelit dinner menu",
        "Pre-booking through our reservation form, to secure your table",
        "Optional decor add-ons for a romantic setup",
      ] },
      { type: "h2", text: "Make it extra special" },
      { type: "p", text: "If you would like something more, our premium decor add-ons can transform your table into a romantic setting, perfect for a proposal or an anniversary as much as for Valentine's." },
      { type: "note", label: "Book early", text: "Tables for Valentine's tend to go quickly. Pre-book to be sure of yours." },
      { type: "cta", text: "Reserve your table for two.", label: "See the Valentine's Offer", href: "/offers#valentines" },
    ],
  },
  {
    slug: "hosting-your-event-at-truffles",
    title: "Hosting Your Event at Truffles: From Enquiry to Celebration",
    excerpt:
      "Birthdays, anniversaries, bridal showers, Nikkah and more. Here is how planning an event with us works.",
    category: "celebrations",
    date: "2026-10-20",
    author: TEAM,
    cover: IMAGES.evLongTable,
    coverAlt: "A long banquet table set for a celebration",
    body: [
      { type: "p", text: "Truffles is a favourite venue for private and corporate events in F-10. Whatever you are celebrating, planning it with us is simple." },
      { type: "list", title: "Events we host", items: [
        "Birthday parties",
        "Anniversaries",
        "Corporate events",
        "Bridal showers",
        "Proposals",
        "Graduation events",
        "Engagements",
        "Nikkah",
      ] },
      { type: "h2", text: "How it works" },
      { type: "p", text: "Send us an enquiry, or call or WhatsApp us for a quick booking. Tell us the occasion, the date and roughly how many guests, and we will take it from there." },
      { type: "h2", text: "Dine + Decor packages" },
      { type: "p", text: "If you would like a complete setup, our Dine + Decor packages combine dinner with premium decor, customised for your occasion." },
      { type: "cta", text: "Have a date in mind?", label: "Plan Your Event", href: "/events#enquire" },
    ],
  },
  {
    slug: "make-the-most-of-lunch-at-truffles",
    title: "Make the Most of Lunch at Truffles: 20% Off",
    excerpt:
      "Every day from 12:00 to 3:30 PM, enjoy 20% off. Here is how to plan a lunch worth lingering over.",
    category: "menu",
    date: "2026-10-16",
    author: TEAM,
    cover: IMAGES.pasta,
    coverAlt: "A plate of pesto farfalle with cherry tomatoes",
    body: [
      { type: "p", text: "Our lunch offer gives you 20% off between 12:00 and 3:30 PM, every day. It is a limited-time window, so a little planning goes a long way." },
      { type: "list", title: "Tips for a great lunch", items: [
        "Arrive early in the window so you are not racing the clock.",
        "Share a few starters, then choose a main each.",
        "Finish with something sweet. Dessert is worth the extra time.",
        "Booking ahead is a good idea for groups.",
      ] },
      { type: "note", label: "Live countdown", text: "On our Offers page you can see exactly how long is left in today's lunch window." },
      { type: "cta", text: "See the offer and the countdown.", label: "View Lunch Offer", href: "/offers#lunch" },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export const categoryLabel = (id: BlogCategoryId) =>
  BLOG_CATEGORIES.find((c) => c.id === id)?.label ?? "";

/** Roughly 200 words per minute. */
export function readingMinutes(post: BlogPost): number {
  const words = post.body
    .map((b) => {
      switch (b.type) {
        case "p":
        case "h2":
        case "quote":
        case "note":
          return b.text;
        case "list":
          return b.items.join(" ");
        case "pairing":
          return b.items.map((i) => `${i.drink} ${i.with} ${i.why}`).join(" ");
        case "cta":
          return b.text;
        default:
          return "";
      }
    })
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const formatPostDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
