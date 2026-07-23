const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Tree-shakes per-icon/per-module instead of pulling in the full
    // barrel file for these two libraries, which are imported from
    // dozens of components across the app (icons in nearly every
    // section, motion primitives in most of them).
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        // Baseline security headers on every route. Deliberately NOT
        // including a Content-Security-Policy here — this app renders
        // inline JSON-LD via dangerouslySetInnerHTML and will eventually
        // load Stripe/Clerk/GA4 scripts, all of which need a properly
        // scoped nonce- or hash-based CSP to avoid breaking. Shipping a
        // half-correct CSP is worse than no CSP; add one deliberately,
        // with real testing against every third-party script in use,
        // before launch rather than copying a generic policy here.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Most /artwork requests go through next/image's own optimizer
        // (which already sets correct cache headers keyed by size/quality),
        // but a few places (OG image, JSON-LD logo, favicon-style refs)
        // link the raw file directly. A one-day cache meaningfully helps
        // repeat visits without the risk of a full year of staleness if
        // these filenames are reused (not renamed) when real photography
        // replaces the current placeholders — see the note in lib/products.ts.
        source: "/artwork/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
