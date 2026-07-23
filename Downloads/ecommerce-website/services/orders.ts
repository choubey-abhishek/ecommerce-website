import type Stripe from "stripe";
import { isDatabaseConfigured, getPrismaClient } from "@/lib/db";
import { getStripeClient } from "@/lib/stripe";

/**
 * Orders for a signed-in customer, newest first, with their line items.
 * Returns an empty array when no database is configured so the account
 * page renders its empty state instead of erroring — mirrors the rest of
 * the app's graceful-degradation pattern.
 */
export async function getOrdersForUser(clerkUserId: string) {
  if (!isDatabaseConfigured) return [];
  const prisma = getPrismaClient();
  return prisma.order.findMany({
    where: { clerkUserId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Persists a completed Stripe Checkout Session as a local Order, called
 * from the webhook (`app/api/webhooks/stripe/route.ts`). Idempotent on
 * `stripeSessionId` (upsert) since Stripe retries webhook deliveries —
 * running this twice for the same session must not create duplicate
 * orders.
 *
 * No-ops entirely if no database is configured; the webhook still logs
 * and returns 200 either way so Stripe doesn't retry unnecessarily.
 */
export async function createOrderFromStripeSession(session: Stripe.Checkout.Session) {
  if (!isDatabaseConfigured) return null;

  const prisma = getPrismaClient();
  const stripe = getStripeClient();

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });

  return prisma.order.upsert({
    where: { stripeSessionId: session.id },
    update: {
      status: session.payment_status === "paid" ? "PAID" : "PENDING",
    },
    create: {
      stripeSessionId: session.id,
      status: session.payment_status === "paid" ? "PAID" : "PENDING",
      customerEmail: session.customer_details?.email ?? undefined,
      customerName: session.customer_details?.name ?? undefined,
      subtotalCents: session.amount_subtotal ?? session.amount_total ?? 0,
      discountCents:
        (session.amount_subtotal ?? 0) - (session.amount_total ?? 0) >= 0 &&
        session.total_details?.amount_discount
          ? session.total_details.amount_discount
          : 0,
      shippingCents: session.total_details?.amount_shipping ?? 0,
      totalCents: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      clerkUserId: session.client_reference_id ?? undefined,
      items: {
        create: lineItems.data.map((item) => {
          const product = item.price?.product;
          const slug =
            product && typeof product === "object" && "metadata" in product
              ? (product.metadata as Record<string, string>).slug
              : undefined;

          return {
            productSlug: slug ?? "unknown",
            title: item.description ?? "Item",
            unitPriceCents: item.price?.unit_amount ?? 0,
            quantity: item.quantity ?? 1,
          };
        }),
      },
    },
  });
}
