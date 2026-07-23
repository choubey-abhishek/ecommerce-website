"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils";

// Only visitors who click through to the full-screen view pay for
// @radix-ui/react-dialog and its portal/motion wiring — everyone else's
// product-page bundle stays smaller. No `ssr: false` concern here since
// the lightbox has no content that isn't already visible in the main
// gallery image; there's nothing for search engines to lose.
const ProductLightbox = dynamic(
  () => import("@/features/product/components/product-lightbox").then((mod) => mod.ProductLightbox),
  { ssr: false }
);

const ZOOM_SCALE = 1.9;

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  const imageRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeIndex] ?? images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasFinePointer) return;
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const goTo = (index: number) => setActiveIndex((index + images.length) % images.length);

  return (
    <div>
      <div
        ref={imageRef}
        role="button"
        tabIndex={0}
        aria-label={`Open full-screen view of ${title}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onClick={() => setLightboxOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl bg-sand-100"
      >
        <Image
          key={activeImage}
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out"
          style={
            isZooming
              ? {
                  transform: `scale(${ZOOM_SCALE})`,
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }
              : undefined
          }
        />
        <div className="pointer-events-none absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-sand-100 ring-1 ring-transparent transition-all",
                i === activeIndex ? "ring-ink" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image} alt="" aria-hidden="true" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <ProductLightbox
          images={images}
          title={title}
          activeImage={activeImage}
          activeIndex={activeIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          onNavigate={goTo}
        />
      )}
    </div>
  );
}
