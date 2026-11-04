import { Cormorant_Upright, Inter, Open_Sans } from "next/font/google";

// The three fonts of the supplied "Gericht" hero, exposed as CSS variables for the pizza stage.
export const serif = Cormorant_Upright({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--pz-serif", display: "swap" });
export const sans = Open_Sans({ weight: ["400", "600"], subsets: ["latin"], variable: "--pz-sans", display: "swap" });
export const badgeFont = Inter({ weight: "700", subsets: ["latin"], variable: "--pz-badge", display: "swap" });
