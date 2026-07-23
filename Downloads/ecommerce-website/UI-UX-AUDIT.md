# UI/UX Audit & Improvement Roadmap — Kopal Seth Studio

**Prepared as a senior design + front-end review. No code changed — findings and plan only.**
Stack audited: Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Clerk · Stripe · Sanity.

---

## Executive summary

This is a genuinely well-built, tasteful storefront with a coherent editorial design language — not a project that needs rebuilding. The foundations are strong: a fluid `clamp()` type scale, a single shared easing curve (`ease-studio`), a Fraunces/Inter pairing, a `Container` primitive, a `cva` button, code-splitting of below-the-fold and modal code, SSG for product pages, and real accessibility intent (skip link, focus-ring base style, reduced-motion handling in places).

The weaknesses are **consistency and polish gaps**, not architectural failure. They cluster into six systemic themes that, once fixed centrally, lift almost every page at once.

**Overall storefront design score: 6.7 / 10** — premium instincts, undermined by a handful of high-impact, mostly cheap-to-fix defects.

---

## Six systemic issues (fix these once, benefit everywhere)

### 1. Broken `sage` color token — **real, verified bug** (highest priority)
`bg-sage-100` is used in three live files but `sage` is **not defined** in `tailwind.config.ts` (which defines beige, clay, sand, cream, stone, terracotta, olive, greystone). Tailwind emits nothing for undefined tokens, so these elements render **with no background**:
- `features/cart/components/coupon-form.tsx:19` — the "coupon applied" success pill (invisible at the exact moment the cart needs positive feedback).
- `app/admin/products/page.tsx:26` — the "Available" status badge.
- `app/admin/orders/page.tsx:55` — the "paid" status badge.

*Fix:* add a `sage` scale to the config (or repoint to the existing `olive`). One-line-per-token change; instantly repairs three broken UI states.

### 2. Focus-visible states are absent on interactive elements site-wide
There is a good `:focus-visible` base rule in `globals.css:22-26`, but nav links, icon buttons, cart steppers, product cards, journal cards, sidebar links, and hand-rolled buttons override or don't surface it. Keyboard users get little-to-no visible focus indicator. This is the single largest accessibility gap. *Fix:* ensure `focus-visible:ring`/outline survives on every interactive component; audit the rounded-pill styles that suppress the default outline.

### 3. Low-opacity text repeatedly fails WCAG AA contrast
`text-ink/40` (≈2.3–2.8:1) and `text-ink/50` (≈3.5:1) are used for legal text, `<dt>` spec labels, timestamps, hints, eyebrows, and disclaimers across footer, cart, product, admin, and legal pages. On dark sections `text-white/35` / `text-white/50` fail similarly. *Fix:* define a small set of approved muted tokens that clear 4.5:1 (normal) / 3:1 (large) and replace ad-hoc opacities.

### 4. Two divergent modal patterns
The navbar mobile menu uses Radix `Dialog` (focus trap, Escape, `aria-modal` — all correct). The **cart drawer** (`components/CartDrawer.tsx`) is a raw `motion.aside` with **no focus trap, no Escape-to-close, no focus restoration, and no scroll lock** — on the most transaction-critical overlay. Additionally, a `useScrollLock` hook exists but is imported nowhere, so background scroll-lock is unimplemented in both drawers. *Fix:* move the cart drawer onto the same Radix Dialog primitive; wire up `useScrollLock`.

### 5. The shared `Button` is bypassed in key flows
Cart, checkout summary, and newsletter hand-roll `rounded-full` buttons (`order-summary.tsx:73`, `CartDrawer.tsx:178`, `newsletter-signup.tsx:104`) instead of using `components/ui/button.tsx`, which already encodes those exact styles. Two parallel button implementations invite height/press-state drift. *Fix:* route all CTAs through `Button`.

### 6. Component & density inconsistencies
- Product grid renders at **three different densities**: home `lg:grid-cols-4`, shop `xl:grid-cols-3`, archive/wishlist `xl:grid-cols-4`.
- Dead/duplicate code: `components/Navbar.tsx` & `components/Footer.tsx` (deprecated shims), `components/ProductGrid.tsx` (self-documented unused), `hooks/use-scroll-lock.ts` (orphaned), and `PageTransition.tsx` re-implements variants that already exist in `animations/variants.ts`.
- Redundant palette: `sand`/`stone`/`cream`/`beige` are four near-identical off-whites; `beige`/`cream`/`olive`/`greystone` scales are largely unused.
- Error/success semantic colors are inconsistent: errors appear as `terracotta-500` in some places, `clay-300` in others; no single danger/success token.
- Layout H1s are hardcoded ("Dashboard" on every `/admin/*`, "Welcome Back" on every `/account/*`), so each sub-page's real title is a smaller `h2` — a hierarchy, SEO, and screen-reader-outline problem.
- Currency mismatch: region toggle says "India / International" but all prices are USD via `formatCurrency` default; a luxury shopper sees USD for a domestic-India order.

---

## Per-page findings & ratings

### Storefront

| Page | Rating | Key issues | Strengths |
|---|---:|---|---|
| **Home** | 7/10 | 9 same-rhythm sections = monotone pacing; two near-identical 4-up product rails; two adjacent "about" blocks; `FeaturedExhibition` card (`bg-stone-50` on white) nearly invisible; Instagram tiles are products with 6 identical sr-labels | Below-fold code-split; Hero LCP handling; word-by-word headline reveal; decorative images correctly `aria-hidden` |
| **Shop listing** | 8/10 | Empty column at 1024–1280px (`xl:grid-cols-3`, no `lg` step); category filters are checkboxes but behave as single-select radios; no desktop active-filter chips; toolbar crowding on mobile; intro block duplicated across pages | URL-synced shareable filters; debounced search; accessible "Load More" as IntersectionObserver target; shared skeleton |
| **Product detail** | 7/10 | "Buy Now" is misleading (just adds to cart — stale "Phase 7" comment); three competing CTAs; no breadcrumb; stacked padding = oversized gap before recommendations; div-as-button handles Enter only, not Space; Pinterest "P" glyph among real icons | SSG + JSON-LD; cursor-follow zoom gated to fine pointers; code-split lightbox with correct dialog semantics; semantic spec `<dl>` |
| **Cart page** | 6/10 | Invisible success pill (`sage` bug); off-system checkout button; USD-vs-"India" currency mismatch; inactive region pill `bg-white` on `bg-sand-50` barely visible; line items don't link to product; no stock/max guard on qty | Clean 2-col layout; animated add/remove; strong empty state; labeled controls |
| **Checkout** | 6/10 | Not a real on-site form — summary + 2 buttons; `mailto:` fallback with `[Your name]` placeholder; "Coming Soon" H1 after user clicked "Proceed"; button variant flips by config; no line-item recap on success | Honest dual-path; correct server-side re-pricing; payment verified before confirming; good cancel-page reassurance; uses `Button` |
| **Wishlist** | 6/10 | **No remove-from-wishlist control on the page** (heart toggle only lives on product detail); no count/bulk actions; `xl:grid-cols-4` density mismatch; hydration flash risk | Excellent empty state; honest scarcity copy; reuses `ProductCard` |
| **Product card** | 6.5/10 | **Quick-add & "View Details" are hover-only → invisible on touch and not reachable by `group-focus-within`**; 3 links to one href per card (extra tab stops); no inline add confirmation; dimensions `text-ink/50` borderline | Editorial `aspect-[4/5]` card; sold-state grayscale; good aria-labels; passes `product.currency` |

### Navigation & layout

| Component | Rating | Key issues | Strengths |
|---|---:|---|---|
| **Navbar** | 7/10 | No focus rings; broken `isActive` logic (anchors highlight wrong item; Contact never active); 40px touch targets (<44px); scroll-lock unimplemented; desktop vs mobile link styling diverges; magic z-indexes | Skip link; `aria-current`; pluralized cart label; Radix Dialog mobile menu; passive scroll listener; animated cart badge |
| **Footer** | 6.5/10 | `text-ink/40` legal text (contrast fail); h3/h4 mismatch for peer columns; no focus states; ragged bottom edge at `sm` breakpoint | Config-driven; correct external-link `rel`; anchored `#contact` with scroll-margin; staggered reveal |
| **Cart drawer** | 6/10 | No dialog semantics/focus trap/Escape/scroll-lock/focus-restore; 24px steppers; off-system buttons; low-contrast small text | Smart lazy-load (`ssr:false`); polished motion; clear price breakdown; good empty state |
| **Hero** | 7.5/10 | Section-level motion ignores `prefers-reduced-motion` (2.2s zoom, parallax, infinite bouncing arrow); legibility depends entirely on art asset; muddy layered overlays mid-scroll; huge `display-xl` can crowd at 320px; `→` glyph vs lucide | Correct LCP/`priority`/`sizes`; `svh` unit; refined word reveal; magnetic CTA respects reduced-motion |

### Account, admin, content & system

| Page | Rating | Key issues | Strengths |
|---|---:|---|---|
| **Account dashboard** | 6/10 | Redundant double-nav (sidebar + Clerk's own tabs); stale "Welcome Back" H1 on all sub-pages; cramped on small laptops | Brand-themed Clerk appearance; clean shell; excellent unconfigured-state screen |
| **Account orders** | 7/10 | Shared-H1 issue only | Best-in-set empty state with CTA |
| **Account addresses** | 6/10 | Drops the CTA that orders has — inconsistent dead end | Consistent structure with orders |
| **Admin dashboard** | 6/10 | "Dashboard" H1 on every route; low-contrast hints; no date range/trends/sparklines; stat grid skips tablet breakpoint | Honest "real vs placeholder" panel; tidy serif KPI numbers |
| **Admin tables (overall)** | 5/10 | Not enterprise-grade: no sort, no pagination (orders/customers hard-capped at 25 and silently truncated), no row hover, no sticky header, no card fallback on mobile, faint `border-ink/5` rows; `sage` badge bug; coupon hardcodes `$` | Consistent shell; horizontal-scroll on mobile; good conditional empty states |
| **Sign-in / Sign-up** | 5/10 | `clerkAppearance` NOT applied (mismatches account page); bare centered widget, no logo/heading/copy; heading-scale inconsistency in fallback | Nicely branded unconfigured fallback |
| **Journal list** | 8/10 | Cardless-image posts show bare grey block; no focus ring on card | Editorial grid; excellent dual empty state; shift-free skeleton |
| **Journal post** | 7/10 | No back-link, share, author, or reading time; article just ends | Clean long-form `prose-journal`; good skeleton |
| **About** | 7/10 | Bypasses `Container` (inline max-width); arbitrary type values; content invisible if motion fails | Premium sticky-image asymmetric layout; deep-link anchors |
| **Legal pages** | 8/10 | `text-ink/40` "last updated" contrast nit | Best consistency in the set via shared `LegalPageLayout`; thorough content |
| **Error / 404** | 7/10 | `global-error` intentionally off-brand (justified) | On-brand, consistent dual-CTA; Sentry-ready logging seam |

---

## Improvement roadmap (prioritized)

### Phase A — Correctness & accessibility (fast, high impact)
1. **Add the `sage` color scale** (or repoint to `olive`) — fixes 3 broken UI states.
2. **Restore visible focus states** on every interactive element; remove pill styles that suppress the outline.
3. **Fix contrast:** define approved muted tokens (≥4.5:1) and replace `text-ink/40` / `/50` and `text-white/35` / `/50`.
4. **Make ProductCard actions touch- & keyboard-accessible** (show on `group-focus-within`; provide a persistent action affordance on touch).
5. **Add a remove control to the wishlist view.**
6. **Fix "Buy Now"** on product detail (route to real checkout now that it exists).
7. **Stop hardcoding layout H1s**; give each account/admin sub-page a correct, unique heading.
8. **Apply `clerkAppearance`** to Sign-in/Sign-up.

### Phase B — Consistency & component hygiene
9. Route all CTAs through the shared `Button`; delete hand-rolled variants.
10. Move the **cart drawer onto Radix Dialog**; wire up `useScrollLock` for both drawers.
11. Standardize product-grid density (pick one responsive column set).
12. Consolidate the neutral palette; remove unused scales; define single danger/success tokens.
13. Delete dead/duplicate code (`Navbar.tsx`, `Footer.tsx` shims, `ProductGrid.tsx`); make `PageTransition` import shared variants.
14. Extract the repeated page-intro block and admin page-header into shared components.

### Phase C — Motion, hierarchy & pacing
15. Respect `prefers-reduced-motion` at the Hero/section level; stop the infinite arrow when off-screen or reduced.
16. Vary section rhythm on the home page; merge/differentiate the two product rails and two about blocks; fix the invisible exhibition card.
17. Add fallbacks so `whileInView` content is never permanently invisible if motion fails.
18. Reconsider `PageTransition` `mode="wait"` (~0.85s dead time per navigation delays new-page LCP).

### Phase D — Depth toward "enterprise/luxury" parity
19. **Checkout:** build a real multi-step on-site form (contact → address → review → pay) — aligns with the payments work already underway.
20. **Currency:** resolve USD-vs-India; localize currency per region (ties into the dual-currency Razorpay plan).
21. **Admin tables:** add sort, pagination, row hover, sticky header, and a mobile card fallback for enterprise feel.
22. **Product detail:** add breadcrumbs; fix stacked padding before recommendations.
23. **Shop:** add desktop active-filter chips; convert category checkboxes to a proper radio group; fill the 1024–1280px column gap.
24. **Journal post:** add back-link, share, author, and reading time.

### Phase E — Performance validation
25. Run Lighthouse/CWV on home, shop, and product; verify the code-splitting wins; confirm `PageTransition` isn't hurting perceived LCP; check Hero art-asset weight and the infinite animation's main-thread cost.

---

## Notes on method
Findings were gathered by reading the actual source of every route and shared component. The `sage` token bug was verified by grep (used in 3 files, defined in 0). Contrast figures are approximate (opacity-over-background estimates) and should be confirmed with a contrast checker during implementation. Ratings are relative design-quality judgments for this project's own luxury bar, not absolute scores.
