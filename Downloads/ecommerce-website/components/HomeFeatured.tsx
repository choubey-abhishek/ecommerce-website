import { ProductRail } from "@/components/home/product-rail";
import { getFeaturedProducts } from "@/lib/products";

export default function HomeFeatured() {
  return (
    <ProductRail
      kicker="Featured Collection"
      title="From the Studio"
      viewAllHref="/shop"
      viewAllLabel="View Full Collection →"
      products={getFeaturedProducts(4)}
      tone="paper"
    />
  );
}
