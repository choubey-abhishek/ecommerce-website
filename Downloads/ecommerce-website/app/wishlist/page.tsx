import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = buildMetadata({
  title: "Wishlist",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl sm:mb-20">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Saved
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Your Wishlist
          </h1>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink/60">
            Pieces you&apos;ve saved on this device. Since most works are
            one of a kind, a saved piece can still sell before you&apos;re
            ready to buy.
          </p>
        </div>

        <WishlistView />
      </Container>
    </div>
  );
}
