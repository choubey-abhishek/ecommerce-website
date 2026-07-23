import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="July 2026">
      <p>
        {siteConfig.legalName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
        respects your privacy. This policy explains what information we
        collect when you visit {siteConfig.url}, how we use it, and the
        choices you have.
      </p>

      <h2>Information We Collect</h2>
      <p>
        When you browse the site, we automatically collect limited technical
        information (browser type, device type, pages viewed, and referring
        URL) through standard analytics tooling. When you make a purchase,
        create an account, or contact us, we collect the information you
        provide directly: name, email address, shipping address, and order
        details. Payment card details are entered and processed directly by
        our payment processor and are never stored on our servers.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill orders, including shipping and customs documentation for international deliveries.</li>
        <li>To respond to inquiries sent via email, phone, or Instagram.</li>
        <li>To send order confirmations, shipping updates, and, if you opt in, occasional studio updates and new-collection announcements.</li>
        <li>To maintain the security and functioning of the website.</li>
      </ul>

      <h2>Sharing of Information</h2>
      <p>
        We do not sell your personal information. We share information only
        with the service providers required to run the store — payment
        processing, shipping and logistics, and email delivery — and only to
        the extent needed for them to perform those services.
      </p>

      <h2>Cookies</h2>
      <p>
        The site uses essential cookies to remember your cart and session,
        and may use analytics cookies to understand how visitors use the
        site. You can control cookies through your browser settings.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your
        personal information at any time by emailing{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.email}
        </a>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be directed to{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.email}
        </a>{" "}
        or {siteConfig.contact.phoneDisplay}.
      </p>
    </LegalPageLayout>
  );
}
