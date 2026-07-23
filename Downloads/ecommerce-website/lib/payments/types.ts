import type { PricedCart } from "@/services/pricing";

/**
 * Payment gateway abstraction.
 *
 * The storefront supports more than one payment provider (Stripe today,
 * Razorpay for India next). Rather than couple checkout to any single
 * SDK, every provider implements this one contract, and the checkout
 * action selects a provider by id. Adding a gateway means adding one
 * file under `lib/payments/gateways/` and registering it — no changes to
 * the checkout action or UI beyond offering the new choice.
 */

export type GatewayId = "stripe" | "razorpay";

/** Where a completed payment should send the buyer. */
export interface PaymentRedirects {
  successUrl: string;
  cancelUrl: string;
}

export interface CreatePaymentInput {
  /** The authoritative, server-priced cart. Gateways MUST charge from
   *  these amounts and never from client-supplied numbers. */
  cart: PricedCart;
  redirects: PaymentRedirects;
  /** Clerk user id when signed in, for order attribution. Undefined for guests. */
  clerkUserId?: string;
}

/**
 * The result of initiating a payment. Different gateways hand control
 * back to the client differently:
 *  - Redirect gateways (Stripe Checkout) return a hosted `redirectUrl`.
 *  - Modal/SDK gateways (Razorpay Checkout) return `clientParams` the
 *    browser passes to the provider's in-page widget.
 * Exactly one of the two is populated on success; `error` is set on failure.
 */
export interface CreatePaymentResult {
  gateway: GatewayId;
  redirectUrl?: string;
  clientParams?: Record<string, unknown>;
  error?: string;
}

export interface PaymentGateway {
  readonly id: GatewayId;
  /** Human-facing label for gateway-picker UIs. */
  readonly label: string;
  /** True only when real credentials for this provider are present. */
  readonly isConfigured: boolean;
  /** ISO-4217 codes this gateway can charge in, uppercase. */
  readonly supportedCurrencies: readonly string[];
  /** Whether this gateway can charge a cart in the given currency. */
  supportsCurrency(currency: string): boolean;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
