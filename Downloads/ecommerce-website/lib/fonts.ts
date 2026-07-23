import { Fraunces, Inter } from "next/font/google";

/**
 * Fraunces — an editorial, optical-sized serif used for display headings.
 * It carries the warmth and craft feel of premium lifestyle brands
 * (Aesop, Kinfolk, Muuto) without reading as a generic "luxury" font.
 *
 * Inter — a highly legible, neutral grotesk for body copy and UI chrome,
 * so long-form bios and product details stay easy to read at small sizes.
 */
export const fontSerif = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = `${fontSerif.variable} ${fontSans.variable}`;
