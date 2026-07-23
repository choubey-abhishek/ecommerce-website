import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { ShopPageClient } from "@/features/shop/components/shop-page-client";
import { ShopResultsSkeleton } from "@/components/ShopResultsSkeleton";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description:
    "Browse the full collection of hand-built and thrown ceramics by Kopal Seth — vessels, sculptural work, vases, and tableware. Filter by category, price, and availability.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl sm:mb-20">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            The Collection
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Shop the Studio
          </h1>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink/60">
            Each piece is hand-built or thrown individually, so subtle
            variations in glaze, form, and texture are part of its character.
            Once a piece is gone, it won&apos;t be made again.
          </p>
        </div>

        {/*
          useShopFilters reads the URL via useSearchParams, which opts this
          subtree into client-side rendering during the static shell — the
          Suspense boundary keeps that scoped to the shop UI instead of the
          whole route.
        */}
        <Suspense fallback={<ShopResultsSkeleton />}>
          <ShopPageClient />
        </Suspense>
      </Container>
    </div>
  );
}
