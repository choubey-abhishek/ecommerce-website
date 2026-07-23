import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Return Policy",
  path: "/return-policy",
});

export default function ReturnPolicyPage() {
  return (
    <LegalPageLayout title="Return Policy" updated="July 2026">
      <p>
        Because each piece is handmade and often one of a kind, we handle
        returns a little differently than a typical retail store. Please
        read this policy before purchasing.
      </p>

      <h2>Eligibility</h2>
      <p>
        Unless a piece is marked final sale, you may request a return within
        7 days of delivery. To be eligible, the item must be unused, in its
        original condition, and returned in its original packaging.
        Commissioned or custom pieces are final sale and are not eligible for
        return.
      </p>

      <h2>How to Request a Return</h2>
      <p>
        Email{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-ink underline underline-offset-4">
          {siteConfig.contact.email}
        </a>{" "}
        with your order number and reason for return. We&apos;ll confirm
        eligibility and provide return shipping instructions. Because these
        are fragile, high-value ceramic works, returns must be packed exactly
        as received and shipped with a trackable, insured courier — return
        shipping costs are the responsibility of the buyer unless the return
        is due to damage or a fulfillment error on our part.
      </p>

      <h2>Refunds</h2>
      <p>
        Once the returned piece is received and inspected, we&apos;ll process
        your refund to the original payment method within 5–10 business
        days. Original shipping charges are non-refundable.
      </p>

      <h2>Damaged or Incorrect Items</h2>
      <p>
        If your piece arrived damaged or isn&apos;t what you ordered, see our{" "}
        <a href="/shipping-policy" className="text-ink underline underline-offset-4">
          Shipping Policy
        </a>{" "}
        for how to file a claim — these are resolved at no cost to you.
      </p>

      <h2>Exchanges</h2>
      <p>
        Because most pieces are one of a kind, direct exchanges aren&apos;t
        usually possible. If you&apos;d like a different piece, we recommend
        returning the original for a refund and placing a new order while the
        piece you want is still available.
      </p>
    </LegalPageLayout>
  );
}
