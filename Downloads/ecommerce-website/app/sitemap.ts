import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { products } from "@/lib/products";
import { getPosts } from "@/lib/sanity";

/**
 * Static + catalog sitemap, including every `/shop/[slug]` product page and
 * (when Sanity is configured) every published `/journal/[slug]` post.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/journal`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/shipping-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/return-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms-conditions`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/shop/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Guarded so a Sanity outage or missing config never breaks the sitemap.
  let journalRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    journalRoutes = posts.map((post) => ({
      url: `${siteConfig.url}/journal/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.4,
    }));
  } catch {
    journalRoutes = [];
  }

  return [...staticRoutes, ...productRoutes, ...journalRoutes];
}
