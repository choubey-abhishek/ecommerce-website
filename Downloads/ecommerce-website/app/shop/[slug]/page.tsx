import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { buildMetadata, buildProductJsonLd } from "@/lib/seo";
import { getProductBySlug, getRecommendedProducts, products } from "@/lib/products";
import { ProductGallery } from "@/features/product/components/product-gallery";
import { ProductInfo } from "@/features/product/components/product-info";
import { ProductRail } from "@/components/home/product-rail";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return buildMetadata({ title: "Piece Not Found", noIndex: true });
  }

  return buildMetadata({
    title: product.title,
    description: product.description,
    path: `/shop/${product.slug}`,
  });
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const recommended = getRecommendedProducts(product, 4);
  const jsonLd = buildProductJsonLd(product);

  return (
    <div className="pb-24 pt-36 sm:pt-40">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo product={product} />
        </div>
      </Container>

      {recommended.length > 0 && (
        <div className="mt-24 sm:mt-32">
          <ProductRail
            kicker="You May Also Like"
            title="More From the Studio"
            viewAllHref="/shop"
            viewAllLabel="Shop All →"
            products={recommended}
            tone="sand"
          />
        </div>
      )}
    </div>
  );
}
