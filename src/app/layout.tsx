import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SITE_CONFIG } from "@/constants";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | F-10, Islamabad`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Truffles Rooftop Restaurant, F-10 Islamabad. Bring your family, bring your friends, and enjoy a perfect evening overlooking Islamabad. Reservations: 0328-5566992 | 051-8776483.",
  keywords: [
    "Truffles Cafe Restaurant",
    "luxury restaurant",
    "fine dining",
    "michelin star restaurant",
    "Alba truffles",
    "private dining salon",
    "wine cellar",
    "chef tasting menu",
    "gourmet reservations",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — Haute Gastronomy & Truffle Artistry`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the saved/OS theme before first paint. A file (not inline code) so the CSP can forbid inline scripts. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- must block first paint, otherwise the page flashes the wrong theme */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-page text-zinc-100 selection:bg-[#d4af37] selection:text-black">
        <MotionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
