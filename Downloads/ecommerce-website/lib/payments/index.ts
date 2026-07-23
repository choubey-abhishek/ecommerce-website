import type { GatewayId, PaymentGateway } from "@/lib/payments/types";
import { stripeGateway } from "@/lib/payments/gateways/stripe";

export type { GatewayId, PaymentGateway } from "@/lib/payments/types";
export type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentRedirects,
} from "@/lib/payments/types";

/**
 * The payment gateway registry.
 *
 * Every provider the storefront knows about lives here, keyed by id.
 * Razorpay (Slice 2) will register alongside Stripe with no changes to
 * the checkout action — it just becomes another entry and another
 * selectable option. Order matters only for `defaultGatewayId`, which
 * picks the first *configured* gateway.
 */
const GATEWAYS: Partial<Record<GatewayId, PaymentGateway>> = {
  stripe: stripeGateway,
  // razorpay: razorpayGateway,  ← added in Slice 2
};

/** Look up a gateway by id. Returns undefined for unknown ids. */
export function getGateway(id: GatewayId): PaymentGateway | undefined {
  return GATEWAYS[id];
}

/** Every gateway that currently has real credentials configured. */
export function getConfiguredGateways(): PaymentGateway[] {
  return Object.values(GATEWAYS).filter(
    (gateway): gateway is PaymentGateway => Boolean(gateway) && gateway.isConfigured
  );
}

/** Whether at least one payment gateway is ready to take money. */
export function hasConfiguredGateway(): boolean {
  return getConfiguredGateways().length > 0;
}

/**
 * The gateway to use when the caller doesn't specify one — the first
 * configured provider that can charge the given currency, or simply the
 * first configured provider if currency is omitted. Returns undefined
 * when nothing is configured (the site then falls back to the email-order
 * stopgap, exactly as before).
 */
export function defaultGatewayFor(currency?: string): PaymentGateway | undefined {
  const configured = getConfiguredGateways();
  if (!currency) return configured[0];
  return configured.find((gateway) => gateway.supportsCurrency(currency)) ?? configured[0];
}
