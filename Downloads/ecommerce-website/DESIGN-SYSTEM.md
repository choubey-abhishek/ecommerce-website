# Kopal Seth Studio — Design System

**Version 1.0 · A premium, editorial design language for a contemporary ceramics house.**

This system formalizes and refines the design language already present in the codebase. It does **not** invent a new look — it keeps the warm, quiet, gallery-like identity (Fraunces + Inter, clay/sand/terracotta) and tightens it into a consistent, accessible, production-grade token set. Where the audit found gaps (a missing `sage` color, sub-AA muted text, four interchangeable neutrals, no semantic success/warning/error), this document resolves them.

**Design principles**

1. **Quiet luxury.** Generous whitespace, restrained color, editorial serif display. The product is the hero; the UI recedes.
2. **Warm neutrals, earthy accents.** Every color is desaturated and warm. No pure greys, no neon semantics.
3. **One source of truth.** Every value below is a token. Components consume tokens, never raw hex.
4. **Accessible by default.** Text meets WCAG 2.2 AA contrast; every interactive element has a visible focus state and a ≥44px target.
5. **Motion with intent.** A single easing curve, short durations, and full `prefers-reduced-motion` support.

---

## 1. Color

Colors are expressed as **primitive ramps** (raw palette) mapped to **semantic roles** (how they're used). Always reference roles in components, not primitives.

### 1.1 Primitive ramps

**Ink (primary / neutral-dark)** — text, primary actions, inverse surfaces.

| Token | Hex | Use |
|---|---|---|
| `ink` | `#111111` | Primary text, primary button background |
| `charcoal` | `#1A1A1A` | Primary button hover, inverse surface |

**Clay (secondary — the signature warm tan)** — brand accents, secondary buttons, highlights.

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `clay-50` | `#FBF7F2` | | `clay-400` | `#C9A97D` |
| `clay-100` | `#F5EDE2` | | `clay-500` | `#B48B5C` ← key |
| `clay-200` | `#EADCC8` | | `clay-600` | `#9A7148` |
| `clay-300` | `#DCC6A6` | | `clay-700` | `#7C5A38` (new, AA text) |

**Terracotta (accent — burnt warm highlight)** — sale/featured accents, decorative emphasis.

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `terracotta-50` | `#FBEEE8` (new) | | `terracotta-500` | `#B76E4D` |
| `terracotta-100` | `#EFDACB` | | `terracotta-600` | `#9C5A3C` |
| `terracotta-300` | `#D8A582` | | `terracotta-700` | `#7E4831` (new, AA text) |

**Sand (warm neutral — backgrounds & surfaces)**

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `sand-50` | `#FAF8F5` | | `sand-200` | `#E5DCCE` |
| `sand-100` | `#F2EDE6` | | `sand-300` | `#D5C8B4` |

**Stone (cool neutral — text, borders, UI greys)** — extended so muted text passes AA.

| Token | Hex | | Token | Hex |
|---|---|---|---|---|
| `stone-50` | `#F7F6F4` | | `stone-400` | `#8A8880` (new) |
| `stone-100` | `#ECEBE8` | | `stone-500` | `#6B6A64` (new — AA muted text) |
| `stone-200` | `#D9D7D1` | | `stone-600` | `#52514C` (new — AA secondary text) |
| `stone-300` | `#B8B5AD` | | `stone-700` | `#3A3935` (new) |

> **Refinement — deprecated ramps.** `beige`, `cream`, `greystone`, and `olive` are near-duplicates and should be retired. Migration map: `beige → sand`, `cream → sand`, `greystone → stone`, `olive → success`. Keep them aliased during migration, then remove.

### 1.2 Semantic color ramps (new / fixed)

These resolve the broken `bg-sage-100` and the inconsistent error colors found in the audit. All are muted and earthy to fit the palette — no bright system colors.

**Success (earthy sage-green)** — replaces the undefined `sage` token.

| Token | Hex | Use |
|---|---|---|
| `success-50` | `#F1F5EC` | Faint background |
| `success-100` | `#E1EAD6` | Pill / badge background |
| `success-300` | `#B9C99E` | Borders |
| `success-500` | `#6E8B57` | Icons on light |
| `success-600` | `#56703F` | **Text on light (AA)** |
| `success-700` | `#415530` | Text on tint |

**Warning (honey / amber)**

| Token | Hex | Use |
|---|---|---|
| `warning-50` | `#FBF3E1` | Faint background |
| `warning-100` | `#F6E7C2` | Pill / badge background |
| `warning-300` | `#E4C275` | Borders |
| `warning-500` | `#C08A2E` | Icons on light |
| `warning-600` | `#9A6C1C` | **Text on light (AA)** |
| `warning-700` | `#78530F` | Text on tint |

**Error / danger (deepened terracotta)** — consolidates the `terracotta-500` vs `clay-300` error inconsistency into one ramp.

| Token | Hex | Use |
|---|---|---|
| `error-50` | `#FBEBE6` | Faint background |
| `error-100` | `#F6D8CC` | Pill / badge background |
| `error-300` | `#E1A48A` | Borders |
| `error-500` | `#C0553A` | Icons / focus border |
| `error-600` | `#A2402A` | **Text on light (AA)** |
| `error-700` | `#7E3021` | Text on tint |

**Info (muted slate)** — optional, for neutral system messages.

| Token | Hex | Use |
|---|---|---|
| `info-50` | `#EEF1F4` | Background |
| `info-100` | `#DCE3EA` | Pill background |
| `info-500` | `#5B7186` | Icon |
| `info-600` | `#45596B` | Text (AA) |

### 1.3 Semantic roles (use these in components)

**Background**

| Role | Value | Use |
|---|---|---|
| `bg-base` | `paper #FFFFFF` | Default page background |
| `bg-subtle` | `sand-50` | Alternating sections, sunken areas |
| `bg-inverse` | `ink #111111` | Dark sections, footers |

**Surface**

| Role | Value | Use |
|---|---|---|
| `surface` | `#FFFFFF` | Cards, inputs, menus |
| `surface-subtle` | `sand-50` | Quiet cards, form wells |
| `surface-sunken` | `sand-100` | Inset panels, code/quote blocks |
| `surface-raised` | `#FFFFFF` + `shadow-card` | Floating cards, popovers |
| `surface-inverse` | `charcoal #1A1A1A` | Dark cards, tooltips |
| `surface-glass` | `rgba(255,255,255,0.65)` + blur | Sticky navbar, overlays |

**Border**

| Role | Value (over white) | Use |
|---|---|---|
| `border-subtle` | `rgba(17,17,17,0.06)` ≈ `#EFEFEF` | Row dividers, quiet separation |
| `border-default` | `rgba(17,17,17,0.12)` ≈ `#E0E0E0` | Inputs, cards, standard borders |
| `border-strong` | `rgba(17,17,17,0.20)` ≈ `#D1D1D1` | Emphasis, outline buttons |
| `border-inverse` | `rgba(255,255,255,0.14)` | Borders on dark |
| `border-focus` | `clay-500 #B48B5C` | Focus ring (matches current global) |

**Text** (contrast measured on `#FFFFFF`)

| Role | Value | Contrast | Use |
|---|---|---|---|
| `text-primary` | `ink #111111` | 18.1:1 | Headings, body |
| `text-secondary` | `stone-600 #52514C` | ~8:1 | Supporting copy |
| `text-muted` | `stone-500 #6B6A64` | ~4.7:1 ✓AA | Captions, hints, eyebrows |
| `text-disabled` | `stone-400 #8A8880` | ~3.2:1 | Disabled / large only |
| `text-inverse` | `#FFFFFF` | — | Text on dark |
| `text-inverse-muted` | `rgba(255,255,255,0.72)` | — | Muted text on dark |
| `text-accent` | `clay-700 #7C5A38` | ~5.3:1 ✓AA | Accent links/labels on light |

> **Audit fix:** replace all `text-ink/40` and `text-ink/50` usages with `text-muted`; replace `text-ink/70` supporting copy with `text-secondary`. These clear AA where the raw opacities did not.

---

## 2. Typography

Two families, clearly divided: **Fraunces** (serif) for display and headings — warmth and craft; **Inter** (sans) for body and all UI chrome — legibility.

- Display uses Fraunces **Light (300)** with tight negative tracking.
- Body uses Inter **Regular (400)**; emphasis **Medium (500)**.
- UI labels/buttons/eyebrows use Inter, uppercase, wide tracking.

### 2.1 Type scale

| Token | Font | Size | Line height | Tracking | Weight | Use |
|---|---|---|---|---|---|---|
| `display-xl` | Fraunces | `clamp(3.5rem, 8vw, 7.5rem)` | 0.98 | −0.02em | 300 | Hero headline |
| `display-lg` | Fraunces | `clamp(2.75rem, 6vw, 5rem)` | 1.02 | −0.015em | 300 | Page hero |
| `display-md` | Fraunces | `clamp(2.25rem, 4.5vw, 3.5rem)` | 1.05 | −0.01em | 300 | Section titles |
| `h1` | Fraunces | 2.5rem / 40px | 1.1 | −0.01em | 300 | Doc/app H1 |
| `h2` | Fraunces | 2rem / 32px | 1.15 | −0.01em | 400 | Section |
| `h3` | Fraunces | 1.5rem / 24px | 1.25 | normal | 400 | Subsection, card title |
| `h4` | Fraunces | 1.25rem / 20px | 1.3 | normal | 500 | Minor heading |
| `h5` | Inter | 1.125rem / 18px | 1.35 | normal | 500 | UI heading |
| `h6` | Inter | 1rem / 16px | 1.4 | normal | 600 | Small UI heading |
| `body-lg` | Inter | 1.0625rem / 17px | 1.7 | normal | 400 | Lead paragraphs |
| `body` | Inter | 1rem / 16px | 1.65 | normal | 400 | Default body |
| `body-sm` | Inter | 0.9375rem / 15px | 1.6 | normal | 400 | Dense UI copy |
| `caption` | Inter | 0.8125rem / 13px | 1.5 | normal | 400 | Captions, helper text |
| `overline` | Inter | 0.75rem / 12px | 1 | 0.2em | 500 | Eyebrows, kickers (uppercase, `text-muted`) |
| `button` | Inter | 0.8125rem / 13px | 1 | 0.2em | 500 | Button text (uppercase); `lg` → 14px / 0.15em |
| `label` | Inter | 0.8125rem / 13px | 1.4 | 0.02em | 500 | Form labels |

### 2.2 Paragraph rules

- Body measure: **60–75 characters** — use `max-w-prose` / the `narrow` container (`max-w-3xl`) for long-form.
- Paragraph spacing: `1em` (≈16px) between paragraphs; never rely on `<br>`.
- Long-form (`journal`, `about`, legal): `body-lg` at `line-height 1.8`, headings `mt-2em mb-0.5em`.
- Balance short headings with `text-wrap: balance`.

---

## 3. Spacing

A **4px base** scale. Use tokens; avoid arbitrary pixel values (the audit found `text-[16px] leading-[1.9]` etc. — replace with scale steps).

| Token | px | | Token | px |
|---|---|---|---|---|
| `0` | 0 | | `8` | 32 |
| `0.5` | 2 | | `10` | 40 |
| `1` | 4 | | `12` | 48 |
| `1.5` | 6 | | `14` | 56 |
| `2` | 8 | | `16` | 64 |
| `3` | 12 | | `20` | 80 |
| `4` | 16 | | `24` | 96 |
| `5` | 20 | | `28` | 112 |
| `6` | 24 | | `32` | 128 |

**Semantic spacing**

| Purpose | Value |
|---|---|
| Inline gap (icon↔text) | `2` (8px) |
| Stack gap — tight | `2`–`3` (8–12px) |
| Stack gap — default | `4`–`6` (16–24px) |
| Card padding | `6` (24px) mobile → `8` (32px) desktop |
| Component padding (button md) | `x: 7` (28px), height-driven vertical |
| Section rhythm | `py-24` (96px) → `sm:py-32` (128px) |
| Page gutter | `6` (24px) → `sm:10` (40px) |

---

## 4. Grid & container

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1400`.

**Container widths**

| Token | Max width | Use |
|---|---|---|
| `container-narrow` | `48rem` (768px) | Long-form reading (journal, legal, about bio) |
| `container` | `72rem` (1152px) | Default editorial + storefront |
| `container-wide` | `80rem` (1280px) | Admin dashboards, data tables (new) |

Gutters: `px-6` (24px) mobile, `px-10` (40px) ≥sm. **Always** use the `Container` primitive — the audit found `AboutSection` re-implementing this inline; that should route through `Container`.

**Grid**

- Base system: 12 columns, `gap-6` (24px).
- Editorial asymmetry (about, story): `0.85fr / 1.15fr` with `gap-x-6 gap-y-14`.
- **Product grid (standardized).** The audit found three densities. Adopt one:
  `grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4`.
  Apply everywhere product cards appear (home rails, shop, archive, wishlist) so density never varies.

---

## 5. Border radius

Rounded, soft, editorial. Buttons and pills are fully round; cards use large radii.

| Token | Value | Use |
|---|---|---|
| `radius-xs` | 4px | Focus outline inner, tags |
| `radius-sm` | 8px | Small chips, checkboxes |
| `radius-md` | 12px | Form fields (field style), small cards |
| `radius-lg` | 16px | Dropdown/menu, popover |
| `radius-xl` | 24px | Cards |
| `radius-2xl` | 32px | Feature cards, modals |
| `radius-3xl` | 40px | Large feature panels |
| `radius-full` | 9999px | Buttons, pills, badges, avatars, search inputs |

---

## 6. Shadow system

Soft, wide, low-opacity ink shadows — never harsh. Extends the current `soft/card/glass/lift` set with a subtle step and a focus ring.

| Token | Value | Use |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(17,17,17,0.04)` | Hairline lift, inputs on hover |
| `shadow-card` | `0 10px 40px -10px rgba(17,17,17,0.12)` | Resting cards |
| `shadow-soft` | `0 20px 60px -15px rgba(17,17,17,0.15)` | Card hover, raised surfaces |
| `shadow-glass` | `0 8px 32px 0 rgba(17,17,17,0.08)` | Glass navbar/overlays |
| `shadow-lift` | `0 30px 80px -20px rgba(17,17,17,0.22)` | Modals, drawers, lightbox |
| `ring-focus` | `0 0 0 2px #FFFFFF, 0 0 0 4px clay-500` | Focus indicator (offset ring) |

---

## 7. Motion

One easing curve unifies the whole site. Durations are short; everything respects reduced motion.

**Easing**

| Token | Curve | Use |
|---|---|---|
| `ease-studio` | `cubic-bezier(0.22, 1, 0.36, 1)` | Primary — reveals, hovers, transitions |
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Utility transitions |
| `linear` | `linear` | Marquee, spinners |

**Duration**

| Token | ms | Use |
|---|---|---|
| `duration-fast` | 150 | Hover color, dropdown open |
| `duration-base` | 250 | Modal/toast enter, most transitions |
| `duration-moderate` | 300 | Button color, drawer |
| `duration-slow` | 500 | Page transition, larger reveals |
| `duration-slower` | 800 | `fadeUp` scroll reveals |
| `duration-marquee` | 30000 | Announcement marquee |

**Keyframes:** `fadeUp` (opacity + translateY 24px), `fadeIn`, `scaleIn` (0.96→1), `marquee`, `accordion-down/up`.

**Principles**

- Enter with `fadeUp`/`scaleIn`; exit faster than enter.
- Scroll reveals use `whileInView` with `once: true`. Always provide a no-JS/`initial:false` fallback so content is never permanently invisible (audit risk).
- **Reduced motion:** when `prefers-reduced-motion: reduce`, disable parallax, transforms, autoplay, and infinite loops (e.g. the hero's bouncing arrow); keep only opacity fades ≤150ms. Apply this at the section level, not just in `Button`.

---

## 8. Icon system

- **Library:** `lucide-react` (already in use). One library only.
- **Stroke:** `1.5` default; `1.25` for large decorative icons.
- **Sizes:** `sm 16px` · `md 20px` (default) · `lg 24px` · `xl 32px` (feature).
- **Color:** always `currentColor` — inherits text color.
- **Decorative icons:** `aria-hidden="true"`.
- **Interactive icons:** require an accessible name (`aria-label`) and a ≥44px hit target (pad the button, not the glyph).
- Avoid mixing icon systems — the audit found raw glyphs (`→`, Pinterest "P"); replace with lucide equivalents.

---

## 9. Components

Each spec lists anatomy, tokens, states, variants, and accessibility. Reference Tailwind classes are indicative.

### 9.1 Buttons

Text: `button` type token (Inter, uppercase, 0.2em). All buttons `radius-full`.

**Variants**

| Variant | Resting | Hover | Use |
|---|---|---|---|
| `primary` | `bg ink`, `text white` | `bg charcoal` | Primary action |
| `secondary` | `bg clay-100`, `text ink` | `bg clay-200` | Secondary action |
| `outline` | `border-strong`, `text ink` | `bg ink`, `text white` | Tertiary / on imagery |
| `ghost` | transparent, `text-secondary` | `text ink` | Low-emphasis, toolbars |
| `link` | `text ink`, underline offset | underline | Inline text action |
| `destructive` (new) | `bg error-600`, `text white` | `bg error-700` | Delete/remove confirm |

**Sizes**

| Size | Height | Padding-x | Text |
|---|---|---|---|
| `sm` | 36px | 16px | 11px |
| `md` | 48px | 28px | 13px |
| `lg` | 56px | 36px | 14px |
| `icon` | **44px** (raised from 40) | — | — |

**States:** `hover` (color shift, 300ms), `active` (scale 0.98), `focus-visible` (`ring-focus`), `disabled` (`opacity-40`, no pointer events), `loading` (spinner + disabled, keep width).

**Rules:** one primary per view. Route **all** CTAs through the shared `Button` — the audit found cart/checkout/newsletter hand-rolling button styles; retire those. Optional `magnetic` cursor-follow for hero CTAs only, and it must respect reduced motion.

### 9.2 Inputs & form controls

Two field shapes: **pill** (`radius-full`) for inline/search/newsletter; **field** (`radius-md`) for multi-field forms.

**Text input / textarea / select**

- Height 48px (md); textarea min 120px. Padding `x-5` (pill) / `x-4` (field).
- `bg surface`, `border-default`, `text-primary`, placeholder `text-muted`.
- **Focus:** `border-focus` + `ring-focus`.
- **Error:** `border error-500`, helper text `error-600`, `aria-invalid`, `aria-describedby` → message.
- **Disabled:** `bg sand-50`, `text-disabled`, `cursor-not-allowed`.
- **Label:** `label` token above field; required marked with text, not color alone.
- **Helper/caption:** `caption` token, `text-muted` (or `error-600` on error).

**Checkbox / radio (Radix):** 20px box, `radius-sm` (checkbox) / `radius-full` (radio), `border-strong`; checked `bg ink`, white check; focus ring. **Use radios for single-select** — the audit found category filters using checkboxes for radio behavior.

**Slider (Radix):** 4px track `stone-200`, filled `ink`, 16px thumb `surface` + `border-strong` + `shadow-xs`; focus ring on thumb.

**Quantity stepper:** 44px targets (raised from 24), `−`/`+` icon buttons, numeric center; disable `−` at 1 and `+` at stock max.

### 9.3 Cards

Base: `surface`, `border-subtle`, `radius-xl`, padding `6`→`8`, optional `shadow-card`. Hover (interactive cards): `translateY(-2px)` + `shadow-soft`, 300ms `ease-studio`.

**Variants**

| Variant | Notes |
|---|---|
| `product` | Image `aspect-[4/5]`, `radius-xl`, no border; title Fraunces, dimensions `caption text-muted`, price `body-sm`. Sold → grayscale image + badge. **Actions (quick-add / view) must be visible on touch and `group-focus-within`, not hover-only** (audit fix). |
| `content` | Standard card with heading + body + optional CTA. |
| `stat` (admin) | Label `overline text-muted`, value Fraunces `text-3xl`, optional delta with semantic color + icon. Add subtle hover. |
| `glass` | `surface-glass` + `shadow-glass`; for overlays on imagery. |
| `feature` | `surface-subtle` (`sand-50`) fill; must sit on `bg-base` white (not on `sand`) so it reads — audit found an invisible `stone-50`-on-white card. |

### 9.4 Modal (dialog)

Built on **Radix Dialog** (accessibility for free). The cart drawer must migrate onto this — audit found it as a raw `motion.aside` with no focus trap/Escape/scroll-lock.

- **Overlay:** `bg rgba(17,17,17,0.4)` + `backdrop-blur-xs`, fade 250ms.
- **Panel:** `surface`, `radius-2xl`, `shadow-lift`, padding `8` (32px). Max-width: `sm 400 / md 512 / lg 640`.
- **Header:** title `h3` (Fraunces), optional description `caption text-muted`; close button top-right, 44px icon button.
- **Motion:** fade + `scaleIn` (0.96→1), 250ms `ease-studio`; exit 150ms.
- **Mobile:** convert to bottom sheet — full width, slide up, `radius-2xl` top corners only.
- **A11y:** focus trap, restore focus to trigger on close, Escape to close, `aria-modal`, scroll-lock (wire up the existing unused `useScrollLock`), labelled title/description.

**Drawer variant (cart / filters):** side sheet, width `400px` (full on mobile), slide-x 300ms; same Dialog a11y contract.

### 9.5 Dropdown / menu

Built on Radix Dropdown/Select.

- **Content:** `surface-raised`, `radius-lg`, `shadow-card`, `border-subtle`, padding `1.5` (6px). Min-width = trigger width.
- **Item:** height 36px, `px-3`, `radius-md`, `body-sm`; hover `bg sand-50`; selected shows check + `text-primary`; disabled `text-disabled`.
- **Label:** `overline text-muted`, `px-3 pt-2`. **Separator:** `border-subtle`, `my-1`.
- **Motion:** fade + slide (4px) 150ms `ease-studio`.
- **A11y:** full keyboard nav (arrows/Home/End/type-ahead), `role=menu`/`menuitem`, focus ring on items.

### 9.6 Toast notifications (new)

No toast system exists today; this defines one. Recommended: a Radix Toast provider or `sonner`, themed to these tokens.

- **Placement:** top-right (desktop), top-center or bottom (mobile). Stack with `gap-2`, newest on top, max ~3 visible.
- **Toast:** `surface-raised`, `radius-lg`, `shadow-lift`, `border-subtle`, padding `4` (16px), width ~360px. Left **accent bar** (4px) or tinted icon chip in the semantic color.
- **Content:** leading semantic icon → title (`body-sm`, medium) + optional description (`caption text-muted`) → dismiss `X` (44px).
- **Semantic variants:** `success` (success), `warning` (warning), `error` (error), `info` (info). Icon + accent from the matching ramp; body text stays `text-primary`/`text-muted` for legibility.
- **Timing:** auto-dismiss 5s (success/info), 8s (warning); **errors are sticky** (manual dismiss). Pause on hover/focus.
- **Motion:** slide-in-x + fade 250ms `ease-studio`; exit slide-out 150ms. Reduced motion → fade only.
- **A11y:** `role="status"` + `aria-live="polite"` for success/info; `role="alert"` + `aria-live="assertive"` for error/warning. Dismiss button labelled.

---

## 10. Accessibility baseline (WCAG 2.2 AA)

- **Contrast:** body text ≥ 4.5:1, large text/UI ≥ 3:1. The text roles in §1.3 are pre-checked. Never encode meaning with color alone (pair semantic color with icon/text).
- **Focus:** every interactive element shows `ring-focus`; never remove outlines without a replacement. (Audit found focus states missing site-wide.)
- **Targets:** ≥ 44×44px for all controls (buttons, steppers, icon buttons, nav items).
- **Motion:** honor `prefers-reduced-motion` globally.
- **Semantics:** correct heading order (one `h1` per page — fix the hardcoded layout `h1`s in admin/account), real landmarks, labelled forms, `aria-current` on active nav.

---

## 11. Implementation map (reference only — no code changed yet)

When approved, these tokens land as:

1. **`tailwind.config.ts`** — add `sage`→`success`, `warning`, `error`, `info` ramps; add `stone-400/500/600/700`, `clay-700`, `terracotta-50/700`; add `radius`, extend `boxShadow` (`xs`, `ring`), `transitionDuration` tokens, `container-wide`. Alias then remove `beige/cream/greystone/olive`.
2. **`app/globals.css`** — expose semantic roles as CSS custom properties (`--color-bg-base`, `--text-muted`, `--border-default`, …) so non-Tailwind and runtime theming can consume them; keep the existing `:focus-visible` rule and align it to `ring-focus`.
3. **Components** — migrate hand-rolled buttons/inputs to shared primitives; add `Input`, `Modal`, `Dropdown`, `Toast` primitives; move cart drawer onto Radix Dialog.

This is documented for approval; nothing in the app has been modified by this design-system deliverable.
