// ============================================
// Truffles Cafe Restaurant - Site Constants
// ============================================

export const SITE_CONFIG = {
  name: "Truffles Rooftop Restaurant",
  shortName: "Truffles Rooftop",
  tagline:
    "Bring your family, bring your friends, and enjoy a perfect evening overlooking Islamabad.",
  description:
    "Truffles Rooftop Restaurant in F-10, Islamabad. Bring your family, bring your friends, and enjoy a perfect evening overlooking Islamabad.",
  url: "https://trufflescafe.com",
  // Placeholder was info@trufflescafe.com (unconfirmed). Set the real address to show it.
  email: "",
  // Primary number (kept for existing `tel:` links) + full list
  phone: "0328-5566992",
  // WhatsApp number (digits only, with country code). Assumes the 0328 mobile
  // is WhatsApp-enabled; change here if bookings use a different number.
  whatsapp: "923285566992",
  phones: [
    { display: "0328-5566992", tel: "+923285566992" },
    { display: "051-8776483", tel: "+92518776483" },
  ],
  address: {
    venue: "Truffles Rooftop Restaurant",
    area: "F-10",
    city: "Islamabad",
    country: "Pakistan",
  },
  // Unconfirmed placeholders were removed so no wrong links show. Add the real
  // profile URLs (Instagram, TikTok and Facebook per the plan) to show them.
  socials: {
    instagram: "",
    tiktok: "",
    facebook: "",
  },

} as const;

/**
 * Set to true once BUSINESS_HOURS below holds Truffles' REAL weekly hours.
 * While false, pages show only the announced lunch / hi-tea windows.
 */
export const HOURS_CONFIRMED = false;

export const BUSINESS_HOURS = [
  { day: "Monday", open: "11:00 AM", close: "10:00 PM", isClosed: false },
  { day: "Tuesday", open: "11:00 AM", close: "10:00 PM", isClosed: false },
  { day: "Wednesday", open: "11:00 AM", close: "10:00 PM", isClosed: false },
  { day: "Thursday", open: "11:00 AM", close: "10:00 PM", isClosed: false },
  { day: "Friday", open: "11:00 AM", close: "11:00 PM", isClosed: false },
  { day: "Saturday", open: "10:00 AM", close: "11:00 PM", isClosed: false },
  { day: "Sunday", open: "10:00 AM", close: "9:00 PM", isClosed: false },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Offers", href: "/offers" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const RESERVATION_TIMES = [
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
] as const;

export const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Date Night",
  "Business Dinner",
  "Family Gathering",
  "Celebration",
  "Other",
] as const;

export const MENU_CATEGORIES = [
  { id: "starters", label: "Starters", icon: "🥗" },
  { id: "mains", label: "Main Course", icon: "🍽️" },
  { id: "desserts", label: "Desserts", icon: "🍰" },
  { id: "beverages", label: "Beverages", icon: "🍷" },
  { id: "specials", label: "Chef's Specials", icon: "⭐" },
  { id: "kids", label: "Kids Menu", icon: "🧒" },
  { id: "sides", label: "Sides", icon: "🥖" },
] as const;

