"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE_STUDIO } from "@/animations/variants";

/**
 * Split out of ProductGallery so `@radix-ui/react-dialog` (and the
 * motion/portal wiring around it) only loads for visitors who actually
 * click to open the full-screen view — not every product-page visitor,
 * most of whom never do. See the `next/dynamic` import in
 * product-gallery.tsx.
 */
export function ProductLightbox({
  images,
  title,
  activeImage,
  activeIndex,
  open,
  onOpenChange,
  onNavigate,
}: {
  images: string[];
  title: string;
  activeImage: string;
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (index: number) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-ink/90"
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: EASE_STUDIO }}
                className="fixed inset-0 z-[110] flex items-center justify-center p-6"
              >
                <Dialog.Title className="sr-only">{title} — full-screen view</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Full-screen view of {title}. Use the arrow buttons to browse additional
                  images, or close to return to the product page.
                </Dialog.Description>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close full-screen view"
                    className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </Dialog.Close>

                {images.length > 1 && (
                  <>
                    <button
                      aria-label="Previous image"
                      onClick={() => onNavigate(activeIndex - 1)}
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                    <button
                      aria-label="Next image"
                      onClick={() => onNavigate(activeIndex + 1)}
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  </>
                )}

                <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
                  <Image src={activeImage} alt={title} fill sizes="90vw" className="object-contain" />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
