"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO } from "@/animations/variants";
import { testimonials } from "@/config/testimonials";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const AUTO_ADVANCE_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = usePrefersReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [index]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const current = testimonials[index];

  return (
    <section className="bg-paper">
      <Container narrow className="py-24 text-center sm:py-32">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          What Collectors Say
        </p>

        <div className="relative mt-10 min-h-[220px] sm:min-h-[180px]">
          <Quote
            className="mx-auto h-8 w-8 text-clay-300"
            strokeWidth={1.25}
            aria-hidden="true"
          />

          <div className="relative mt-6" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 24 }}
                transition={{ duration: 0.5, ease: EASE_STUDIO }}
              >
                <blockquote className="font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 font-sans text-[13px] uppercase tracking-widest text-ink/60">
                  {current.name} — {current.role}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-sand-100 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-sand-100 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </Container>
    </section>
  );
}
