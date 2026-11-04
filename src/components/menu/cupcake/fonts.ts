import { Galada, Manrope } from "next/font/google";

// The two fonts of the supplied carousel, exposed as the CSS variables its stylesheet expects.
export const display = Galada({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
export const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
