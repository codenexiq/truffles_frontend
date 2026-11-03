// ============================================
// Site Configuration
// ============================================

export const siteConfig = {
  name: "Truffles Cafe Restaurant",
  description:
    "Experience exquisite dining at Truffles Cafe Restaurant. Fine cuisine, warm ambience, and unforgettable flavors.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://trufflescafe.com",
  ogImage: "/images/og-image.jpg",
  links: {
    instagram: "https://instagram.com/trufflescafe",
    facebook: "https://facebook.com/trufflescafe",
  },
};

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
};

