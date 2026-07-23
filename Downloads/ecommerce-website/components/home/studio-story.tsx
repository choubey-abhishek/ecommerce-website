"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO } from "@/animations/variants";

/**
 * "Studio Story" is a sensory, process-driven counterpart to the more
 * biographical "Artist Introduction" (HomeAboutTeaser) — it's about the
 * making, not the CV. Keeping the two visually distinct (full-bleed
 * pull-quote here vs. a two-column bio card there) avoids the home page
 * reading as two versions of the same block.
 */
export function StudioStory() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        whileInView={{ opacity: 0.5, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: EASE_STUDIO }}
        className="absolute inset-0"
      >
        <Image
          src="/27.avif"
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
      </motion.div>

      <Container className="relative py-28 sm:py-40">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_STUDIO }}
          className="font-sans text-xs uppercase tracking-widest text-white/60"
        >
          In the Studio
        </motion.p>

        {/*
          Editorial copy, not a quote — intentionally not attributed to
          Kopal in the first person. Swap for her own words if/when she
          wants to write a real studio statement; until then this reads
          as brand narrative rather than a fabricated personal quote.
        */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_STUDIO }}
          className="mt-6 max-w-3xl font-serif text-3xl italic leading-snug text-white sm:text-4xl lg:text-5xl"
        >
          Clay holds the memory of every hand that shapes it — the pressure,
          the pace, the pause. Each piece begins on the wheel or in coils
          and slabs, and carries that process through to the glaze.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE_STUDIO }}
          className="mt-8 font-sans text-sm uppercase tracking-widest text-white/50"
        >
          The Practice
        </motion.p>
      </Container>
    </section>
  );
}
