"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO } from "@/animations/variants";
import { subscribeToNewsletter } from "@/services/newsletter";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterSignup() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (values: NewsletterValues) => {
    startTransition(async () => {
      const response = await subscribeToNewsletter(values.email);
      setResult(response);
      if (response.success) reset();
    });
  };

  return (
    <section className="bg-ink">
      <Container narrow className="py-24 text-center sm:py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE_STUDIO }}
          className="font-sans text-xs uppercase tracking-widest text-white/60"
        >
          Studio Notes
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_STUDIO }}
          className="mt-3 font-serif text-display-md font-light text-white"
        >
          New Work, First Look
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_STUDIO }}
          className="mx-auto mt-4 max-w-sm font-sans text-[15px] text-white/60"
        >
          Occasional notes on new collections, exhibitions, and studio life —
          no more than once or twice a month.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE_STUDIO }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1 text-left">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isPending}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "newsletter-error" : undefined}
              className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-sans text-sm text-white placeholder:text-white/45 focus-visible:border-white/50 focus-visible:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p id="newsletter-error" className="mt-2 px-1 font-sans text-xs text-clay-300">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-sans text-[13px] uppercase tracking-widest text-ink transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Sending…" : "Subscribe"}
            {!isPending && <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />}
          </button>
        </motion.form>

        <AnimatePresence>
          {result && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className={`mt-5 flex items-center justify-center gap-2 font-sans text-sm ${
                result.success ? "text-white/80" : "text-clay-300"
              }`}
            >
              {result.success && <Check className="h-4 w-4" strokeWidth={1.5} />}
              {result.message}
            </motion.p>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
