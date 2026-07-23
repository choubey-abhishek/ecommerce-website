import { z } from "zod";
import { getProductBySlug } from "@/lib/products";
import { applyCoupon } from "@/lib/coupons";
import { getShippingEstimate } from "@/lib/shipping";

/**
 * Authoritative, server-side cart pricing.
 *
 * WHY THIS EXISTS: the previous checkout flow built Stripe line items
 * straight from client-supplied prices (`unit_amount: item.price * 100`),
 * the client-supplied discount amount, and the client-supplied shipping
 * cost. A tampered request could therefore set any price, any discount,
 * or free shipping. This module is the single source of truth that
 * re-derives every monetary value from server-owned data
 * (`lib/products`, `lib/coupons`, `lib/shipping`) using ONLY the two
 * things a client is allowed to choose: which product, and how many.
 *
 * Every payment gateway (Stripe today, Razorpay next) must charge from
 * a `PricedCart` produced here — never from numbers the browser sent.
 */

/** Hard cap per line — a defensive guard against absurd quantities. */
const MAX_QUANTITY_PER_ITEM = 20;

/**
 * The only cart data a client is trusted to send. Note the deliberate
 * absence of price, currency, title, or image — all of those are looked
 * up server-side from the catalog so they can't be forged.
 */
export const cartRequestItemSchema = z.object({
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
});

export const repriceInputSchema = z.object({
  items: z.array(cartRequestItemSchema).min(1).max(50),
  couponCode: z.string().trim().max(64).nullish(),
  region: z.enum(["domestic", "international"]).default("domestic"),
});

export type CartRequestItem = z.infer<typeof cartRequestItemSchema>;
export type RepriceInput = z.input<typeof repriceInputSchema>;

/** A single line, priced entirely from server-owned catalog data. */
export interface PricedLineItem {
  slug: string;
  title: string;
  /** Primary catalog image, used by gateways that render line images. */
  image: string;
  /** Per-unit price in major currency units (e.g. dollars), from the catalog. */
  unitPrice: number;
  quantity: number;
  /** `unitPrice * quantity`, precomputed for convenience. */
  lineTotal: number;
}

export interface PricedCart {
  /** ISO-4217 code the catalog prices are denominated in (currently "USD"). */
  currency: string;
  lineItems: PricedLineItem[];
  subtotal: number;
  couponCode: string | null;
  discount: number;
  shipping: number;
  /** Tax is 0 until the tax slice lands; kept in the shape so gateways and
   *  order records don't need reshaping later. */
  tax: number;
  total: number;
}

export interface RepriceSuccess {
  ok: true;
  cart: PricedCart;
}

export interface RepriceFailure {
  ok: false;
  error: string;
}

export type RepriceResult = RepriceSuccess | RepriceFailure;

/**
 * Re-price a cart from scratch using only server-owned data.
 *
 * Returns a discriminated union rather than throwing so callers (server
 * actions, API routes) can surface a clean error message. Validates that
 * every referenced product exists and is still available, then computes
 * subtotal → coupon discount → shipping → total, each from the trusted
 * source module rather than anything the client provided.
 */
export function repriceCart(rawInput: RepriceInput): RepriceResult {
  const parsed = repriceInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: "Invalid cart contents." };
  }
  const input = parsed.data;

  // Collapse duplicate slugs (a client could legitimately or maliciously
  // send the same product twice) into a single, quantity-capped line.
  const quantityBySlug = new Map<string, number>();
  for (const item of input.items) {
    quantityBySlug.set(item.slug, (quantityBySlug.get(item.slug) ?? 0) + item.quantity);
  }

  const lineItems: PricedLineItem[] = [];
  let currency: string | null = null;

  for (const [slug, requestedQty] of quantityBySlug) {
    const product = getProductBySlug(slug);
    if (!product) {
      return { ok: false, error: `A product in your bag is no longer available.` };
    }
    if (product.sold) {
      return { ok: false, error: `"${product.title}" has just sold and can't be purchased.` };
    }

    // Mixed-currency carts can't be charged in one payment. The catalog is
    // single-currency today, but guard so this fails loudly if that changes.
    if (currency === null) {
      currency = product.currency;
    } else if (currency !== product.currency) {
      return { ok: false, error: "Your bag mixes currencies and can't be checked out together." };
    }

    const quantity = Math.min(requestedQty, MAX_QUANTITY_PER_ITEM);
    lineItems.push({
      slug: product.slug,
      title: product.title,
      image: product.image,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  const subtotal = lineItems.reduce((sum, line) => sum + line.lineTotal, 0);

  // Re-validate the coupon server-side against the server subtotal. A code
  // the client claimed to have applied is only honoured if it genuinely
  // validates here — the client's discount amount is never trusted.
  let discount = 0;
  let couponCode: string | null = null;
  if (input.couponCode) {
    const couponResult = applyCoupon(input.couponCode, subtotal);
    if (couponResult.valid) {
      discount = couponResult.discount;
      couponCode = couponResult.coupon?.code ?? input.couponCode.trim().toUpperCase();
    }
    // Silently ignore an invalid/ineligible code here — the cart UI already
    // reports coupon validity; checkout just shouldn't apply a bad one.
  }

  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const shipping = getShippingEstimate(discountedSubtotal, input.region);
  const tax = 0;
  const total = discountedSubtotal + shipping + tax;

  return {
    ok: true,
    cart: {
      currency: currency ?? "USD",
      lineItems,
      subtotal,
      couponCode,
      discount,
      shipping,
      tax,
      total,
    },
  };
}
