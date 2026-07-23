import { NextResponse } from "next/server";
import { isStripeConfigured, getStripeClient } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import { createOrderFromStripeSession } from "@/services/orders";

/**
 * Stripe webhook receiver. Verifies the signature, persists a real Order
 * (when a database is configured), and always acknowledges the event —
 * `createOrderFromStripeSession` upserts on `stripeSessionId`, so
 * Stripe's automatic retries can safely call this more than once for
 * the same event without creating duplicate orders.
 *
 * Local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
 */
export async function POST(req: Request) {
  if (!isStripeConfigured || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhooks aren't configured." },
      { status: 501 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripeClient();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log(
        `[stripe webhook] checkout.session.completed — session ${session.id}, ` +
          `amount ${session.amount_total}, email ${session.customer_details?.email}`
      );

      if (isDatabaseConfigured) {
        try {
          await createOrderFromStripeSession(session);
        } catch (error) {
          // Don't fail the webhook response over a DB hiccup — Stripe's
          // own record of the payment is unaffected either way, and a
          // failed write here just means this order isn't mirrored
          // locally yet. Log loudly so it's not silently lost.
          console.error("[stripe webhook] failed to persist order:", error);
        }
      }
      break;
    }
    default:
      // Other event types aren't handled yet — acknowledging with 200
      // either way tells Stripe not to retry.
      break;
  }

  return NextResponse.json({ received: true });
}
