import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/checkout", "/cart", "/wishlist", "/api", "/admin", "/sign-in", "/sign-up"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
