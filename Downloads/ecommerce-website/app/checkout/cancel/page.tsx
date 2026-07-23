import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout Cancelled",
  path: "/checkout/cancel",
  noIndex: true,
});

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center pt-24">
      <Container narrow className="text-center">
        <XCircle className="mx-auto h-10 w-10 text-ink/30" strokeWidth={1.25} />
        <h1 className="mt-5 font-serif text-display-md font-light text-ink">
          Checkout Cancelled
        </h1>
        <p className="mx-auto mt-4 max-w-sm font-sans text-[15px] leading-relaxed text-ink/60">
          No payment was made, and your bag is exactly as you left it.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="md">
            <Link href="/cart">Back to Bag</Link>
          </Button>
          <Button asChild size="md" variant="outline">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
