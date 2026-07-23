"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/animations/variants";
import { siteConfig } from "@/config/site";
import { products } from "@/lib/products";

const instagramHandle = siteConfig.socials.find((s) => s.icon === "instagram");

/**
 * Static grid linking out to the real Instagram profile. Deliberately
 * not faking a "live" feed — a genuine live embed needs the Instagram
 * Graph API (a Meta developer app + long-lived token, refreshed on a
 * schedule) which belongs in `services/instagram.ts` once there's a
 * backend to hold that token. Swapping this in later is a drop-in
 * replacement for the `<Image>` grid below.
 */
export function InstagramFeed() {
  const tiles = products.slice(0, 6);

  return (
    <section className="bg-sand-50">
      <Container className="py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mb-14 flex flex-col items-start justify-between gap-4 sm:mb-16 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Follow Along
            </p>
            <h2 className="mt-3 font-serif text-display-md font-light text-ink">
              @kopalseth_studio
            </h2>
          </div>
          {instagramHandle && (
            <Button asChild variant="outline" size="sm">
              <a href={instagramHandle.href} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} />
                Follow on Instagram
              </a>
            </Button>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((product, i) => (
            <motion.a
              key={product.id}
              href={instagramHandle?.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-sand-100"
              aria-label="View more on Instagram"
            >
              <Image
                src={product.image}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover transition-transform duration-500 ease-studio group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/30">
                <Instagram
                  className="h-5 w-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  strokeWidth={1.5}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </Container>
    </section>
  );
}
