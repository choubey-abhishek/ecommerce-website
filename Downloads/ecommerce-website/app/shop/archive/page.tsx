import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = buildMetadata({
  title: "Sold Archive",
  description:
    "A record of past works by Kopal Seth that have found their homes — kept here for collectors, galleries, and reference.",
  path: "/shop/archive",
});

export default function SoldArchivePage() {
  const archived = products.filter((p) => p.sold);

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <Container>
        <div className="mb-14 max-w-xl sm:mb-20">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Archive
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Sold Works
          </h1>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink/60">
            A record of past pieces that have found their homes. Each is one
            of a kind and won&apos;t be remade — this archive exists for
            collectors, galleries, and press reference.
          </p>
        </div>

        {archived.length === 0 ? (
          <p className="py-24 text-center font-sans text-ink/50">
            No pieces have moved to the archive yet — check the{" "}
            <a href="/shop" className="underline underline-offset-4 hover:text-ink">
              current collection
            </a>{" "}
            instead.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {archived.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
