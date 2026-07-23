"use server";

import { isClerkConfigured } from "@/lib/auth-config";
import { siteConfig } from "@/config/site";
import { repriceCart, type CartRequestItem } from "@/services/pricing";
import {
  defaultGatewayFor,
  getGateway,
  type GatewayId,
} from "@/lib/payments";

/**
 * Input the browser is allowed to send. Crucially it carries only the
 * product slug and quantity per line — NOT price, title, or image. Every
 * monetary value is re-derived server-side by `repriceCart`, which is
 * what closes the price-tampering hole the old flow had (it trusted
 * `item.price` straight from the client).
 */
export interface CreateCheckoutSessionInput {
  items: CartRequestItem[];
  couponCode?: string | null;
  region?: "domestic" | "international";
  /** Which payment provider to use. Defaults to the first configured one. */
  gateway?: GatewayId;
}

export interface CreateCheckoutSessionResult {
  /** Hosted-checkout URL for redirect gateways (Stripe). Null on error or
   *  for modal gateways that return `clientParams` instead. */
  url: string | null;
  /** Client-side params for modal gateways (Razorpay, Slice 2). */
  clientParams?: Record<string, unknown>;
  error?: string;
}

/**
 * Starts a checkout by (1) re-pricing the cart from server-owned data and
 * (2) delegating to the selected payment gateway. Runs as a real Next.js
 * Server Action, so no secret key ever reaches the browser. If no gateway
 * is configured, callers should fall back to the email-order stopgap —
 * this still guards defensively.
 */
export async function createCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
  // 1. Re-price from source of truth. Anything the client claimed about
  //    prices, discounts, or shipping is discarded here.
  const priced = repriceCart({
    items: input.items,
    couponCode: input.couponCode ?? null,
    region: input.region ?? "domestic",
  });

  if (!priced.ok) {
    return { url: null, error: priced.error };
  }
  const cart = priced.cart;

  // 2. Pick a gateway: an explicit choice if given and configured,
  //    otherwise the default one that can charge this cart's currency.
  const gateway = input.gateway
    ? getGateway(input.gateway)
    : defaultGatewayFor(cart.currency);

  if (!gateway || !gateway.isConfigured) {
    return { url: null, error: "Online payment isn't available right now." };
  }
  if (!gateway.supportsCurrency(cart.currency)) {
    return {
      url: null,
      error: `${gateway.label} can't process ${cart.currency} orders.`,
    };
  }

  // Best-effort account attribution — guest checkout still works fine.
  let clerkUserId: string | undefined;
  if (isClerkConfigured) {
    try {
      const { auth } = await import("@clerk/nextjs/server");
      clerkUserId = auth().userId ?? undefined;
    } catch {
      // Not in a Clerk-recognized request context — proceed as guest.
    }
  }

  const result = await gateway.createPayment({
    cart,
    clerkUserId,
    redirects: {
      successUrl: `${siteConfig.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteConfig.url}/checkout/cancel`,
    },
  });

  if (result.error) {
    return { url: null, error: result.error };
  }

  return { url: result.redirectUrl ?? null, clientParams: result.clientParams };
}
