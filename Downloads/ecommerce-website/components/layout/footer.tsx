"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, Facebook } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { fadeUp } from "@/animations/variants";

const SOCIAL_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  email: Mail,
  phone: Phone,
};

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-ink/10 bg-sand-50">
      <Container className="py-20">
        {/* Editorial wordmark band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 border-b border-ink/10 pb-14"
        >
          <p className="font-sans text-xs uppercase tracking-widest text-ink/55">
            {siteConfig.artist.role}
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-display-md font-light leading-[1.05] text-ink">
            Kopal Seth <span className="text-gradient">Studio</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div custom={0} variants={fadeUp}>
            <h3 className="font-sans text-xs uppercase tracking-widest text-ink/55">
              The Studio
            </h3>
            <p className="mt-4 max-w-xs font-sans text-[14px] leading-relaxed text-ink/70">
              {siteConfig.artist.role} — hand-built and thrown ceramics, made in small batches.
            </p>
            <ul className="mt-6 space-y-3 font-sans text-[13px] text-ink/70">
              {siteConfig.socials.map((social) => {
                // 1. Widen the type to a standard string to bypass the TypeScript overlap error
                const iconName: string = social.icon;
                
                // 2. Safely map the icon component with a fallback
                const Icon = SOCIAL_ICONS[social.icon as keyof typeof SOCIAL_ICONS] || Mail;

                return (
                  <li key={social.href}>
                    <a
                      href={social.href}
                      target={iconName === "instagram" ? "_blank" : undefined}
                      rel={iconName === "instagram" ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-2.5 transition-colors hover:text-ink"
                    >
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink/5 transition-colors group-hover:bg-ink group-hover:text-white">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        {iconName === "instagram" && "@kopalseth_studio"}
                        {iconName === "email" && siteConfig.contact.email}
                        {iconName === "phone" && siteConfig.contact.phoneDisplay}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {siteConfig.footerLinks.map((group, i) => (
            <motion.div key={group.title} custom={i + 1} variants={fadeUp}>
              <h3 className="font-sans text-xs uppercase tracking-widest text-ink/55">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3 font-sans text-[14px] text-ink/70">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 font-sans text-xs text-ink/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <a
            href={siteConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline transition-colors hover:text-ink"
          >
            kopalseth.com
          </a>
        </div>
      </Container>
    </footer>
  );
}
