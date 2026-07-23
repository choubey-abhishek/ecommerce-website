import type { SiteConfig } from "@/types";

/**
 * Resolves the deployed origin so canonical URLs, OG tags, JSON-LD, the
 * sitemap, and — most importantly — Stripe's `success_url`/`cancel_url`
 * (services/checkout.ts) all point somewhere real no matter where this is
 * running:
 *   1. `NEXT_PUBLIC_SITE_URL`, if explicitly set — use this in Vercel's
 *      Production environment for the real custom domain.
 *   2. `VERCEL_URL`, which Vercel injects automatically on every preview
 *      deployment — without this, testing checkout on a preview branch
 *      would redirect back to the live production domain instead of the
 *      preview itself.
 *   3. The hardcoded production domain, for local dev with no env set.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://www.kopalseth.com";
}

/**
 * Single source of truth for brand identity, contact information, and
 * navigation structure. Every component that needs a nav link, social
 * URL, or contact detail should read from here rather than hardcoding
 * strings — this is what keeps the footer, navbar, JSON-LD schema, and
 * metadata in sync as the business details evolve.
 */
export const siteConfig: SiteConfig = {
  name: "Kopal Seth Studio",
  legalName: "Kopal Seth Studio",
  title: "Kopal Seth Studio — Contemporary Ceramics & Clay Art",
  description:
    "Kopal Seth is a contemporary ceramic artist (MFA, Rhode Island School of Design) creating hand-built and thrown vessels, sculptural works, and tableware. Shop originals, explore the studio process, and read about exhibitions across India and the United States.",
  url: resolveSiteUrl(),
  ogImage: "/1.avif",
  artist: {
    name: "Kopal Seth",
    role: "Contemporary Ceramic Artist",
  },
  contact: {
    email: "kopalsethstudio@gmail.com",
    phone: "+9193436330966",
    phoneDisplay: "+91 93436330966",
  },
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/kopalseth_studio/",
      icon: "instagram",
    },
    {
      label: "Email",
      href: "mailto:kopalsethstudio@gmail.com",
      icon: "email",
    },
    {
      label: "Phone",
      href: "tel:+9193436330966",
      icon: "phone",
    },
  ],
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Exhibitions", href: "/about#exhibitions", isAnchor: true },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: [
    {
      title: "Shop",
      links: [
        { label: "All Works", href: "/shop" },
        { label: "New Arrivals", href: "/shop?sort=newest" },
        { label: "Sold Archive", href: "/shop/archive" },
      ],
    },
    {
      title: "Studio",
      links: [
        { label: "About the Artist", href: "/about" },
        { label: "Exhibitions", href: "/about#exhibitions" },
        { label: "Press", href: "/about#press" },
        { label: "Journal", href: "/journal" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Return Policy", href: "/return-policy" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms-conditions" },
      ],
    },
  ],
};
