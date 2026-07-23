"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { siteConfig } from "@/config/site";
import { submitToFormspree, isFormspreeConfigured } from "@/lib/formspree";

export const SERVICE_OPTIONS = [
  "Commission / Custom Piece",
  "Wholesale / Bulk Order",
  "Exhibition / Collaboration",
  "Workshop / Class",
  "Press / Media",
  "General Inquiry",
];

export const BUDGET_OPTIONS = [
  "Under $200",
  "$200 – $500",
  "$500 – $1,000",
  "$1,000+",
  "Not sure yet",
];

const phoneRegex = /^[+]?[\d\s().-]{7,}$/;

const schema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name."),
  company: z.string().trim().optional(),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(phoneRegex, "Enter a valid phone number."),
  subject: z.string().trim().min(1, "Please add a subject."),
  service: z.string().min(1, "Please choose a service."),
  budget: z.string().optional(),
  message: z.string().trim().min(10, "Please add a little more detail (10+ characters)."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please agree to be contacted." }),
  }),
  // Honeypot — real users never fill this hidden field; bots often do.
  _gotcha: z.string().max(0).optional(),
});

type ContactValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white/70 px-4 py-3 font-sans text-[14px] text-ink placeholder:text-ink/40 backdrop-blur-sm transition-colors focus-visible:border-ink focus-visible:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: ContactValues) => {
    setStatus("submitting");
    setErrorMsg(null);

    const result = await submitToFormspree({
      Name: values.fullName,
      Company: values.company,
      Email: values.email,
      Phone: values.phone,
      Subject: values.subject,
      Service: values.service,
      Budget: values.budget,
      Message: values.message,
      Timestamp: new Date().toISOString(),
      Source: "Contact Form",
      _subject: `New inquiry: ${values.subject} — ${values.fullName}`,
    });

    if (result.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex flex-col items-center gap-4 rounded-3xl p-10 text-center shadow-card"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-100 text-clay-600">
          <Check className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="font-serif text-2xl text-ink">Message sent</h3>
          <p className="mx-auto mt-2 max-w-sm font-sans text-[14px] leading-relaxed text-ink/60">
            Thank you for reaching out — we&apos;ve received your inquiry and
            will reply by email shortly.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send Another
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass rounded-3xl p-6 shadow-card sm:p-8"
    >
      {!isFormspreeConfigured && (
        <p className="mb-6 flex items-start gap-2 rounded-xl bg-clay-50 px-4 py-3 font-sans text-[13px] text-ink/70">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-clay-600" strokeWidth={1.5} />
          <span>
            The form endpoint isn&apos;t configured yet. Add{" "}
            <code className="rounded bg-white px-1 py-0.5 text-[12px]">
              NEXT_PUBLIC_FORMSPREE_ENDPOINT
            </code>{" "}
            to <code className="rounded bg-white px-1 py-0.5 text-[12px]">.env.local</code>, or email{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="underline">
              {siteConfig.contact.email}
            </a>
            .
          </span>
        </p>
      )}

      {/* Honeypot (visually hidden, off-screen) */}
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label>
          Leave this field empty
          <input type="text" tabIndex={-1} autoComplete="off" {...register("_gotcha")} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName?.message}>
          <input className={inputClass} autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label="Company name" error={errors.company?.message}>
          <input className={inputClass} autoComplete="organization" {...register("company")} />
        </Field>
        <Field label="Email address" required error={errors.email?.message}>
          <input className={inputClass} type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label="Phone number" required error={errors.phone?.message}>
          <input className={inputClass} type="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Subject" required error={errors.subject?.message}>
            <input className={inputClass} {...register("subject")} />
          </Field>
        </div>
        <Field label="Service interested in" required error={errors.service?.message}>
          <select className={cn(inputClass, "appearance-none")} defaultValue="" {...register("service")}>
            <option value="" disabled>
              Choose a service…
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget (optional)" error={errors.budget?.message}>
          <select className={cn(inputClass, "appearance-none")} defaultValue="" {...register("budget")}>
            <option value="">Select a range…</option>
            {BUDGET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Message" required error={errors.message?.message}>
            <textarea
              className={cn(inputClass, "min-h-[130px] resize-y")}
              placeholder="Tell us about your project or inquiry…"
              {...register("message")}
            />
          </Field>
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 font-sans text-[13px] text-ink/70">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 flex-none rounded border-ink/30 text-ink focus-visible:outline-none"
          {...register("consent")}
        />
        <span>
          I agree to be contacted regarding my inquiry.
          {errors.consent && (
            <span className="mt-1 block text-terracotta-600">{errors.consent.message}</span>
          )}
        </span>
      </label>

      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-5 flex items-center gap-2 rounded-xl bg-terracotta-100 px-4 py-3 font-sans text-[13px] text-terracotta-600"
          >
            <AlertCircle className="h-4 w-4 flex-none" strokeWidth={1.5} />
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" strokeWidth={1.5} /> Send Message
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[12px] font-medium tracking-wide text-ink/70">
        {label}
        {required && <span className="text-terracotta-500"> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 block font-sans text-[12px] text-terracotta-600">{error}</span>
      )}
    </label>
  );
}
