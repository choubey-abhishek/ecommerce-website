"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO } from "@/animations/variants";

export default function HomeAboutTeaser() {
  return (
    <section className="bg-paper">
      <Container className="grid grid-cols-1 items-center gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE_STUDIO }}
          className="relative order-2 aspect-[4/5] overflow-hidden rounded-2xl bg-sand-100 lg:order-1"
        >
          <Image
            src="/26.avif"
            alt="Kopal Seth at work in the studio"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: EASE_STUDIO }}
          className="order-1 lg:order-2"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            The Artist
          </p>
          <h2 className="mt-3 font-serif text-display-md font-light text-ink">
            A Practice Rooted in Form and Patience
          </h2>
          <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
            MFA in Ceramics from RISD, former resident artist at The Clay
            Studio in Philadelphia, and exhibited across India and the
            United States — Kopal&apos;s work moves between vessel and
            sculpture.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex items-center gap-2 font-sans text-[13px] uppercase tracking-widest text-ink transition-transform duration-500 hover:translate-x-1"
          >
            Read the Full Story →
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
