"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO, fadeUp } from "@/animations/variants";
import { PRODUCT_CATEGORIES, getProductsByCategory } from "@/lib/products";

const COLLECTION_COPY: Record<string, string> = {
  Vessels: "Hand-built forms for holding, gathering, and display.",
  Sculptural: "Standalone works exploring form, gesture, and negative space.",
  Vases: "Thrown vessels for flowers, branches, and quiet corners.",
  Tableware: "Functional, food-safe pieces made for everyday use.",
};

export function ShopByCollection() {
  return (
    <section className="bg-sand-50">
      <Container className="py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_STUDIO }}
          className="mb-14 sm:mb-20"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Browse
          </p>
          <h2 className="mt-3 font-serif text-display-md font-light text-ink">
            Shop by Collection
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_CATEGORIES.map((category, i) => {
            const pieces = getProductsByCategory(category);
            const preview = pieces[0];
            return (
              <motion.div
                key={category}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Link
                  href={`/shop?category=${category.toLowerCase()}`}
                  className="group block"
                  aria-label={`Shop the ${category} collection`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand-100 shadow-card transition-shadow duration-500 group-hover:shadow-soft">
                    {preview && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: EASE_STUDIO }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={preview.image}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />

                    <span className="absolute right-4 top-4 rounded-full bg-white/85 px-2.5 py-1 font-sans text-[10px] uppercase tracking-widest text-ink/70 backdrop-blur-sm">
                      {pieces.length} {pieces.length === 1 ? "piece" : "pieces"}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-serif text-xl text-white">{category}</h3>
                        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-all duration-500 ease-studio group-hover:opacity-100 sm:-translate-x-1 sm:group-hover:translate-x-0">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </span>
                      </div>
                      <p className="mt-1 max-w-[22ch] font-sans text-[12px] leading-relaxed text-white/85">
                        {COLLECTION_COPY[category]}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
