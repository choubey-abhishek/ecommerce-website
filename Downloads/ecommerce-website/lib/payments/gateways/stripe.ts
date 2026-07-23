import { getStripeClient, isStripeConfigured } from "@/lib/stripe";
import type {
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentGateway,
} from "@/lib/payments/types";

/**
 * Stripe implementation of the PaymentGateway contract.
 *
 * This is the logic that previously lived inline in
 * `services/checkout.ts`, with one crucial change: it now builds line
 * items, the discount, and shipping from the *server-priced* cart passed
 * in (`input.cart`), never from client-supplied amounts. The checkout
 * action re-prices the cart before this ever runs.
 */
class StripeGateway implements PaymentGateway {
  readonly id = "stripe" as const;
  readonly label = "Card (Stripe)";
  readonly supportedCurrencies = ["USD"] as const;

  get isConfigured(): boolean {
    return isStripeConfigured;
  }

  supportsCurrency(currency: string): boolean {
    return this.supportedCurrencies.includes(currency.toUpperCase() as "USD");
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    if (!this.isConfigured) {
      return { gateway: this.id, error: "Stripe isn't configured yet." };
    }

    const { cart, redirects, clerkUserId } = input;
    if (cart.lineItems.length === 0) {
      return { gateway: this.id, error: "Your bag is empty." };
    }
    if (!this.supportsCurrency(cart.currency)) {
      return {
        gateway: this.id,
        error: `Stripe checkout doesn't support ${cart.currency} orders.`,
      };
    }

    const stripe = getStripeClient();
    const currency = cart.currency.toLowerCase();

    const line_items = cart.lineItems.map((line) => ({
      price_data: {
        currency,
        product_data: {
          name: line.title,
          images: line.image.startsWith("http") ? [line.image] : [],
          metadata: { slug: line.slug },
        },
        // Server-derived price — the client never gets a say in this amount.
        unit_amount: Math.round(line.unitPrice * 100),
      },
      quantity: line.quantity,
    }));

    let discounts: Array<{ coupon: string }> | undefined;
    if (cart.discount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(cart.discount * 100),
        currency,
        duration: "once",
        name: cart.couponCode ?? "Discount",
      });
      discounts = [{ coupon: coupon.id }];
    }

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: clerkUserId,
        line_items,
        discounts,
        shipping_options:
          cart.shipping > 0
            ? [
                {
                  shipping_rate_data: {
                    type: "fixed_amount",
                    fixed_amount: {
                      amount: Math.round(cart.shipping * 100),
                      currency,
                    },
                    display_name: "Shipping",
                  },
                },
              ]
            : undefined,
        success_url: redirects.successUrl,
        cancel_url: redirects.cancelUrl,
      });

      return { gateway: this.id, redirectUrl: session.url ?? undefined };
    } catch (error) {
      return {
        gateway: this.id,
        error: error instanceof Error ? error.message : "Could not start checkout.",
      };
    }
  }
}

export const stripeGateway = new StripeGateway();
