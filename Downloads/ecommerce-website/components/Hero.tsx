"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_STUDIO, textReveal } from "@/animations/variants";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { siteConfig } from "@/config/site";

const HEADLINE_WORDS = siteConfig.name.split(" ");

export default function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const fade = (delay: number) =>
    prefersReducedMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE_STUDIO },
        };

  return (
    <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-gradient-to-br from-cream-50 via-sand-50 to-clay-100">
      {/* Artistic animated background — light, subtle, GPU-friendly */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="animate-blob absolute -left-24 top-8 h-[28rem] w-[28rem] rounded-full bg-clay-300/40 mix-blend-multiply blur-3xl" />
        <div
          className="animate-blob-slow absolute -right-20 bottom-0 h-[32rem] w-[32rem] rounded-full bg-terracotta-300/30 mix-blend-multiply blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute left-1/2 top-1/3 h-72 w-72 rounded-full bg-olive-200/40 mix-blend-multiply blur-3xl"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-32 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-28">
        {/* Text column */}
        <div>
          <motion.p
            {...fade(0.4)}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-4 py-1.5 font-sans text-[11px] uppercase tracking-widest text-ink/70 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-clay-500" />
            {siteConfig.artist.role}
          </motion.p>

          <h1 className="mt-6 flex flex-wrap font-serif text-display-xl font-light leading-[0.98] text-ink">
            {HEADLINE_WORDS.map((word, i) => (
              <span key={word} className="mr-[0.25em] overflow-hidden">
                <motion.span
                  custom={i + 1}
                  variants={textReveal}
                  initial={prefersReducedMotion ? false : "hidden"}
                  animate="visible"
                  className="inline-block"
                >
                  {word === "Studio" ? <span className="text-gradient">{word}</span> : word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...fade(0.95)}
            className="mt-6 max-w-md font-sans text-lg leading-relaxed text-ink/70 sm:text-xl"
          >
            Contemporary Ceramics &amp; Clay Art — hand-built and thrown, each
            piece one of a kind.
          </motion.p>

          <motion.div
            {...fade(1.15)}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg" magnetic className="shadow-soft">
              <Link href="/shop">
                Explore the Collection
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Our Story</Link>
            </Button>
          </motion.div>
        </div>

        {/* Image column */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE_STUDIO }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-[2.75rem] bg-gradient-to-tr from-clay-200/60 via-cream-100/50 to-terracotta-100/40 blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 shadow-lift">
            <Image
              src="/25.avif"
              alt="A signature ceramic piece by Kopal Seth, hand-built stoneware vessel"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 60vw, 90vw"
              className="object-cover"
            />
          </div>
          {/* Floating glass accent */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE_STUDIO }}
            className="glass absolute -bottom-5 -left-5 hidden rounded-2xl px-5 py-4 shadow-card sm:block"
          >
            <p className="font-serif text-lg text-ink">Handmade to order</p>
            <p className="mt-0.5 font-sans text-[11px] uppercase tracking-widest text-ink/55">
              Studio · India
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5 text-ink/40" strokeWidth={1.25} aria-hidden="true" />
        </motion.div>
      </motion.div>
    </section>
  );
}
