import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  path: "/terms-conditions",
});

export default function TermsConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" updated="July 2026">
      <p>
        These terms govern your use of {siteConfig.url} and any purchase made
        through it. By using the site or placing an order, you agree to
        these terms.
      </p>

      <h2>Products</h2>
      <p>
        Every piece is handmade by Kopal Seth. Because of the nature of
        hand-built and thrown ceramics, slight variations in glaze, form,
        texture, and dimensions between the photographed piece and the piece
        you receive are expected and are part of the work&apos;s character,
        not a defect.
      </p>

      <h2>Pricing &amp; Availability</h2>
      <p>
        Prices are listed in USD and are subject to change without notice.
        Because most works are one of a kind, availability is not guaranteed
        until an order is confirmed — in the rare case a piece sells out
        before your order is processed, you&apos;ll be notified and refunded
        in full.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All photography, text, and artwork on this site are the property of{" "}
        {siteConfig.legalName} and may not be reproduced, distributed, or
        used commercially without written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        {siteConfig.legalName} is not liable for indirect, incidental, or
        consequential damages arising from the purchase or use of any piece,
        beyond the value of the piece itself.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute arising
        from a purchase will be handled in accordance with applicable
        consumer protection regulations.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        site after changes are posted constitutes acceptance of the revised
        terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.email}
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
