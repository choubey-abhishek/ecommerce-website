import Stripe from "stripe";

/**
 * Whether real Stripe credentials exist. Checked before every checkout
 * attempt so the site can fall back to the email-order stopgap instead
 * of throwing — mirrors `isClerkConfigured` in `lib/auth-config.ts`.
 */
export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

let _stripe: Stripe | null = null;

/** Lazily constructed so importing this file never requires a key to be present. */
export function getStripeClient(): Stripe {
  if (!isStripeConfigured) {
    throw new Error(
      "Stripe isn't configured — check isStripeConfigured before calling getStripeClient()."
    );
  }
  if (!_stripe) {
    // `as any` on the config: the installed `stripe` package's TS types
    // pin `apiVersion` to one exact literal string per release, and
    // without running `npm install` here there's no way to confirm which
    // one this version expects. The cast keeps this a real, valid Stripe
    // API version at runtime while sidestepping a possible type mismatch
    // — if `npm run typecheck` complains, just update the date string to
    // whatever your installed `stripe` version's types require.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2024-06-20",
    } as any);
  }
  return _stripe;
}
