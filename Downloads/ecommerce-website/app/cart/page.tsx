import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { CartPageView } from "@/features/cart/components/cart-page-view";

export const metadata: Metadata = buildMetadata({
  title: "Your Bag",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <h1 className="mb-14 font-serif text-display-md font-light text-ink sm:mb-20">
          Your Bag
        </h1>
        <CartPageView />
      </Container>
    </div>
  );
}
