/**
 * Shared, app-wide TypeScript types.
 *
 * Domain-specific types (Product, Order, CartItem, etc.) live alongside
 * their feature once features/ is introduced in later phases (Shop,
 * Product, Cart). This file only holds cross-cutting types used by the
 * global layout, navigation, and site configuration.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Render as a same-page anchor rather than a route change. */
  isAnchor?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "email" | "phone" | "facebook";
}

export interface FooterLinkGroup {
  title: string;
  links: NavItem[];
}

export interface SiteConfig {
  name: string;
  legalName: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  artist: {
    name: string;
    role: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
  };
  socials: SocialLink[];
  nav: NavItem[];
  footerLinks: FooterLinkGroup[];
}
