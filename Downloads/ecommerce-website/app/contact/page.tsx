import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Kopal Seth Studio — commissions, wholesale, exhibitions, workshops, and general inquiries. Send a message and we'll reply by email.",
  path: "/contact",
});

const INFO = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.contact.phoneDisplay,
    href: `tel:${siteConfig.contact.phone}`,
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "New Delhi, India",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sat · 10am – 6pm IST",
  },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden pb-24 pt-36 sm:pt-40">
      {/* Soft artistic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50 via-paper to-paper" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-clay-200/40 blur-3xl" />
        <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-terracotta-100/40 blur-3xl" />
      </div>

      <Container>
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
            Get in Touch
          </p>
          <h1 className="mt-3 font-serif text-display-md font-light text-ink">
            Let&apos;s Start a Conversation
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-ink/60">
            Whether it&apos;s a commission, a wholesale order, an exhibition, or
            simply a question about a piece — we&apos;d love to hear from you.
          </p>
        </div>

        {/* Info cards */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map(({ icon: Icon, label, value, href }) => {
            const inner = (
              <div className="glass hover-lift flex h-full flex-col items-start gap-3 rounded-3xl p-6 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                    {label}
                  </p>
                  <p className="mt-1 font-sans text-[14px] text-ink">{value}</p>
                </div>
              </div>
            );
            return href ? (
              <a key={label} href={href} className="block">
                {inner}
              </a>
            ) : (
              <div key={label}>{inner}</div>
            );
          })}
        </div>

        {/* Form */}
        <div className="mx-auto mt-14 max-w-3xl">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
