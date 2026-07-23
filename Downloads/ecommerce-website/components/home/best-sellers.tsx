import { ProductRail } from "@/components/home/product-rail";
import { getBestSellers } from "@/lib/products";

export function BestSellers() {
  return (
    <ProductRail
      kicker="Trending Now"
      title="Most Coveted"
      viewAllHref="/shop"
      viewAllLabel="Shop All →"
      products={getBestSellers(4)}
      tone="sand"
      cardBadge="Trending"
    />
  );
}
