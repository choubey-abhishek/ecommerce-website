"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_STUDIO } from "@/animations/variants";
import { FiltersContent, type FiltersContentProps } from "@/features/shop/components/shop-filters-panel";

/**
 * Slide-in sheet for small viewports, opened from the toolbar's Filters
 * button. Lives in its own file (rather than alongside ShopFiltersSidebar)
 * so it can be lazily imported — see the `next/dynamic` call in
 * shop-page-client.tsx — keeping `@radix-ui/react-dialog` out of the
 * initial /shop bundle for the desktop visitors who never open it.
 */
export function ShopFiltersMobileSheet({
  open,
  onOpenChange,
  ...props
}: FiltersContentProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
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
                className="fixed inset-0 z-[90] bg-ink/30 backdrop-blur-sm lg:hidden"
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.45, ease: EASE_STUDIO }}
                className="fixed inset-y-0 left-0 z-[95] w-full max-w-xs overflow-y-auto bg-white p-6 shadow-soft lg:hidden"
              >
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title className="font-serif text-lg text-ink">
                    Filters
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close filters"
                      className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand-100"
                    >
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </Dialog.Close>
                </div>

                <FiltersContent {...props} />

                <Dialog.Close asChild>
                  <Button className="mt-10 w-full">Show Results</Button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
