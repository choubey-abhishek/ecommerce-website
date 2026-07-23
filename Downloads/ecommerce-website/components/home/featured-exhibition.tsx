"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { EASE_STUDIO } from "@/animations/variants";

export function FeaturedExhibition() {
  return (
    <section className="bg-paper">
      <Container className="py-24 sm:py-32">
        <div className="grid grid-cols-1 items-center gap-12 rounded-4xl bg-stone-50 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE_STUDIO }}
          >
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Featured Exhibition
            </p>
            <h2 className="mt-3 font-serif text-display-md font-light text-ink">
              Solo Exhibition
              <br />
              The Clay Studio, Philadelphia
            </h2>
            <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
              Kopal&apos;s solo show at The Clay Studio in Philadelphia,
              PA — where she was a resident artist — followed group
              exhibitions at The Gelman Gallery (RISD Museum), The
              Lacoste/Keane Gallery in Concord, MA, and Art Centrix Space
              in New Delhi.
            </p>
            <Button asChild variant="outline" size="md" className="mt-8">
              <Link href="/about#exhibitions">View All Exhibitions →</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: EASE_STUDIO }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand-100"
          >
            <Image
              src="/3.avif"
              alt="Installation view from Kopal Seth's solo exhibition at The Clay Studio, Philadelphia"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
