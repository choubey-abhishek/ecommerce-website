import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout title="Shipping Policy" updated="July 2026">
      <p>
        Every piece is ceramic, hand-built or thrown, and one of a kind — so
        we take particular care in how it&apos;s packed and shipped. Please
        read the details below before placing an order.
      </p>

      <h2>Processing Time</h2>
      <p>
        Orders are custom-packed by hand and typically ship within 3–7
        business days of purchase. During exhibition periods or the holiday
        season, processing may take slightly longer — you&apos;ll be notified
        by email if that&apos;s the case.
      </p>

      <h2>Packaging</h2>
      <p>
        Each work is individually wrapped, cushioned, and double-boxed to
        withstand transit. Custom crating is available on request for larger
        sculptural pieces — contact us before ordering if your piece is
        particularly large or fragile.
      </p>

      <h2>Domestic Shipping (India)</h2>
      <p>
        Domestic orders ship via a tracked courier service. Estimated
        delivery is 3–8 business days from dispatch, depending on location.
      </p>

      <h2>International Shipping</h2>
      <p>
        We ship worldwide via tracked, insured international courier.
        Estimated delivery is 7–21 business days from dispatch depending on
        destination and customs processing. International orders may be
        subject to import duties, taxes, and customs fees levied by the
        destination country; these are the responsibility of the buyer and
        are not included in the item price or shipping cost.
      </p>

      <h2>Damage in Transit</h2>
      <p>
        In the rare event a piece arrives damaged, photograph the item and
        packaging immediately and email{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.email}
        </a>{" "}
        within 48 hours of delivery. We will arrange a replacement, repair,
        or refund once the claim is reviewed.
      </p>

      <h2>Tracking</h2>
      <p>
        You&apos;ll receive a tracking number by email as soon as your order
        ships. If you haven&apos;t received one within our stated processing
        window, reach out and we&apos;ll look into it right away.
      </p>
    </LegalPageLayout>
  );
}
