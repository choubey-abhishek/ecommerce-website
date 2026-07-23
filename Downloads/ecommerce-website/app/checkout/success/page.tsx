import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { isStripeConfigured, getStripeClient } from "@/lib/stripe";
import { formatCurrency } from "@/utils";
import { ClearCartOnMount } from "@/features/cart/components/clear-cart-on-mount";

export const metadata: Metadata = buildMetadata({
  title: "Order Confirmed",
  path: "/checkout/success",
  noIndex: true,
});

async function getPaidSession(sessionId: string | undefined) {
  if (!sessionId || !isStripeConfigured) return null;
  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid" ? session : null;
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const session = await getPaidSession(searchParams?.session_id);

  return (
    <div className="flex min-h-[70vh] items-center pt-24">
      <Container narrow className="text-center">
        {session && <ClearCartOnMount />}

        <CheckCircle2 className="mx-auto h-10 w-10 text-clay-500" strokeWidth={1.25} />
        <h1 className="mt-5 font-serif text-display-md font-light text-ink">
          {session ? "Order Confirmed" : "Thank You"}
        </h1>

        {session ? (
          <>
            <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
              Your order has been received. A confirmation has been sent to{" "}
              {session.customer_details?.email ?? "your email"}.
            </p>
            <div className="mx-auto mt-8 max-w-xs rounded-2xl bg-sand-50 p-6 font-sans text-[13px] text-ink/70">
              <div className="flex justify-between">
                <span className="text-ink/50">Order Reference</span>
                <span>{session.id.slice(-10).toUpperCase()}</span>
              </div>
              {typeof session.amount_total === "number" && (
                <div className="mt-2 flex justify-between">
                  <span className="text-ink/50">Amount Charged</span>
                  <span>
                    {formatCurrency(
                      session.amount_total / 100,
                      session.currency?.toUpperCase() ?? "USD"
                    )}
                  </span>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
            If you just completed a purchase, check your email for
            confirmation. If you&apos;re not sure what happened, reach out
            and we&apos;ll sort it out.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="md">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild size="md" variant="outline">
            <Link href="/#contact">Contact the Studio</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
