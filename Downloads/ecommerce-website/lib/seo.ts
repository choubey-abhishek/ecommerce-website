import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/products";

/**
 * Builds page-level metadata that inherits site-wide defaults
 * (OpenGraph, Twitter card, canonical base) so every route gets
 * correct social previews without repeating boilerplate.
 */
export function buildMetadata(overrides: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const title = overrides.title
    ? `${overrides.title} — ${siteConfig.name}`
    : siteConfig.title;
  const description = overrides.description ?? siteConfig.description;
  const url = `${siteConfig.url}${overrides.path ?? ""}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: overrides.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 1500 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

/**
 * Schema.org JSON-LD for the artist/studio. Rendered once in the root
 * layout so search engines can associate the site with Kopal Seth as a
 * Person, her studio as an Organization/LocalBusiness-style entity, and
 * her social profiles via `sameAs`. This is the foundation later phases
 * (Product, Collections) will extend with Product/Offer schema.
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    sameAs: siteConfig.socials
      .filter((s) => s.icon === "instagram")
      .map((s) => s.href),
    founder: {
      "@type": "Person",
      name: siteConfig.artist.name,
      jobTitle: siteConfig.artist.role,
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Rhode Island School of Design",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "MS University, Faculty of Fine Arts, Baroda",
        },
      ],
    },
  };
}

/** Schema.org Product/Offer JSON-LD for a single product detail page. */
export function buildProductJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: [siteConfig.url + product.image],
    sku: product.id,
    category: product.category,
    material: product.material,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    },
  };
}
