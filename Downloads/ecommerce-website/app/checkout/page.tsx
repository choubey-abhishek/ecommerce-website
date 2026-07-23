import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { isStripeConfigured } from "@/lib/stripe";
import { CheckoutView } from "@/features/cart/components/checkout-stopgap";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container narrow>
        <CheckoutView stripeEnabled={isStripeConfigured} />
      </Container>
    </div>
  );
}
