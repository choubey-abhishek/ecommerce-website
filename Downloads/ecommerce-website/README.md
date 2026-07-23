# Kopal Seth Studio

A premium, editorial e-commerce site for ceramic artist Kopal Seth. Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion, architected to grow into the full commerce platform (auth, cart, checkout, CMS, admin) without a rewrite.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run typecheck` runs a strict TypeScript pass; `npm run lint` runs ESLint.

## Testing

- `npm test` — unit + component tests (Vitest + React Testing Library), run once.
- `npm run test:watch` — the same suite in watch mode while developing.
- `npm run test:coverage` — the same suite with a coverage report written to `coverage/`.
- `npm run test:e2e` — Playwright end-to-end tests against a running app (`npm run dev` starts one automatically if none is already running; use `npm run test:e2e:ui` to step through them interactively).

Unit/component tests live in `tests/` (`tests/unit/` for pure logic — `lib/products.ts`'s query engine, coupons, shipping — and `tests/components/` for React components and the `CartContext` hook). End-to-end specs live in `e2e/` and cover the flows that matter most on a commerce site: browsing/searching/filtering the shop, viewing a product and adding it to the cart, and getting from the cart drawer through to checkout. `.github/workflows/ci.yml` runs lint + typecheck + unit tests on every push/PR, and a separate job builds the app and runs the Playwright suite against it — deliberately without any Clerk/Stripe/Sanity secrets configured, since proving the site degrades gracefully without them is exactly what Phases 5–9 were built to guarantee.

## Performance

- `npm run analyze` builds the app with `@next/bundle-analyzer` enabled and opens a treemap of what's actually in each JS chunk — the best way to sanity-check any future dependency addition before it ships.
- Optional Core Web Vitals capture: with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set (and a GA4 `gtag.js` script loaded — this repo wires the *reporting hook*, not the script tag itself, since that belongs with whichever analytics phase adds GA4/GTM/Clarity together), `components/WebVitals.tsx` forwards CLS/LCP/INP/etc. to GA4. Without it, the same metrics still log to the browser console in development — nothing is silently dropped.
- Code-splitting: the cart drawer, product image lightbox, mobile shop filter sheet, and every below-the-fold homepage section (testimonials, Instagram grid, newsletter form) load via `next/dynamic` instead of the initial bundle. The lightbox and filter sheet use `ssr: false` since their content duplicates something already visible; the homepage sections deliberately don't, so their content, and SEO value, are unaffected.
- `next.config.js` sets `experimental.optimizePackageImports` for `lucide-react` and `framer-motion` (both imported from dozens of components) and a one-day cache header for directly-linked `/artwork` files.
- Route-level `loading.tsx` skeletons (`/shop`, `/shop/[slug]`, `/journal`, `/journal/[slug]`) keep navigation feeling instant while a segment streams in; `/journal*` also sets `revalidate = 300` so Sanity content refreshes every 5 minutes without hitting the CMS on every request.

## Deployment

See **`DEPLOYMENT.md`** for the full walkthrough — connecting the repo to Vercel, every environment variable and which Vercel environment it belongs in, the Prisma migration command, pointing the Stripe webhook at the live domain, Clerk/Sanity setup, and a post-deploy verification checklist (including the `/api/health` endpoint added in Phase 12).

**Optional — enable accounts:** copy `.env.local.example` to `.env.local` and fill in a free [Clerk](https://dashboard.clerk.com) publishable + secret key to turn on Sign In/Sign Up and `/account`. Without them, the site runs exactly the same except those specific pages show a "not configured yet" message instead of erroring — nothing else on the site depends on Clerk.

**Optional — enable real payments:** add a [Stripe](https://dashboard.stripe.com) test-mode `STRIPE_SECRET_KEY` (and `STRIPE_WEBHOOK_SECRET` if testing webhooks with the Stripe CLI) to the same `.env.local` to turn on "Pay with Card" at `/checkout`. Without it, checkout falls back to a real "email this order to the studio" flow instead of a dead button.

**Optional — enable the admin dashboard:** with Clerk configured, add your own email to `ADMIN_EMAILS` in `.env.local`, sign in with that account, then visit `/admin`. Anyone else who's signed in sees an access-restricted message, not the dashboard.

**Optional — persist orders to a database:** add a `DATABASE_URL` (any PostgreSQL instance) to `.env.local`, then run `npm run db:migrate` to create the `Order`/`OrderItem` tables. Once set, the Stripe webhook writes a real, idempotent order row for every completed checkout in addition to what's visible in Stripe's own dashboard. Without it, Stripe's dashboard remains the only order record — nothing breaks, it just doesn't persist locally.

**Optional — enable the Journal:** create a free [Sanity](https://www.sanity.io/) project with a `post` document type (schema documented in `lib/sanity.ts`), then add `NEXT_PUBLIC_SANITY_PROJECT_ID` (and `NEXT_PUBLIC_SANITY_DATASET`, default `production`) to `.env.local`. `/journal` and `/admin/blog` then read real published posts. Without it, `/journal` shows an honest "coming soon" state instead of an empty or broken page.

## Where things live

```
app/                  routes (App Router) — home, shop (+ archive, [slug]), cart, checkout
                      (+ success/cancel), about, journal (+ [slug]), legal pages, sign-in/sign-up,
                      account (+ orders/addresses), wishlist, admin/*, sitemap/robots, not-found,
                      error/global-error (branded error boundaries), api/webhooks/stripe,
                      api/health
components/
  ui/                 generic, reusable primitives (Button, Container, Checkbox, Slider, Accordion)
  layout/             site chrome (Navbar, Footer, LegalPageLayout)
  home/               home-page-only sections (ProductRail, BestSellers, StudioStory,
                      FeaturedExhibition, ShopByCollection, Testimonials, InstagramFeed,
                      NewsletterSignup)
  (root)              shared page components pending a feature-folder move (Hero, ProductCard,
                      ProductGrid — currently unused, see comment in the file, CartDrawer
                      (lazily-loaded, see Performance below), WishlistView, AboutSection,
                      HomeFeatured, HomeAboutTeaser, PageTransition, WebVitals,
                      ShopResultsSkeleton)
features/
  shop/               Shop page domain logic — use-shop-filters.ts (URL-synced filter state) +
                      components/ (toolbar, sidebar filters, lazily-loaded mobile filter sheet,
                      results grid, page shell)
  product/            Product Details domain logic — components/ (gallery w/ zoom, lazily-loaded
                      lightbox, info panel w/ accordion, social share)
  cart/               Cart/Checkout domain logic — components/ (full cart page view, order
                      summary, coupon form, Stripe/email checkout view, clear-cart-on-mount)
context/              CartContext (localStorage-backed cart w/ coupon + shipping-estimate
                      totals) + WishlistContext (localStorage-backed — see the file for why
                      neither is account-synced yet)
lib/                  fonts.ts (next/font config), seo.ts (metadata + JSON-LD builders, incl.
                      per-product Product/Offer schema), products.ts (catalog data + query/
                      recommendation helpers — still static, see "Not yet wired" below),
                      auth-config.ts (isClerkConfigured guard), stripe.ts (isStripeConfigured
                      guard + lazy client), coupons.ts + shipping.ts (MVP discount/shipping-estimate
                      logic), db.ts (isDatabaseConfigured guard + Prisma singleton), sanity.ts
                      (isSanityConfigured guard + lazy client, Journal post fetchers)
services/             newsletter.ts + checkout.ts + orders.ts (createOrderFromStripeSession,
                      idempotent upsert keyed on the Stripe session id) — Server Actions/helpers;
                      cloudinary.ts lands in a later phase
prisma/               schema.prisma — Order/OrderItem models only (the product catalog stays in
                      lib/products.ts for now, see "Not yet wired")
utils/                cn(), formatCurrency(), truncate(), slugify() — pure helpers, no React
animations/           variants.ts — every Framer Motion variant used site-wide, one source of truth
hooks/                use-media-query.ts (incl. pointer/reduced-motion checks), use-scroll-lock.ts
config/               site.ts (brand/contact/nav), testimonials.ts (sample content, see below)
types/                shared TypeScript interfaces
public/artwork/       placeholder SVG imagery — replace with real photography before launch
middleware.ts         Clerk route protection for /account and /admin (excludes /api/webhooks) —
                      a no-op passthrough until Clerk is configured
tests/                Vitest unit tests (tests/unit/) + component/hook tests (tests/components/),
                      plus tests/setup.ts (jsdom mocks shared by every test file)
e2e/                  Playwright end-to-end specs (home, shop, product detail, cart → checkout)
```

`app/admin/` (Dashboard, Orders, Products, Collections, Inventory, Coupons, Customers, Analytics, Blog, Media) is gated by `lib/auth-config.ts#isAdminEmail` — a plain email allowlist, since there's no roles table yet. `components/admin/` holds the two shared pieces every admin page uses: `stat-card.tsx` and `data-table.tsx`.

## Design system

- **Palette:** pure white background, near-black ink text, and an expanded warm accent set — beige, clay, sand, cream, stone, terracotta, olive (see `tailwind.config.ts`).
- **Type:** Fraunces (serif, editorial display headings) + Inter (sans, body copy and UI chrome) — loaded via `next/font/google` in `lib/fonts.ts`.
- **Motion:** centralized in `animations/variants.ts` — hero word-by-word text reveal + parallax, scroll-triggered stagger fade-ups on every grid, hover-scale + overlay on artwork, a magnetic primary CTA button, a hover-magnify + click-to-lightbox product gallery, an auto-advancing testimonial carousel, a slide-out cart drawer, and route transitions (`components/PageTransition.tsx`).
- **Accessibility:** visible focus rings, a skip-to-content link, `aria-current` on active nav links, accessible Radix primitives throughout (Dialog, Slider, Checkbox, Accordion), and `aria-live` on the testimonial carousel.
- **SEO:** per-page metadata via `lib/seo.ts#buildMetadata` (canonical URLs, OpenGraph, Twitter cards), Organization/Person JSON-LD sitewide plus Product/Offer JSON-LD on every product page, `app/sitemap.ts`, and `app/robots.ts`.

## Phase status

**Phase 1 — Architecture & shell (done):** folder structure, dependencies, Tailwind theme, global styles, fonts, root layout, navigation, footer, and the four legal pages the footer links to.

**Phase 2 — Home Page (done):** Hero, Featured Collection, Best Sellers, Artist Introduction, Studio Story, Featured Exhibition, Shop by Collection, Testimonials, Instagram feed, and a working Newsletter signup (React Hook Form + Zod, submitting through a real Server Action in `services/newsletter.ts`).

**Phase 3 — Shop (done):** `features/shop/` — free-text search, sort, a category + price-range (Radix Slider) + availability filter panel (sidebar on desktop, slide-in sheet on mobile), all URL-synced, plus an infinite-scroll results grid with an accessible "Load More" fallback.

**Phase 4 — Product Details (done):** `app/shop/[slug]` — multi-image gallery with hover-magnify zoom and a full-screen lightbox, dimensions/material/weight/availability, Add to Cart, Buy Now (adds to cart + opens the drawer until Stripe Checkout exists), a localStorage-backed Wishlist toggle, working social share (native share sheet, Facebook, Pinterest, copy link — no API keys needed), an accordion for Story/Shipping/Care, a Certificate of Authenticity note, a "You May Also Like" rail, Product/Offer JSON-LD, and a branded 404 page for bad slugs.

**Phase 5 — Authentication (done):** Clerk-powered Sign In/Sign Up (`app/sign-in`, `app/sign-up`), a protected `/account` shell (Profile via Clerk's embedded `<UserProfile>`, Orders and Addresses with honest empty states since Checkout doesn't exist yet), `middleware.ts` guarding `/account(.*)`, and a `UserButton`/sign-in link in the navbar. A standalone, non-gated `/wishlist` page now renders real saved pieces from `WishlistContext`. **Crucially, all of this degrades gracefully without Clerk keys** — see `lib/auth-config.ts` and the note under Getting Started — so the rest of the site (Home, Shop, Product, Cart) is completely unaffected if accounts are never configured.

**Phase 6 — Cart (done):** the cart now persists to localStorage across reloads, supports real (if hard-coded) coupon codes via `lib/coupons.ts` (`WELCOME10`, `STUDIO25`), a domestic/international shipping estimate via `lib/shipping.ts`, and a dedicated `/cart` page alongside the existing drawer. "Checkout" now goes somewhere real: `/checkout` shows the order summary and a prefilled "email this order to the studio" link — a genuine way to buy today — rather than a dead button or a fake payment form, until Stripe Checkout lands in Phase 7.

**Phase 7 — Checkout (done):** `/checkout` now offers real Stripe Checkout ("Pay with Card", building a hosted Session with line items, the shipping estimate, and any applied coupon converted to a one-time Stripe coupon) whenever `STRIPE_SECRET_KEY` is set, with the email-order flow kept as an always-available alternative. `/checkout/success` verifies the session server-side before showing a real order reference/amount and clearing the cart; `/checkout/cancel` reassures the buyer nothing was charged and their bag is intact. `app/api/webhooks/stripe` verifies Stripe's signature and logs `checkout.session.completed` — the exact spot a real Order write goes once Phase 9's database exists.

**Phase 8 — Admin Dashboard (done):** `/admin`, gated by an email allowlist (`ADMIN_EMAILS`) on top of Clerk auth. Dashboard, Products, Collections, Inventory, and Coupons are real, read-only views over the site's actual data files (nothing fabricated). Orders and Customers show live data straight from Stripe and Clerk when those are configured, and an honest "connect X to see this" state otherwise. Analytics deliberately shows zero invented traffic numbers — just the two real figures we can derive (available/sold catalog value) plus a clear note that GA4 populates the rest in Phase 11. Blog and Media are honest "arrives with the CMS in Phase 9" placeholders, not fake content.

**Phase 9 — CMS Integration (done):** two independent, gracefully-degrading integrations. First, `prisma/schema.prisma` (Order/OrderItem only — the product catalog deliberately stays static in `lib/products.ts`; migrating it is future work that needs a real database to test against) plus `lib/db.ts`; the Stripe webhook now calls `services/orders.ts#createOrderFromStripeSession` to idempotently persist every paid order when `DATABASE_URL` is set, and `/admin/orders` notes when a row is also in the database. Second, `lib/sanity.ts` wraps a `post` content type (schema documented in the file) behind `isSanityConfigured`: `/journal` lists published posts (or an honest "coming soon" state), `/journal/[slug]` renders full posts via Portable Text with Product/Offer-style JSON-LD-free metadata, `/admin/blog` shows a live, read-only post table with a link out to Sanity Studio, and `app/sitemap.ts` includes published post URLs (wrapped in try/catch so a Sanity outage can't break the sitemap).

**Phase 10 — Testing (done):** `vitest.config.ts` + `tests/setup.ts` (jsdom, `@testing-library/jest-dom` matchers, matchMedia/IntersectionObserver/ResizeObserver mocks, a `next/image` stub) power unit tests over the pure logic that's easiest to get subtly wrong — `queryProducts()`'s search/filter/sort combinations, `applyCoupon()`'s validation and threshold rules, `getShippingEstimate()`'s free-shipping cutoff — plus component tests for `Button` (including the `asChild` + `magnetic` combination that was previously a manually-caught bug), `ProductCard`, and `CartContext` (add/remove/update quantity/coupon/localStorage persistence, exercised via `renderHook`). `playwright.config.ts` + `e2e/` cover the browser-only flows: home → shop navigation, search/filter/sort, product detail → add to cart, and cart drawer → full cart page → checkout, run across Chromium, WebKit, and a mobile viewport. `.github/workflows/ci.yml` wires both suites into CI. See "Testing" above for the commands.

**Phase 11 — Performance Optimization (done):** `next.config.js` gained `optimizePackageImports` for the two most-imported client libraries, a bundle analyzer behind `npm run analyze`, and cache headers for direct `/artwork` links. The cart drawer, product lightbox, mobile shop filter sheet, and every below-the-fold homepage section now load via `next/dynamic` instead of the shared bundle (see "Performance" above for which use `ssr: false` and why). `/shop`, `/shop/[slug]`, `/journal`, and `/journal/[slug]` all gained route-level `loading.tsx` skeletons, and the Journal routes gained a 5-minute `revalidate` window. `components/WebVitals.tsx` captures real Core Web Vitals — logged to the console in development, optionally forwarded to GA4 in production once `NEXT_PUBLIC_GA_MEASUREMENT_ID` and a `gtag.js` script are both present.

**Not yet wired (by design, arrives in later phases):** Payload as a Sanity alternative, Cloudinary, the GA4/GTM `gtag.js` script tag itself and GTM/Clarity more broadly (Web Vitals reporting is ready for GA4 the moment that script exists — see "Performance" above), real dynamic tax calculation (Stripe Tax needs to be enabled on the account), a live Instagram embed, and migrating the static product catalog itself into the database.

## Phase 12 — Deployment (done)

Vercel-native, since nothing else is required for a standard Next.js App Router project — see **`DEPLOYMENT.md`** for the full step-by-step (env vars, database migration, Stripe webhook, Clerk domains, Sanity CORS, post-deploy verification, rollbacks). This phase also added: `config/site.ts#resolveSiteUrl()` so canonical URLs, JSON-LD, the sitemap, and Stripe's checkout redirect URLs automatically use `NEXT_PUBLIC_SITE_URL` in production, Vercel's auto-injected `VERCEL_URL` on preview deployments, or the hardcoded domain locally — previously every environment pointed at the same hardcoded production URL, which would have silently broken Stripe redirects on any preview-branch test. Also added: baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) in `next.config.js`, branded `app/error.tsx` and `app/global-error.tsx` boundaries (replacing Next's default error overlay, logging to the console as the one intentional `console.error` call in the app), and a real `/api/health` endpoint reporting which optional integrations are live (booleans only, safe to leave public).

**Deliberately not added:** a Content-Security-Policy header. This app renders inline JSON-LD via `dangerouslySetInnerHTML` and will eventually load Stripe/Clerk/GA4 scripts — all of which need a properly scoped nonce- or hash-based CSP to avoid breaking silently. A copy-pasted generic CSP would either do nothing or break checkout; see the comment in `next.config.js`. Add one deliberately, with real testing against every third-party script actually in use, before launch.

## Before launch — the definitive checklist

Every item below is a genuine gap, not a placeholder — each is described honestly elsewhere in this README, in `DEPLOYMENT.md`, or in an inline code comment; this section just collects them in one place so nothing gets missed at launch time.

**Content**

1. Replace placeholder artwork in `public/artwork/` with real photography and update `lib/products.ts` (each product now expects 3 images — swap in real angles, not the shared `detail-angle.svg`/`detail-closeup.svg` fillers).
2. Replace the sample testimonials in `config/testimonials.ts` with real, permissioned collector/gallery quotes — they're clearly labeled as placeholders in that file.
3. Confirm the phone number in `config/site.ts` — the source brief listed 11 digits after +91, one more than a standard Indian mobile number.
4. Have the legal pages (`app/privacy-policy`, `app/shipping-policy`, `app/return-policy`, `app/terms-conditions`) reviewed by counsel before go-live — they're complete, real policies, not lorem-ipsum, but they're templates.

**Third-party services** (see `DEPLOYMENT.md` for the setup steps for each)

5. Set `NEXT_PUBLIC_SITE_URL` in Vercel's Production environment to the real custom domain before launch — without it, Production falls back to `VERCEL_URL`, which is meant for previews, not the live site.
6. Set up a real Clerk application (production instance, not dev keys) and add its keys before launch if accounts should be live.
7. Set up a real Stripe account (live mode keys + a live webhook endpoint pointed at `/api/webhooks/stripe`) before launch if card payments should be live. Pair it with a real `DATABASE_URL` (#9) so orders are persisted, not just visible in Stripe's dashboard.
8. Create the Sanity project + `post` schema (see `lib/sanity.ts`) and set `NEXT_PUBLIC_SANITY_PROJECT_ID` before launch if the Journal should go live; otherwise `/journal` will keep showing its "coming soon" state indefinitely, which is honest but not a great look for a launched site.
9. Provision a real PostgreSQL database (Vercel Postgres, Neon, Supabase, etc.), set `DATABASE_URL`, and run `npx prisma migrate deploy` before launch if you want orders persisted outside Stripe's own dashboard. The product catalog itself is NOT in this database yet — it's still hand-edited in `lib/products.ts` — so catalog changes still require a code deploy until that migration happens.
10. Connect `services/newsletter.ts` to a real ESP (Klaviyo is already in the planned stack) before relying on it to capture subscribers.
11. Add a GA4 property + `gtag.js` script (and/or GTM/Clarity) if you want the Web Vitals already being captured in `components/WebVitals.tsx` to actually reach a dashboard — see "Performance" above.

**Security & ops**

12. Set `ADMIN_EMAILS` to the real studio owner's email before launch — until then, `/admin` is reachable by any signed-in user who guesses the URL and adds their own email to that env var. This is a plain email allowlist, not a real roles/permissions system — fine for a single-owner studio, worth revisiting if more staff need admin access.
13. Write and test a real Content-Security-Policy before launch (see "Phase 12" above) — none is set today.
14. Consider adding a real error-tracking service (Sentry or similar) and forwarding to it from the one spot that already logs unexpected errors: `app/error.tsx`'s `useEffect`.

**Known architectural trade-offs** (functional today, worth revisiting as the business grows)

15. Decide whether the Wishlist and Cart should stay device-local or move server-side/account-synced — right now neither follows a customer between browsers or devices.
16. Replace `lib/coupons.ts`'s hard-coded codes and `lib/shipping.ts`'s flat rates with a real promo/shipping system before relying on them commercially — they're functional, not fake, but not enforced anywhere except the client.
