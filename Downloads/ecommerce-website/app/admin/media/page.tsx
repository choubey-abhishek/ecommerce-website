import type { Metadata } from "next";
import Image from "next/image";
import { Images } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/products";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Media Library",
  path: "/admin/media",
  noIndex: true,
});

export default function AdminMediaPage() {
  const allImages = Array.from(new Set(products.flatMap((p) => p.images)));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Media Library</h2>
        <p className="max-w-xs text-right font-sans text-[12px] text-ink/40">
          Upload/replace arrives with Cloudinary in Phase 9 — this is a
          read-only view of what&apos;s referenced in the catalog today
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-sand-50 p-4">
        <Images className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay-500" strokeWidth={1.5} />
        <p className="font-sans text-[13px] leading-relaxed text-ink/60">
          Every image below is a placeholder SVG (see{" "}
          <code className="text-[12px]">public/artwork/</code>). Once
          Cloudinary is connected, this page becomes a real upload/manage
          library instead of a static list.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
        {allImages.map((src) => (
          <div key={src} className="relative aspect-square overflow-hidden rounded-lg bg-sand-100">
            <Image src={src} alt="" fill sizes="150px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
